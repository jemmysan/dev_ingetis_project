import { NextResponse } from "next/server";
import { getCollection } from "@/db/db";
import { ObjectId } from "mongodb";
import { handleApi } from "@/lib/handleApi";

// ============ GET ALL ============

export const GET = handleApi(async () => {
  const col = await getCollection("services");
  const items = await col.find().sort({ _id: -1 }).toArray();

  return NextResponse.json(items.map((s) => ({ ...s, id: s._id })));
});

// ------- POST -------
export const POST = handleApi(async (request) => {
  const body = await request.json();
  const col = await getCollection("services");

  const item = {
    name: body.name || "",
    description: body.description || "",
    image: body.image || null,
    createdAt: new Date(),
  };

  const result = await col.insertOne(item);

  return NextResponse.json({ ...item, id: result.insertedId });
});

// ------- PUT -------
export const PUT = handleApi(async (request) => {
  const body = await request.json();

  const col = await getCollection("services");
  const updated = await col.findOneAndUpdate(
    { _id: new ObjectId(body.id) },
    {
      $set: {
        name: body.name,
        description: body.description,
        image: body.image,
      },
    },
    { returnDocument: "after" }
  );

  if (!updated) {
    return NextResponse.json({ error: "Service introuvable" }, { status: 404 });
  }

  return NextResponse.json({ ...updated, id: updated._id });
});

// ------- DELETE -------
export const DELETE = handleApi(async (request) => {
  const id = new URL(request.url).searchParams.get("id");

  const col = await getCollection("services");

  await col.deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ ok: true });
});
