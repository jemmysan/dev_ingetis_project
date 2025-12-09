// app/a-propos/page.jsx
export default function APropos() {
  return (
    <main
      className="relative bg-cover bg-center px-6 py-30 h-full flex justify-center align-center"
      style={{ backgroundImage: "url('/images/salon_view.webp')" }}
    >
      <div
        className="absolute inset-0 
                   bg-black 
                   opacity-60" // <--- L'opacité ne s'applique qu'ici
      ></div>

      <div className="relative z-10 w-full bg-gray-900/70 p-6 rounded-xl text-center text-gray-200 max-w-2xl h-52 ">
        <h2 className=" text-3xl font-bold mb-6 flex justify-center">
          À propos de nous
        </h2>
        <p className=" leading-7">
          Salon Élégance est un salon de coiffure moderne qui met en avant votre
          style et votre personnalité. Depuis plus de 10 ans, notre équipe de
          professionnels passionnés accompagne hommes et femmes pour des coupes,
          colorations et soins de haute qualité.
        </p>
      </div>
    </main>
  );
}
