"use client";
import { useState, useEffect } from "react";

export function UploadImages({ defaultImage = null, onChange }) {
  const [preview, setPreview] = useState(defaultImage || null);

  useEffect(() => {
    return () => {
      // cleanup object URLs si besoin
    };
  }, []);

  const handleFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    if (onChange) onChange(file);
  };

  return (
    <div className="flex flex-col gap-3">
      {preview ? (
        <img src={preview} alt="preview" className="w-28 h-28 rounded-full object-cover" />
      ) : (
        <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
          Photo
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
