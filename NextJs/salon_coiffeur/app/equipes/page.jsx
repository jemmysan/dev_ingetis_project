import TeamCard from "@/components/TeamCard";

const equipe = [
  { name: "Sarah", role: "Coiffeuse & Coloriste", image: "/images/team1.jpg" },
  { name: "Marc", role: "Barbier", image: "/images/team2.jpg" },
  { name: "Julie", role: "Styliste", image: "/images/team3.jpg" },
];

export default function Equipe() {
  return (
    <main
      className="relative bg-cover bg-center  px-6 py-16"
      style={{ backgroundImage: "url('/images/salon_view.webp')" }}
    >
      {/* 1. L'OVERLAY : Il doit rester vide et être le premier enfant de <main> */}
      <div
        className="absolute inset-0 
                   bg-black 
                   opacity-60" // <--- L'opacité ne s'applique qu'ici
      ></div>

      {/* 2. LE CONTENU : Il est séparé et placé au-dessus avec relative et z-10 */}
      <div className="relative z-10 h-full ">
        {/* Vos éléments de contenu */}
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-200">
          Notre équipe
        </h2>
        {/* J'ai ajouté text-white pour que le titre soit lisible sur le fond noirci */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 ">
          {equipe.map((m, i) => (
            <TeamCard key={i} {...m} />
          ))}
        </div>
      </div>
    </main>
  );
}
