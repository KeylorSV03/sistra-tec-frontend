import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";

/**
 * Drag-and-drop / click file upload zone.
 * Calls onChange(file) when a file is selected.
 */
export default function FileDropzone({
  onChange,
  accept = "image/png,image/jpeg",
  label = "Foto de los artículos",
}) {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const clear = () => {
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="relative border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden"
    >
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Vista previa de la imagen seleccionada"
            className="w-full h-44 object-cover"
          />
          <button
            type="button"
            onClick={clear}
            aria-label="Quitar imagen seleccionada"
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            <X aria-hidden="true" className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label={`Seleccionar ${label}`}
          className="w-full flex flex-col items-center gap-2 py-10 text-gray-600 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-primary-400"
        >
          <Upload aria-hidden="true" className="w-8 h-8" />
          <span className="text-sm">
            Arrastrá una imagen aquí o hacé clic para seleccionar
          </span>
          <span className="text-xs">PNG, JPG hasta 5MB</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        aria-label={label}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
