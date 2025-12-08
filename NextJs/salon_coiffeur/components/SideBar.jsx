export function Sidebar({ mobile = false }) {
  return (
    <aside
      className={`
        h-full w-64 text-gray-900 p-6 font-semibold
        ${mobile ? "" : "fixed md:static"}
      `}
    >
      <h2 className="text-xl font-bold mb-6">Dashboard Admin</h2>

      <nav className="flex flex-col space-y-4">
        <a href="/admin/services" className="hover:bg-gray-900 hover:p-2  hover:text-white rounded-md">Services</a>
        <a href="/admin/tarifs" className="hover:bg-gray-900 hover:p-2 hover:text-white rounded-md">Tarifs</a>
        <a href="/admin/equipe" className="hover:bg-gray-900 hover:p-2 hover:text-white rounded-md">Équipe</a>
      </nav>
    </aside>
  );
}
    