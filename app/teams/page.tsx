// app/teams/page.tsx
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { BACKGROUNDS } from "@/lib/backgrounds"

type TeamsSearchParams = {
  search?: string
  league?: string
  nation?: string
}

const ALL_LEAGUES = [
  "ZRL",
  "WTRL_TTT",
  "Club Ladder",
  "Workout",
  "Grouprides",
  "Female only",
]

const NATIONS = [
  "",
  "DE",
  "AT",
  "CH",
  "NL",
  "BE",
  "FR",
  "GB",
  "IE",
  "ES",
  "IT",
  "DK",
  "NO",
  "SE",
  "FI",
  "PL",
  "US",
  "CA",
  "AU",
  "NZ",
  "ZA",
]

export default async function TeamsPage(props: {
  searchParams?: Promise<TeamsSearchParams>
}) {
  const raw = (await props.searchParams) || {}

  const search = (raw.search || "").trim()
  const leagueFilter = (raw.league || "").trim()
  const nationFilter = (raw.nation || "").trim()

  const teams = await prisma.team.findMany({
    where: {
      AND: [
        search
          ? {
              name: {
                contains: search,
                mode: "insensitive",
              },
            }
          : {},
        leagueFilter
          ? {
              leagues: {
                has: leagueFilter,
              },
            }
          : {},
        nationFilter
          ? {
              nation: nationFilter,
            }
          : {},
      ],
    },
    include: {
      openings: true,
    },
    orderBy: {
      name: "asc",
    },
  })

  return (
    <main
      className="page-bg"
      style={{ backgroundImage: `url(${BACKGROUNDS.teams})` }}
    >
      <div className="page-content mx-auto max-w-5xl px-4 py-8">
        {/* Header + Filterleiste */}
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-50 drop-shadow">
              Teams directory
            </h1>
            <p className="text-xs text-slate-100/80">
              Discover Zwift teams and see who is active in your favourite
              leagues.
            </p>
          </div>

          {/* Filter-Form (GET) */}
          <form className="flex flex-wrap items-center gap-2 text-xs">
            <input
              name="search"
              defaultValue={search}
              placeholder="Search teams..."
              className="rounded-md border border-slate-600 bg-slate-900/70 px-2 py-1 text-slate-100 placeholder:text-slate-400"
            />

            <select
              name="league"
              defaultValue={leagueFilter}
              className="rounded-md border border-slate-600 bg-slate-900/70 px-2 py-1 text-slate-100"
            >
              <option value="">All leagues</option>
              {ALL_LEAGUES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            <select
              name="nation"
              defaultValue={nationFilter}
              className="rounded-md border border-slate-600 bg-slate-900/70 px-2 py-1 text-slate-100"
            >
              <option value="">All nations</option>
              {NATIONS.filter(Boolean).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="rounded-md bg-slate-100 px-3 py-1 font-semibold text-slate-900 hover:bg-white"
            >
              Filter
            </button>
          </form>
        </header>

        {/* Inhalt */}
        {teams.length === 0 ? (
          <p className="text-sm text-slate-100/80">
            No teams found for the selected filters.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {teams.map((team) => {
              const openingsCount = team.openings.length

              return (
                <Link
                  key={team.id}
                  href={`/teams/${team.id}`}
                  className="flex flex-col gap-3 rounded-xl border border-slate-700/70 bg-slate-900/75 p-4 text-xs text-slate-100 shadow-sm backdrop-blur-sm transition hover:bg-slate-900/95 hover:shadow-md"
                >
                  {/* Top Row: Logo + Name + Nation */}
                  <div className="flex items-center gap-3">
                    <img
                      src={team.logoUrl || "/placeholder_team.png"}
                      alt={team.name}
                      className="h-12 w-12 rounded-lg border border-slate-600 bg-slate-800 object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-50">
                        {team.name}
                      </p>
                      <p className="text-[11px] text-slate-300">
                        {team.nation || "No nation set"}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {team.description && (
                    <p className="line-clamp-2 text-[11px] text-slate-200/90">
                      {team.description}
                    </p>
                  )}

                  {/* Leagues + Stats */}
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {(team.leagues || []).map((l) => (
                      <span
                        key={l}
                        className="rounded-full bg-slate-800 px-2 py-[2px] text-[10px] uppercase tracking-wide text-slate-100"
                      >
                        {l}
                      </span>
                    ))}

                    {openingsCount > 0 && (
                      <span className="rounded-full bg-emerald-500/90 px-2 py-[2px] text-[10px] font-semibold text-emerald-950">
                        {openingsCount} open spot
                        {openingsCount > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-slate-300">
                    {team.discordLink && (
                      <span className="truncate">
                        💬 Discord:{" "}
                        <span className="underline underline-offset-2">
                          {team.discordLink.replace(/^https?:\/\//, "")}
                        </span>
                      </span>
                    )}
                    {team.website && (
                      <span className="truncate">
                        🌐 Website:{" "}
                        <span className="underline underline-offset-2">
                          {team.website.replace(/^https?:\/\//, "")}
                        </span>
                      </span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
