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
