type Props = {
  status: string
}

export default function ApplicationStatusBadge({ status }: Props) {
  const normalized = status.toLowerCase()

  let label = "Pending"
  let classes =
    "bg-amber-50 text-amber-700 border-amber-200"

  if (normalized === "accepted") {
    label = "Accepted"
    classes = "bg-emerald-50 text-emerald-700 border-emerald-200"
  } else if (normalized === "declined") {
    label = "Declined"
    classes = "bg-rose-50 text-rose-700 border-rose-200"
  }

  return (
    <span
      className={
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium " +
        classes
      }
    >
      {label}
    </span>
  )
}
