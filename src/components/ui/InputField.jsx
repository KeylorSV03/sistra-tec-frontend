import { HelpCircle } from "lucide-react";

/**
 * Generic labeled input field with optional hint and error message.
 * Wraps a plain <input> for use with react-hook-form via {...register(...)}.
 */
export default function InputField({
  label,
  hint,
  error,
  rightSlot,
  className = "",
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-800">{label}</label>
      )}
      <div className="relative">
        <input
          className={`w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition ${
            error ? "border-red-400 focus:ring-red-300" : ""
          } ${rightSlot ? "pr-11" : ""} ${className}`}
          {...props}
        />
        {rightSlot && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightSlot}
          </div>
        )}
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
