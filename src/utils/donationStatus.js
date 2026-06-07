/**
 * Centralized donation status configuration.
 * All status labels, colors, and dot colors in one place.
 */
export const STATUS_CONFIG = {
  Pendiente: {
    label: "Pendiente",
    dot: "bg-gray-400",
    badge: "bg-gray-100 text-gray-600",
  },
  Recibido: {
    label: "Recibido",
    dot: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700",
  },
  Clasificado: {
    label: "Clasificado",
    dot: "bg-yellow-400",
    badge: "bg-yellow-100 text-yellow-700",
  },
  "En tránsito": {
    label: "En tránsito",
    dot: "bg-orange-500",
    badge: "bg-orange-100 text-orange-700",
  },
  Entregado: {
    label: "Entregado",
    dot: "bg-green-500",
    badge: "bg-green-100 text-green-700",
  },
};

export const ALL_STATUSES = Object.keys(STATUS_CONFIG);

export const STATUS_OPTIONS = ALL_STATUSES.map((s) => ({
  value: s,
  label: STATUS_CONFIG[s].label,
}));

/**
 * Orden secuencial obligatorio del ciclo de vida de una donación.
 * No se permite saltarse pasos: cada donación solo puede avanzar al
 * estado inmediatamente siguiente.
 *
 *  Pendiente   → la registró el donante
 *  Recibido    → transportista la llevó al centro de acopio
 *  Clasificado → admin la clasificó
 *  En tránsito → admin asignó beneficiario y transportista; va en camino
 *  Entregado   → transportista la entregó al beneficiario
 */
export const STATUS_FLOW = [
  "Pendiente",
  "Recibido",
  "Clasificado",
  "En tránsito",
  "Entregado",
];

/** Devuelve el siguiente estado del flujo, o null si ya está Entregado. */
export function getNextStatus(current) {
  const i = STATUS_FLOW.indexOf(current);
  return i >= 0 && i < STATUS_FLOW.length - 1 ? STATUS_FLOW[i + 1] : null;
}
