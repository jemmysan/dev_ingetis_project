import { getCollection } from "@/db/db";
import { handleApi } from "@/lib/handleApi";
import { NextResponse } from "next/server";


export async function getTarifsCollection() {
    return getCollection('tarifs');
}

// =========================================================================
// GET : Récupération des tarifs
// =========================================================================
export const GET = handleApi(async () => {
    // 💡 Utilisation centralisée
    const tarifsCollection = await getTarifsCollection();
    
    // Sortir les derniers insérés en premier
    const items = await tarifsCollection.find().sort({ createdAt: -1 }).toArray(); // Utilisez createdAt pour le tri, car _id n'est pas toujours dans l'ordre de création.

    // Mapper pour remplacer _id par id (Bonne pratique pour le frontend)
    return NextResponse.json(items.map((tarif) => ({ ...tarif, id: tarif._id })));
});


