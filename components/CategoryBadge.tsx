type CategoryBadgeProps = {
  category?: string | null
  size?: "sm" | "md"
}

/**
 * Colored Zwift category badge
 * A = red, B = green, C = blue, D = yellow
 */
const COLOR_MAP: Record<string, string> = {
  A: "bg-[#E74C3C]",   // rot
  B: "bg-[#2ECC71]",   // grün
  C: "bg-[#3498DB]",   // blau
  D: "bg-[#F1C40F]",   // gelb
}

export default function CategoryBadge({
  category,
  size = "sm",
}: CategoryBadgeProps) {
  if (!category) return null

  const key = category.toUpperCase()
  const bg = COLOR_MAP[key] ?? "bg-slate-900"

  const sizeClasses =
    size === "sm" ? "h-6 w-6 text-xs" : "h-8 w-8 text-sm"

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-bold text-white ${bg} ${sizeClasses}`}
      aria-label={`Category ${key}`}
    >
      {key}
    </span>
  )
}
