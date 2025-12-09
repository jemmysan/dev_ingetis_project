export default function EquipePage() {
    return (
        // Utilise Flexbox pour centrer le contenu verticalement et horizontalement
        // min-h-screen assure que le conteneur prend au moins toute la hauteur de la vue
        <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-4">
            
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 animate-bounce">
                Équipe
            </h1>
            
            <div className="text-center p-8 bg-white shadow-xl rounded-xl max-w-lg w-full border-t-4 border-gray-900">
                
                <p className="text-2xl font-semibold text-gray-800 mb-4">
                    🛠️ Page en cours de développement 🛠️
                </p>
                
                <p className="text-gray-600">
                    Nous travaillons actuellement à l élaboration de cette page pour vous permettre d ajouter les membres de votre formidable équipe. Revenez nous voir bientôt !
                </p>
                
            </div>
            
        </div>
    );
}