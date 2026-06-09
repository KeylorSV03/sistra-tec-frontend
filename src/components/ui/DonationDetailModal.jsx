import { X, Package } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function DonationDetailModal({ donation, onClose }) {
  if (!donation) return null;

  const {
    id,
    tipoDonacion,
    cantidad,
    unidadMedida,
    unidad,
    descripcion,
    fecha,
    estado,
    donante,
    correoDonante,
    imageUrl,
  } = donation;

  const unidadLabel = unidadMedida ?? unidad ?? "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <h2 id="detail-modal-title" className="text-lg font-bold text-gray-900">
              {tipoDonacion}
            </h2>
            <p className="text-sm text-gray-500 font-mono">{id}</p>
          </div>
          <div className="flex items-center gap-3">
            {estado && <StatusBadge status={estado} />}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar detalle de donación"
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
            >
              <X aria-hidden="true" className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Photo */}
        <div className="bg-gray-50 flex items-center justify-center" style={{ minHeight: "220px" }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`Foto de donación: ${tipoDonacion}`}
              className="w-full max-h-64 object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 py-10 text-gray-300">
              <Package className="w-12 h-12" aria-hidden="true" />
              <p className="text-sm">Sin foto</p>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          {descripcion && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Descripción</p>
              <p className="text-sm text-gray-700 leading-relaxed">{descripcion}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Cantidad</p>
              <p className="text-sm font-medium text-gray-800">
                {cantidad} {unidadLabel}
              </p>
            </div>
            {fecha && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Fecha</p>
                <p className="text-sm text-gray-700">{fecha}</p>
              </div>
            )}
            {donante && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Donante</p>
                <p className="text-sm text-gray-700">{donante}</p>
              </div>
            )}
            {correoDonante && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Correo</p>
                <p className="text-sm text-gray-700 truncate">{correoDonante}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
