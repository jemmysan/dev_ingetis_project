export function TableLayout({ title, columns, children, onCreate }) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={onCreate}
          className="bg-gray-900 text-white px-4 py-2 rounded"
        >
          Ajouter
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            {columns.map((c) => (
              <th key={c} className="p-3 text-left">
                {c}
              </th>
            ))}
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
