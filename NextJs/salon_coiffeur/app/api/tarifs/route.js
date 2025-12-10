import { getCollection } from "@/db/db";
import { handleApi } from "@/lib/handleApi";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

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



// =========================================================================
// POST : Ajout d'un nouveau tarif (avec vérification de duplication)
// =========================================================================
export const POST = handleApi(async (request) => {
    // Le body doit être lu de manière synchrone avant d'être utilisé
    const body = await request.json(); 
    
    // 💡 Utilisation centralisée
    const tarifsCollection = await getTarifsCollection();

    const item = {
        title: body.title || "",
        price: body.price || "",
        image: body.image || null,
        createdAt: new Date()
    };
    
    // VÉRIFICATION DE DUPLICATION :
    // On cherche un élément qui a déjà le même titre
    const existingItem = await tarifsCollection.findOne({ title: item.title });

    if (existingItem) {
        // Si l'élément existe déjà, retourner une erreur 409 Conflict
        return new NextResponse(
            JSON.stringify({ message: "Un tarif avec ce titre existe déjà." }), 
            { status: 409, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // INSERTION
    const newItem = await tarifsCollection.insertOne(item);

    // Retourner l'objet complet avec son nouvel ID
    return NextResponse.json({ ...item, id: newItem.insertedId });
});



// =========================================================================
// PATCH : Modification d'une tarif
// =========================================================================

// La fonction handler doit accepter 'request' ET 'context' pour récupérer les paramètres de l'URL
export const PATCH = handleApi(async (request, context) => {
    // 1. Récupération des données et de l'ID
    const body = await request.json(); // Assurez-vous d'await pour lire le corps
    
    // Si l'ID est dans l'URL (e.g., /api/tarifs/[id]), il faut l'extraire du context.params
    // Hypothèse : l'ID est disponible dans context.params.id
    const itemId = context.params.id; 
    
    // Vérification de l'ID
    if (!itemId) {
        return new NextResponse(
            JSON.stringify({ message: "ID de tarif manquant." }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }
    
    // Conversion de l'ID string en objet ObjectId
    let objectId;
    try {
        objectId = new ObjectId(itemId);
    } catch (e) {
        return new NextResponse(
            JSON.stringify({ message: "Format d'ID invalide." }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const tarifsCollection = await getTarifsCollection();

    // Construction de l'objet de mise à jour ($set)
    const updateFields = {
        title: body.title,
        price: body.price,
        image: body.image,
        updatedAt: new Date() // Ajout d'une date de mise à jour
    };

    // Nettoyage : retirer les champs non définis ou null pour ne mettre à jour que ce qui est envoyé
    Object.keys(updateFields).forEach(key => 
        (updateFields[key] === undefined || updateFields[key] === null) && delete updateFields[key]
    );

    // 2. Vérification de la duplication (si le titre est mis à jour)
    if (updateFields.title) {
        // On cherche un autre document qui a le même titre MAIS un ID différent
        const existingItem = await tarifsCollection.findOne({ 
            title: updateFields.title,
            _id: { $ne: objectId } // $ne signifie "Not Equal"
        });

        if (existingItem) {
            // Si un autre élément existe déjà avec ce titre, on retourne une erreur
            return new NextResponse(
                JSON.stringify({ message: `Un autre tarif existe déjà avec le titre : ${updateFields.title}` }),
                { status: 409, headers: { 'Content-Type': 'application/json' } }
            );
        }
    }
    
    // 3. Mise à jour du document
    const result = await tarifsCollection.updateOne(
        { _id: objectId },
        { $set: updateFields }
    );
    
    // 4. Gestion de la réponse
    if (result.matchedCount === 0) {
        // Si aucun document n'a été trouvé avec cet ID
        return new NextResponse(
            JSON.stringify({ message: "Tarif non trouvé." }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Récupérer le document mis à jour pour le renvoyer
    const updatedTarif = await tarifsCollection.findOne({ _id: objectId });
    
    return NextResponse.json({ ...updatedTarif, id: updatedTarif._id });
});


// =========================================================================
// DELETE : Suppression d'un tarif
// =========================================================================

// La fonction handler doit accepter 'request' ET 'context' pour récupérer les paramètres de l'URL
export const DELETE = handleApi(async (request, context) => {
    
    // 1. Récupération de l'ID depuis les paramètres de l'URL
    // Hypothèse : l'ID est disponible dans context.params.id
    const itemId = context.params.id; 
    
    // Vérification de l'ID
    if (!itemId) {
        return new NextResponse(
            JSON.stringify({ message: "ID de tarif manquant pour la suppression." }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }
    
    // Conversion de l'ID string en objet ObjectId
    let objectId;
    try {
        objectId = new ObjectId(itemId);
    } catch (e) {
        return new NextResponse(
            JSON.stringify({ message: "Format d'ID invalide." }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // 2. Accès à la collection
    const tarifsCollection = await getTarifsCollection();

    // 3. Suppression du document
    const result = await tarifsCollection.deleteOne({ _id: objectId });
    
    // 4. Gestion de la réponse
    if (result.deletedCount === 0) {
        // Si aucun document n'a été trouvé et supprimé avec cet ID
        return new NextResponse(
            JSON.stringify({ message: "Tarif non trouvé ou déjà supprimé." }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Réponse standard HTTP 204 No Content pour une suppression réussie
    // (Alternativement, on peut renvoyer 200 OK avec un message de succès)
    return new NextResponse(null, { status: 204 }); 
});