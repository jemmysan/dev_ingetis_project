// app/tarifs/page.jsx

import PriceCard from "@/components/PriceCard";


const tarifs = [
  { title: "Coupe Homme", price: 20, image: "/images/coupe-homme.jpg" },
  { title: "Coupe Femme", price: 35, image: "/images/coupe-femme.jpg" },
  { title: "Coloration", price: 45, image: "/images/coloration.jpg" },
  { title: "Soin Kératine", price: 60, image: "/images/soin.jpg" }
];

export default function TarifsPage() {
  return (
    <main
      className="relative bg-cover bg-center px-6 py-16"
      style={{ backgroundImage: "url('/images/salon_view.webp')" }}
    >
      {/* 1. L'OVERLAY : Il doit rester vide et être le premier enfant de <main> */}
      <div
        className="absolute inset-0 h-full
                   bg-black 
                   opacity-60" // <--- L'opacité ne s'applique qu'ici
      ></div>
      <div className="relative z-10 h-full">

      <h2 className="text-3xl text-gray-200 font-bold text-center mb-10">Tarifs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  ">
        {tarifs.map((t, i) => <PriceCard key={i} {...t} />)}
      </div>
      </div>
    </main>
  );
}
