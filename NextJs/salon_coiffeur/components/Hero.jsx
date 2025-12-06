// app/components/Hero.jsx
export default function Hero() {
  return (
    <section className="relative bg-cover bg-center h-[70vh] flex items-center justify-center"
      style={{ backgroundImage: "url('/images/salon_view.webp')" }}>
      <div className="bg-gray-900/40 p-6 rounded-xl text-center text-white max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Salon Élégance</h1>
        <p className="text-lg md:text-xl">Votre destination beauté pour une coiffure moderne et raffinée.</p>
      </div>
    </section>
  );
}
