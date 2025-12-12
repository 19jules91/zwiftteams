// components/GenderBadge.tsx

type GenderBadgeProps = {
  gender?: string | null
}

export default function GenderBadge({ gender }: GenderBadgeProps) {
  if (!gender) return null

  const value = gender.toLowerCase()

  let label = "Other"
  let symbol = "⚧"
  let bgClass = "bg-slate-800"
  let textClass = "text-slate-100"
  let borderClass = "border-slate-600"

  if (value === "male") {
    label = "Male"
    symbol = "♂"
    bgClass = "bg-sky-900/60"
    textClass = "text-sky-200"
    borderClass = "border-sky-500/60"
  } else if (value === "female") {
    label = "Female"
    symbol = "♀"
    bgClass = "bg-pink-900/60"
    textClass = "text-pink-100"
    borderClass = "border-pink-500/60"
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${borderClass} ${bgClass} px-2 py-[2px] text-[10px] font-medium ${textClass}`}
    >
      <span className="text-xs">{symbol}</span>
      <span>{label}</span>
    </span>
  )
}
