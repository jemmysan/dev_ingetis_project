import TeamCard from "@/components/TeamCard";


const equipe = [
  { name: "Sarah", role: "Coiffeuse & Coloriste", image: "/images/team1.jpg" },
  { name: "Marc", role: "Barbier", image: "/images/team2.jpg" },
  { name: "Julie", role: "Styliste", image: "/images/team3.jpg" }
];

export default function Equipe() {
  return (
    <main className="px-6 py-16">
      <h2 className="text-3xl font-bold text-center mb-10">Notre équipe</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {equipe.map((m, i) => <TeamCard key={i} {...m} />)}
      </div>
    </main>
  );
}
