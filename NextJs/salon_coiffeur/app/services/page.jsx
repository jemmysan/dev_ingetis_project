"use client";
import ServiceCard from "@/components/ServiceCard";
import { ServiceSkeleton } from "@/components/skeletons/ServiceSkeleton";
import { useServices } from "@/hooks/useServices";


export default function ServicePage() {
  const { data: services, loading } = useServices();
  
  // Nombre de skeletons à afficher (par exemple, 6 pour couvrir 2 lignes sur md: et lg:)
  const skeletonCount = 6; 

  return (
    <main
      className="relative bg-cover bg-center px-6 py-16"
      style={{ backgroundImage: "url('/images/salon_view.webp')" }}
    >
       <div
        className="absolute inset-0 
                   bg-black 
                   opacity-60" // <--- L'opacité ne s'applique qu'ici
      ></div>

      <div className="relative z-10 w-full">

      <h2 className="text-3xl font-bold text-center mb-10 text-gray-200">Nos Services</h2>
      
      {/* 1. Affichage du SKELETON de chargement */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <ServiceSkeleton key={i} />
          ))}
        </div>
      )}

      {/* 2. Affichage du message d'absence de services */}
      {!loading && (!services || services.length === 0) && (
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xl text-gray-600 font-semibold">
            Aucun service ajouté.
          </p>
          <p className="text-gray-500 mt-2">
            Veuillez ajouter des services pour les afficher ici.
          </p>
        </div>
      )}

      {/* 3. Affichage des services (si non en chargement et s'il y a des données) */}
      {!loading && services && services.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => <ServiceCard key={i} {...s} />)}
        </div>
      )}
      </div>

    </main>
  );
}
