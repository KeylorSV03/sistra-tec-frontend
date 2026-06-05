import { useId } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

/**
 * Generic labeled select field for use with react-hook-form.
 * Pass options as [{ value, label }].
 */
export default function SelectField({
  id,
  label,
  hint,
  error,
  options = [],
  placeholder = "Seleccioná...",
  className = "",
  name,
  "aria-describedby": ariaDescribedBy,
  ...props
}) {
  const generatedId = useId();
  const selectId = id ?? `${name ?? "select"}-${generatedId}`;
  const hintId = hint ? `${selectId}-hint` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;
  const describedBy = [ariaDescribedBy, !error ? hintId : undefined, errorId]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-gray-800">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          name={name}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy || undefined}
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
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
        />
      </div>
      {hint && !error && (
        <p id={hintId} className="flex items-start gap-1.5 text-xs text-gray-600">
          <HelpCircle aria-hidden="true" className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
