/**
 * Reusable Button component.
 * variants: "primary" | "secondary" | "ghost" | "danger"
 */
export default function Button({
  children,
  variant = "primary",
  className = "",
  loading = false,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-xl px-5 py-3 text-sm transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-primary-600 hover:bg-primary-700 text-white shadow-sm shadow-primary-200",
    secondary:
      "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
    ghost: "text-primary-600 hover:bg-primary-50",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      aria-busy={loading ? "true" : undefined}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
        />
      ) : null}
      {children}
    </button>
  );
}
