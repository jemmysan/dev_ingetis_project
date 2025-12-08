"use client";

import { useState } from "react";
import { UploadImages } from "../ui/UploadImages";

export default function CreateService({ initialData, onSubmit, onClose }) {
  const [formData, setFormData] = useState(() => ({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    image: initialData?.image ?? null,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="relative">
      {/* Bouton de fermeture déplacé ici */}
      <button
        className="absolute top-2 right-2 text-gray-700 text-xl"
        onClick={onClose}
      >
        ×
      </button>

      <form
        className="p-6 flex flex-col gap-4 max-w-xl"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}
      >
        <input
          name="name"
          className="border p-2 rounded"
          placeholder="Nom du service"
          value={formData.name}
          onChange={handleChange}
        />

        <textarea
          name="description"
          className="border p-2 rounded"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <UploadImages
          value={formData.image}
          onChange={(img) =>
            setFormData((prev) => ({ ...prev, image: img }))
          }
        />

        <button
          className="bg-gray-900 text-white px-4 py-2 rounded"
          type="submit"
        >
          {initialData ? "Mettre à jour" : "Créer"}
        </button>
      </form>
    </div>
  );
}
