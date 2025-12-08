// app/api/services/route.js
let services = [
  { id: "1", name: "Coupe Homme", description: "Coupe moderne", image: "/images/coupe1.jpg" },
  { id: "2", name: "Coloration", description: "Balayage et mèches", image: "/images/color1.jpg" }
];

import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(request) {
  return NextResponse.json(services);
}

export async function POST(request) {
  const body = await request.json();
  const item = {
    id: uuidv4(),
    name: body.name || "Service",
    description: body.description || "",
    image: body.image || null
  };
  services.unshift(item);
  return NextResponse.json(item);
}

export async function PUT(request) {
  const body = await request.json();
  const idx = services.findIndex((s) => s.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  services[idx] = { ...services[idx], ...body };
  return NextResponse.json(services[idx]);
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  services = services.filter((s) => s.id !== id);
  return NextResponse.json({ ok: true });
}
