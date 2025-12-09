import { UploadImage } from "./ui/UploadImages";

export function EditService({ data, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="p-6 flex flex-col gap-4 max-w-xl">
      <input className="border p-2 rounded" defaultValue={data.name} />
      <textarea
        className="border p-2 rounded"
        defaultValue={data.description}
      ></textarea>
      <UploadImage preview={data.image} />

      <button
        className="bg-gray-900 text-white px-4 py-2 rounded"
        type="submit"
      >
        Modifierer
      </button>
    </form>
  );
}
