// Importez ces éléments en haut de votre fichier
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // App Router

export function Sidebar({ mobile = false }) {
  // 1. Récupération du chemin actuel (pathname)
  const pathname = usePathname(); 

  // Définition des classes de style
  const linkBaseClasses = 
    'p-2 rounded-md transition-all duration-200 block'; // Ajout de 'block' pour un meilleur clic/padding

  const linkActiveClasses = 
    'bg-gray-900 text-white shadow-md font-bold'; // Style lorsque le lien est actif

  const linkInactiveClasses = 
    'text-gray-900 hover:bg-gray-300 hover:text-gray-900'; // Style par défaut et au survol

  // Fonction utilitaire pour générer la classe conditionnelle
  const getLinkClasses = (href) => {
    // Vérifie si le chemin actuel correspond exactement au lien
    const isActive = pathname === href;
    
    return `${linkBaseClasses} ${isActive ? linkActiveClasses : linkInactiveClasses}`;
  };

  return (
    <aside
      className={`h-full w-64 text-gray-900 p-6 font-semibold ${mobile ? "" : "fixed md:static"}`}
    >
      <h2 className="text-xl font-bold mb-6">Dashboard Admin</h2>

      <nav className="flex flex-col space-y-4">
        
        {/* L'élément Link de Next.js remplace <a> */}
        <Link href="/admin/services" className={getLinkClasses('/admin/services')}>
          Services
        </Link>
        
        <Link href="/admin/tarifs" className={getLinkClasses('/admin/tarifs')}>
          Tarifs
        </Link>
        
        <Link href="/admin/equipe" className={getLinkClasses('/admin/equipe')}>
          Équipe
        </Link>

      </nav>
    </aside>
  );
}