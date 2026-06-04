import { STATUS_CONFIG } from "../../utils/donationStatus";

/**
 * Renders a colored badge pill for a donation/inventory status.
 * Usage: <StatusBadge status="En tránsito" />
 */
export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    dot: "bg-gray-400",
    badge: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      aria-label={`Estado: ${config.label}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.badge}`}
    >
      <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
