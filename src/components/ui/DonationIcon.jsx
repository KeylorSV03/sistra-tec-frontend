import { Package } from "lucide-react";

/**
 * Consistent icon container for donation list items.
 */
export default function DonationIcon({ size = "md" }) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };
  const iconSizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" };

  return (
    <div
      className={`${sizes[size]} bg-primary-50 rounded-xl flex items-center justify-center shrink-0`}
    >
      <Package className={`${iconSizes[size]} text-primary-500`} />
    </div>
  );
}
