"use client";
import { useState } from "react";
import { useServices } from "@/hooks/useServices";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { RiDeleteBinLine } from "react-icons/ri";
import { TiEdit } from "react-icons/ti";
import CreateOrEditService from "@/components/forms/ServiceForm";

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
    // console.log(payload);
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
          className="bg-gray-700 text-white px-4 py-2 rounded hover:transition duration-300  hover:bg-gray-900 hover:shadow-lg active:scale-95"
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
          <thead className="bg-gray-100 ">
            <tr>
              <th className="p-3 text-left">Service</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {/* Skeleton pendant le chargement */}
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i} className="border-b animate-pulse">
                  <td className="p-3 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="h-4 w-32 bg-gray-300 rounded"></div>
                  </td>

                  <td className="p-3">
                    <div className="h-4 w-64 bg-gray-300 rounded"></div>
                  </td>

                  <td className="p-3">
                    <div className="h-4 w-20 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 w-20 bg-gray-300 rounded"></div>
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              // Aucun résultat
              <tr>
                <td colSpan="3" className="p-6 text-center text-gray-500">
                  Aucun service ajouté.
                </td>
              </tr>
            ) : (
              // Résultats normaux
              filtered.map((s) => (
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
                      className="text-blue-600 mr-3 text-xl  hover:bg-blue-100 p-2 rounded-lg"
                    >
                      <TiEdit  />
                    </button>

                    <button
                      onClick={() => {
                        setToDelete(s);
                        setDeleteOpen(true);
                      }}
                      className="text-red-600 text-xl  hover:bg-red-100 p-2 rounded-lg "
                    >
                      <RiDeleteBinLine />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {openForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 max-w-lg w-full">
            <CreateOrEditService
              initialData={editing}
              submitLabel={editing ? "Enregistrer" : "Créer"}
              onSubmit={editing ? handleEdit : handleCreate}
              onClose={() => setOpenForm(false)}
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
