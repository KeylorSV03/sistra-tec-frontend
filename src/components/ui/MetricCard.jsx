/**
 * Dashboard metric card with icon, value, label, and optional trend/badge.
 */
export default function MetricCard({
  icon,
  value,
  label,
  trend,
  trendLabel,
  alert = false,
  className = "",
}) {
  return (
    <div
      className={`bg-white rounded-2xl p-5 shadow-sm border ${
        alert ? "border-yellow-300" : "border-gray-100"
      } flex flex-col gap-3 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            alert ? "bg-yellow-50" : "bg-primary-50"
          }`}
        >
          {icon}
        </div>
        {trendLabel && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              alert
                ? "bg-yellow-50 text-yellow-700"
                : "bg-green-50 text-green-700"
            }`}
          >
            {alert && "⚠ "}
            {trendLabel}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}
