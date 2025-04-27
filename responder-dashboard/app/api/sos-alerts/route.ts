// app/api/sos-alerts/route.ts (for Next.js App Router)

import { NextResponse } from "next/server";

// In-memory storage
let sosAlerts: any[] = [];
let clients: WritableStreamDefaultWriter[] = []; // For SSE connections

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newAlert = {
      ...body,
      receivedAt: new Date().toISOString(),
    };

    // Store in memory
    sosAlerts.push(newAlert);

    // Notify all live clients
    clients.forEach((res) => {
      res.write(`data: ${JSON.stringify(newAlert)}\n\n`);
    });

    return NextResponse.json(
      { success: true, alert: newAlert },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing SOS alert:", error);
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }
}

// For setting up the SSE stream
export async function GET(req: Request) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  const encoder = new TextEncoder();

  writer.write(encoder.encode("retry: 10000\n\n")); // Retry every 10s if disconnected

  const response = new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });

  clients.push(writer);

  req.signal.addEventListener("abort", () => {
    clients = clients.filter((c) => c !== writer);
    writer.close();
  });

  return response;
}
