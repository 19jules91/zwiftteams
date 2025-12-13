// components/TickerBar.tsx
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function TickerBar() {
  const [latestRider, latestTeam] = await Promise.all([
    prisma.riderProfile.findFirst({
      orderBy: { createdAt: "desc" },
      select: { id: true, displayName: true },
    }),
    prisma.team.findFirst({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true },
    }),
  ])

  const items: { key: string; node: React.ReactNode }[] = []

  if (latestRider) {
    items.push({
      key: "rider",
      node: (
        <>
          🚴 Latest joined rider:{" "}
          <Link
            href={`/riders/${latestRider.id}`}
            className="underline underline-offset-2 hover:text-white"
          >
            {latestRider.displayName}
          </Link>
        </>
      ),
    })
  }

  if (latestTeam) {
    items.push({
      key: "team",
      node: (
        <>
          🏁 Latest joined team:{" "}
          <Link
            href={`/teams/${latestTeam.id}`}
            className="underline underline-offset-2 hover:text-white"
          >
            {latestTeam.name}
          </Link>
        </>
      ),
    })
  }

  if (items.length === 0) {
    items.push({
      key: "empty",
      node: <>👋 Welcome to ZWIFTTEAMS</>,
    })
  }

  const loop = [...items, ...items]

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex w-max animate-marquee items-center gap-16 px-6 py-2 text-xs text-white/80">
        {loop.map((it, idx) => (
          <span key={`${it.key}-${idx}`} className="mx-6 inline-flex items-center">
            {it.node}
            <span className="mx-6 text-slate-700">•</span>
          </span>
        ))}
      </div>
    </div>
  )
}
