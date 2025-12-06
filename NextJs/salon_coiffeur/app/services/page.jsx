"use client";
import ServiceCard from "@/components/ServiceCard";

const services = [
  { title: "Coupe Homme", description: "Style moderne, classique ou personnalisé.", image: "/images/coupe-homme.jpg" },
  { title: "Coupe Femme", description: "Coiffure élégante adaptée à votre style.", image: "/images/coupe-femme.jpg" },
  { title: "Coloration", description: "Couleur, balayage, mèches et plus.", image: "/images/coloration.jpg" },
  { title: "Soins", description: "Soin profond, kératine, réparation.", image: "/images/soin.jpg" }

];

export default function ServicePage() {
  return (
    <main className="px-6 py-16">
      <h2 className="text-3xl font-bold text-center mb-10">Nos Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => <ServiceCard key={i} {...s} />)}
      </div>
    </main>
  );
}
