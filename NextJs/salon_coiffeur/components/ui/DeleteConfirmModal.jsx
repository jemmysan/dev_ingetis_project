export function DeleteConfirmModal({ open, onClose, onConfirm, itemName }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold">Confirmation</h3>
        <p className="mt-2">Voulez-vous vraiment supprimer  <strong>{itemName}</strong> ?</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Annuler</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 text-white">Supprimer</button>
        </div>
      </div>
    </div>
  );
}
