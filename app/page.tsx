// app/page.tsx
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import GenderBadge from "@/components/GenderBadge"
import { BACKGROUNDS } from "@/lib/backgrounds"

export default async function HomePage() {
  const topTeams = await prisma.team.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  })

  const topRiders = await prisma.riderProfile.findMany({
    take: 5,
    orderBy: { racingScore: "desc" },
  })

  return (
    <main
      className="page-bg"
      style={{ backgroundImage: `url(${BACKGROUNDS.home})` }}
    >
      <div className="page-content mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-xl font-bold text-slate-50 drop-shadow">
          Welcome to ZWIFTTEAMS
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-100/80 drop-shadow">
          The marketplace where Zwift riders and teams connect for races, leagues
          and events.
        </p>

        {/* 🔥 Top Teams */}
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-bold text-slate-50 drop-shadow">
            🔥 Top Teams
          </h2>
          {topTeams.length === 0 ? (
            <p className="text-sm text-slate-100/80">No teams yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {topTeams.map((team) => (
                <Link
                  key={team.id}
                  href={`/teams/${team.id}`}
                  className="flex items-center gap-4 rounded-xl border border-slate-700/60 bg-slate-900/75 p-4 text-xs text-slate-100 shadow-sm backdrop-blur-sm transition hover:bg-slate-900/95 hover:shadow-md"
                >
                  <img
                    src={team.logoUrl || "/placeholder_team.png"}
                    className="h-14 w-14 rounded-lg border border-slate-600 bg-slate-800 object-cover"
                    alt={team.name}
                  />

                  <div>
                    <p className="font-semibold text-slate-50 text-sm">
                      {team.name}
                    </p>
                    <p className="text-[11px] text-slate-300">
                      {team.nation || "N/A"}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-300">
                      Active leagues:{" "}
                      {team.leagues?.length ? team.leagues.join(", ") : "None"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 💠 Top Riders */}
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-bold text-slate-50 drop-shadow">
            💠 Top Riders
          </h2>
          {topRiders.length === 0 ? (
            <p className="text-sm text-slate-100/80">No riders yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {topRiders.map((rider) => (
                <Link
                  key={rider.id}
                  href={`/riders/${rider.id}`}
                  className="flex items-center gap-4 rounded-xl border border-slate-700/60 bg-slate-900/75 p-4 text-xs text-slate-100 shadow-sm backdrop-blur-sm transition hover:bg-slate-900/95 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-600 bg-slate-800 text-lg font-bold text-slate-100">
                    {rider.displayName?.charAt(0) ?? "?"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-50 text-sm truncate">
                      {rider.displayName}
                    </p>
                    <p className="text-[11px] text-slate-300">
                      {rider.nation || "N/A"}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-200">
                      Race Score: {rider.racingScore ?? "N/A"}
                    </p>

                    <div className="mt-1">
                      <GenderBadge gender={rider.gender} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
