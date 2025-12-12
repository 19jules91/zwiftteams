// app/teams/[id]/page.tsx
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { BACKGROUNDS } from "@/lib/backgrounds"

type TeamPageParams = {
  id: string
}

export default async function TeamPage(props: {
  params: Promise<TeamPageParams>
}) {
  const { id } = await props.params

  const team = await prisma.team.findUnique({
    where: { id },
    include: {
      openings: true,
    },
  })

  if (!team) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <p className="text-sm text-slate-200">Team not found.</p>
          <Link
            href="/teams"
            className="mt-4 inline-block text-xs text-sky-400 hover:underline"
          >
            ← Back to teams
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main
      className="page-bg"
      style={{ backgroundImage: `url(${BACKGROUNDS.teams})` }}
    >
      <div className="page-content mx-auto max-w-4xl px-4 py-8">
        {/* Back-Link */}
        <div className="mb-4">
          <Link
            href="/teams"
            className="inline-flex items-center text-xs text-slate-200 hover:text-white"
          >
            ← Back to teams
          </Link>
        </div>

        {/* Team Card */}
        <section className="rounded-2xl border border-slate-700/70 bg-slate-900/80 p-5 text-slate-100 shadow-lg backdrop-blur">
          {/* Header: Logo + Name + Nation */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <img
                src={team.logoUrl || "/placeholder_team.png"}
                alt={team.name}
                className="h-16 w-16 rounded-xl border border-slate-600 bg-slate-800 object-cover"
              />
              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold text-slate-50">
                  {team.name}
                </h1>
                <p className="text-xs text-slate-300">
                  {team.nation || "No nation set"}
                </p>
                {team.leagues && team.leagues.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {team.leagues.map((l) => (
                      <span
                        key={l}
                        className="rounded-full bg-slate-800 px-2 py-[2px] text-[10px] uppercase tracking-wide text-slate-100"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-col items-start gap-1 text-[11px] text-slate-300 md:items-end">
              {team.discordLink && (
                <a
                  href={team.discordLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sky-300 hover:text-sky-200"
                >
                  💬 Discord
                </a>
              )}
              {team.website && (
                <a
                  href={team.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sky-300 hover:text-sky-200"
                >
                  🌐 Website
                </a>
              )}
              <p className="mt-1 text-[10px] text-slate-500">
                Created: {team.createdAt.toLocaleDateString?.() ?? ""}
              </p>
            </div>
          </div>

          {/* Description */}
          {team.description && (
            <div className="mt-4 border-t border-slate-700/70 pt-4">
              <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
                Team description
              </h2>
              <p className="text-sm text-slate-100/90 whitespace-pre-line">
                {team.description}
              </p>
            </div>
          )}
        </section>

        {/* Openings */}
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
              Open team spots
            </h2>
            <p className="text-[11px] text-slate-400">
              {team.openings.length === 0
                ? "No active openings."
                : `${team.openings.length} active opening${
                    team.openings.length > 1 ? "s" : ""
                  }`}
            </p>
          </div>

          {team.openings.length === 0 ? (
            <div className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-4 text-xs text-slate-200">
              This team does not have any public openings at the moment.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {team.openings.map((opening) => (
                <div
                  key={opening.id}
                  className="flex flex-col gap-2 rounded-xl border border-slate-700/70 bg-slate-900/80 p-4 text-xs text-slate-100 shadow-sm backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-50">
                        {opening.title}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-300">
                        {opening.league || "League not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-200">
                    {opening.category && (
                      <span className="rounded-full bg-slate-800 px-2 py-[2px] text-[10px] font-semibold uppercase text-slate-100">
                        Cat {opening.category}
                      </span>
                    )}
                    {opening.timezone && (
                      <span className="rounded-full bg-slate-800 px-2 py-[2px] text-[10px] text-slate-100">
                        {opening.timezone}
                      </span>
                    )}
                    {opening.days && opening.days.length > 0 && (
                      <span className="rounded-full bg-slate-800 px-2 py-[2px] text-[10px] text-slate-100">
                        {opening.days.join(", ")}
                      </span>
                    )}
                  </div>

                  {opening.description && (
                    <p className="line-clamp-3 text-[11px] text-slate-200/90">
                      {opening.description}
                    </p>
                  )}

                  {/* Optional: Link zur Openings-Seite oder Apply-Flow */}
                  <div className="mt-1 flex justify-end">
                    <Link
                      href={`/openings?teamId=${team.id}`}
                      className="text-[11px] font-semibold text-sky-300 hover:text-sky-200"
                    >
                      View all openings →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
