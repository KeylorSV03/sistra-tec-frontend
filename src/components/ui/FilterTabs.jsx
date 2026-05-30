/**
 * Tab filter row.
 * tabs: [{ key, label, count? }]
 */
export default function FilterTabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              isActive
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600"
            }`}
          >
            {tab.label}
            {tab.count != null && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
