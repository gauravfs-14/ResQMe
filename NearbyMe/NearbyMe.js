// server.js

const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const SERPAPI_KEY = process.env.SERPAPI_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Helper to get distance
const getDistance = async (origins, destinations) => {
    const distanceResponse = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
        params: {
            origins: origins,
            destinations: destinations,
            mode: "driving",
            key: GOOGLE_API_KEY
        }
    });

    const distanceText = distanceResponse.data.rows[0].elements[0]?.distance?.text || "Unknown";
    const distanceValue = distanceResponse.data.rows[0].elements[0]?.distance?.value || Infinity; // value in meters
    return { distanceText, distanceValue };
}

// Endpoint: /nearby
app.get('/nearby', async (req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ error: "Latitude and Longitude are required." });
    }

    let hospitals = [];
    let policeStations = [];
    let fireStations = [];

    try {
        const serpApiUrl = "https://serpapi.com/search.json";

        async function searchPlaces(query) {
            const params = {
                engine: "google_maps",
                type: "search",
                ll: `@${lat},${lng},15z`,
                q: query,
                api_key: SERPAPI_KEY
            };
            const response = await axios.get(serpApiUrl, { params });
            const places = response.data.local_results || [];

            return places.map(place => ({
                name: place.title,
                address: place.address,
                coordinates: place.gps_coordinates
            }));
        }

        hospitals = await searchPlaces("hospitals");
        policeStations = await searchPlaces("police stations");
        fireStations = await searchPlaces("fire stations");

        const places = { hospitals, policeStations, fireStations };

        // 1. Add distance info to each place
        await Promise.all(
            Object.values(places).flatMap(list =>
                list.map(async (place) => {
                    const { distanceText, distanceValue } = await getDistance(
                        `${lat},${lng}`,
                        `${place.coordinates.latitude},${place.coordinates.longitude}`
                    );
                    place.distance = distanceText;
                    place.distanceValue = distanceValue; // for sorting
                })
            )
        );

        // 2. Sort each list by distanceValue (smallest first) and slice top 5
        Object.keys(places).forEach(key => {
            places[key] = places[key]
                .filter(place => place.distanceValue !== Infinity) // Remove invalid places
                .sort((a, b) => a.distanceValue - b.distanceValue)
                .slice(0, 5);
        });

        res.json({
            hospitals: places.hospitals,
            policeStations: places.policeStations,
            fireStations: places.fireStations
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch nearby places." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
