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
    <main className="px-6 py-16">
      <h2 className="text-3xl font-bold text-center mb-10">Tarifs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tarifs.map((t, i) => <PriceCard key={i} {...t} />)}
      </div>
    </main>
  );
}
