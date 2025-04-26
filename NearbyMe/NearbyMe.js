// server.js

const express = require('express');
const axios = require('axios');
const app = express();

require('dotenv').config();


const PORT = process.env.PORT || 3000;  // Fallback to 3000 if not specified

const SERPAPI_KEY = process.env.SERPAPI_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;


const getDistance = async (origins, destinations) => {
    const distanceResponse = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
        params: {
            origins: origins,
            destinations: destinations,
            mode: "driving",
            key: GOOGLE_API_KEY
        }
    });

    return(distanceResponse.data.rows[0].elements[0].distance.text);
}


// Endpoint: /nearby?lat=30.2672&lng=-97.7431
app.get('/nearby', async (req, res) => {
    const { lat, lng } = req.query;

    // Validate input
    if (!lat || !lng) {
        return res.status(400).json({ error: "Latitude and Longitude are required." });
    }

    // Initialize your result arrays
    let hospitals = [];
    let policeStations = [];
    let fireStations = [];

    try {
        const serpApiUrl = "https://serpapi.com/search.json";

        // Helper function to search a specific type
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

        // Run 3 searches one after another
        hospitals = await searchPlaces("hospitals");
        policeStations = await searchPlaces("police stations");
        fireStations = await searchPlaces("fire stations");

        hospitals = hospitals.slice(0, 5);
        policeStations = policeStations.slice(0, 5);
        fireStations = fireStations.slice(0, 5);

        places= {
            hospitals,
            policeStations,
            fireStations
        }
        await Promise.all(
            Object.values(places).flatMap(list =>
                list.map(async (place) => {
                    place.distance = await getDistance(
                        `${lat},${lng}`,
                        `${place.coordinates.latitude},${place.coordinates.longitude}`
                    );
                })
            )
        );
        
        // console.log(finalJson);

        res.json({
            hospitals,
            policeStations,
            fireStations
        });



    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch nearby places." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
