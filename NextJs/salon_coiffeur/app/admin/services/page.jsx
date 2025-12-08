"use client";
import { useState } from "react";
import { useServices } from "@/hooks/useServices";
import CreateService from "@/components/services/CreateService";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";

export default function ServicesPage() {
  const { data: services, loading, create, update, remove } = useServices();
  const [query, setQuery] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleCreate = async (payload) => {
    await create(payload);
    setOpenForm(false);
  };

  const handleEdit = async (payload) => {
    await update(payload);
    setEditing(null);
    setOpenForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Services</h1>
        <button
          onClick={() => {
            setEditing(null);
            setOpenForm(true);
          }}
          className="bg-gray-900 text-white px-4 py-2 rounded"
        >
          + Ajouter
        </button>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher..."
        className="border p-2 rounded mb-4"
      />

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Service</th>
              <th className="p-3">Description</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={s.image}
                    className="w-10 h-10 rounded-full object-cover"
                    alt=""
                  />
                  <div>{s.name}</div>
                </td>
                <td className="p-3">{s.description?.slice(0, 80)}</td>
                <td className="p-3">
                  <button
                    onClick={() => {
                      setEditing(s);
                      setOpenForm(true);
                    }}
                    className="text-blue-600 mr-3"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => {
                      setToDelete(s);
                      setDeleteOpen(true);
                    }}
                    className="text-red-600"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {openForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 max-w-lg w-full">
            <CreateService
              initialData={editing}
              submitLabel={editing ? "Enregistrer" : "Créer"}
              onSubmit={editing ? handleEdit : handleCreate}
              onClose={() => setOpenForm(false)} // ← ici
            />
          </div>
        </div>
      )}

      <DeleteConfirmModal
        open={deleteOpen}
        itemName={toDelete?.name}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          await remove(toDelete?.id);
          setDeleteOpen(false);
        }}
      />
    </div>
  );
}
