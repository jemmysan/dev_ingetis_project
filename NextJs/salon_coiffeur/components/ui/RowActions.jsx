export function RowActions({ onEdit, onDelete }) {
  return (
    <div className="flex gap-4">
      <button onClick={onEdit} className="text-blue-600">
        Modifier
      </button>
      <button onClick={onDelete} className="text-red-600">
        Supprimer
      </button>
    </div>
  );
}
