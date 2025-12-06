import Hero from "@/components/Hero";


export default function Home() {
  return (
    <main>
      <Hero />
      <section className="py-16 px-6 text-center">
        <h2 className="text-gray-900 text-3xl font-bold mb-4">Bienvenue dans notre salon</h2>
        <p className="text-gray-900 max-w-2xl mx-auto">
          Notre équipe de professionnels vous accueille dans une ambiance chaleureuse
          pour prendre soin de vos cheveux et révéler votre beauté naturelle.
        </p>
      </section>
    </main>

  );
}
