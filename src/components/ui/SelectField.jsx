import { ChevronDown, HelpCircle } from "lucide-react";

/**
 * Generic labeled select field for use with react-hook-form.
 * Pass options as [{ value, label }].
 */
export default function SelectField({
  label,
  hint,
  error,
  options = [],
  placeholder = "Seleccioná...",
  className = "",
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-800">{label}</label>
      )}
      <div className="relative">
        <select
          className={`w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition pr-10 ${
            error ? "border-red-400 focus:ring-red-300" : ""
          } ${className}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>
      {hint && !error && (
        <p className="flex items-start gap-1.5 text-xs text-gray-400">
          <HelpCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          {hint}
        </p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
