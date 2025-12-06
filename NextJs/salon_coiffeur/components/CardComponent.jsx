export default function CardComponent({ title = "Titre du service", price = "0" }) {
  return (
    <div className="max-w-sm w-full rounded-2xl shadow-lg bg-white dark:bg-zinc-900 p-6 border border-zinc-200 dark:border-zinc-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      
      {/* Titre */}
      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
        {title}
      </h3>

      {/* Prix */}
      <p className="text-xl font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
        {price} €
      </p>

      {/* Divider */}
      <div className="h-px bg-zinc-200 dark:bg-zinc-700 mb-4"></div>

      {/* Bouton */}
      {/* <button className="w-full bg-black dark:bg-white dark:text-black text-white font-medium py-3 rounded-xl hover:opacity-80 transition">
        Réserver
      </button> */}
    </div>
  );
}
