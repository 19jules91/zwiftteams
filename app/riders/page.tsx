// app/riders/page.tsx
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { BACKGROUNDS } from "@/lib/backgrounds"
import GenderBadge from "@/components/GenderBadge"

type RidersSearchParams = {
  search?: string
  category?: string
  status?: string
  league?: string
  gender?: string
  sort?: string
}

const CATEGORIES = ["A", "B", "C", "D"]
const SEARCH_STATUS = ["Looking for a team", "Open to offers", "Not searching"]
const LEAGUES = [
  "ZRL",
  "WTRL_TTT",
  "Club Ladder",
  "Workout",
  "Grouprides",
  "Female only",
]
const GENDERS = ["Male", "Female", "Other"]

export default async function RidersPage(props: {
  searchParams?: Promise<RidersSearchParams>
}) {
  const raw = (await props.searchParams) || {}

  const search = (raw.search || "").trim()
  const category = (raw.category || "").trim()
  const status = (raw.status || "").trim()
  const league = (raw.league || "").trim()
  const genderFilter = (raw.gender || "").trim()
  const sort = (raw.sort || "score-desc").trim()

  const riders = await prisma.riderProfile.findMany({
    where: {
      AND: [
        search
          ? {
              displayName: {
                contains: search,
                mode: "insensitive",
              },
            }
          : {},
        category
          ? {
              mainCategory: category,
            }
          : {},
        status
          ? {
              searchStatus: status,
            }
          : {},
        league
          ? {
              preferredLeagues: {
                has: league,
              },
            }
          : {},
        genderFilter
          ? {
              gender: genderFilter,
            }
          : {},
      ],
    },
    orderBy:
      sort === "score-asc"
        ? { racingScore: "asc" }
        : sort === "score-desc"
        ? { racingScore: "desc" }
        : { displayName: "asc" },
  })

  return (
    <main
      className="page-bg"
      style={{ backgroundImage: `url(${BACKGROUNDS.riders})` }}
    >
      <div className="page-content mx-auto max-w-5xl px-4 py-8">
        {/* Header + Filter */}
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-50 drop-shadow">
              Riders directory
            </h1>
            <p className="text-xs text-slate-100/80">
              Browse riders by category, race score and preferred leagues.
            </p>
          </div>

          <form className="flex flex-wrap items-center gap-2 text-xs">
            <input
              name="search"
              defaultValue={search}
              placeholder="Search riders..."
              className="rounded-md border border-slate-600 bg-slate-900/70 px-2 py-1 text-slate-100 placeholder:text-slate-400"
            />

            <select
              name="category"
              defaultValue={category}
              className="rounded-md border border-slate-600 bg-slate-900/70 px-2 py-1 text-slate-100"
            >
              <option value="">All cats</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  Cat {c}
                </option>
              ))}
            </select>

            <select
              name="status"
              defaultValue={status}
              className="rounded-md border border-slate-600 bg-slate-900/70 px-2 py-1 text-slate-100"
            >
              <option value="">Any status</option>
              {SEARCH_STATUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              name="league"
              defaultValue={league}
              className="rounded-md border border-slate-600 bg-slate-900/70 px-2 py-1 text-slate-100"
            >
              <option value="">All leagues</option>
              {LEAGUES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            <select
              name="gender"
              defaultValue={genderFilter}
              className="rounded-md border border-slate-600 bg-slate-900/70 px-2 py-1 text-slate-100"
            >
              <option value="">Any gender</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            <select
              name="sort"
              defaultValue={sort}
              className="rounded-md border border-slate-600 bg-slate-900/70 px-2 py-1 text-slate-100"
            >
              <option value="score-desc">Score ↓</option>
              <option value="score-asc">Score ↑</option>
              <option value="name-asc">Name A–Z</option>
            </select>

            <button
              type="submit"
              className="rounded-md bg-slate-100 px-3 py-1 font-semibold text-slate-900 hover:bg-white"
            >
              Filter
            </button>
          </form>
        </header>

        {/* Rider Cards */}
        {riders.length === 0 ? (
          <p className="text-sm text-slate-100/80">
            No riders found for the selected filters.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {riders.map((rider) => (
              <Link
                key={rider.id}
                href={`/riders/${rider.id}`}
                className="flex flex-col gap-3 rounded-xl border border-slate-700/70 bg-slate-900/75 p-4 text-xs text-slate-100 shadow-sm backdrop-blur-sm transition hover:bg-slate-900/95 hover:shadow-md"
              >
                {/* Top Row: Avatar + Name + Nation + Gender */}
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-600 bg-slate-800 text-lg font-bold text-slate-100">
                    {rider.displayName?.charAt(0) ?? "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-50">
                      {rider.displayName}
                    </p>
                    <p className="text-[11px] text-slate-300">
                      {rider.nation || "No nation set"}
                    </p>
                    <div className="mt-1">
                      <GenderBadge gender={rider.gender} />
                    </div>
                  </div>
                </div>

                {/* Race info */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-200">
                  {rider.mainCategory && (
                    <span className="rounded-full bg-slate-800 px-2 py-[2px] text-[10px] font-semibold uppercase text-slate-100">
                      Cat {rider.mainCategory}
                    </span>
                  )}

                  {typeof rider.racingScore === "number" && (
                    <span className="rounded-full bg-emerald-500/90 px-2 py-[2px] text-[10px] font-semibold text-emerald-950">
                      Racing score: {rider.racingScore}
                    </span>
                  )}

                  {rider.searchStatus && (
                    <span className="rounded-full bg-slate-700 px-2 py-[2px] text-[10px] text-slate-100">
                      {rider.searchStatus}
                    </span>
                  )}

                  {rider.riderType && (
                    <span className="rounded-full bg-slate-800 px-2 py-[2px] text-[10px] text-slate-100">
                      {rider.riderType}
                    </span>
                  )}
                </div>

                {/* Preferred leagues */}
                {rider.preferredLeagues && rider.preferredLeagues.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {rider.preferredLeagues.map((l) => (
                      <span
                        key={l}
                        className="rounded-full bg-slate-800 px-2 py-[2px] text-[10px] uppercase tracking-wide text-slate-100"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-slate-300">
                  {rider.zwiftpowerLink && (
                    <span className="truncate">
                      ZP:{" "}
                      <span className="underline underline-offset-2">
                        {rider.zwiftpowerLink.replace(/^https?:\/\//, "")}
                      </span>
                    </span>
                  )}
                  {rider.zwiftracingLink && (
                    <span className="truncate">
                      ZR:{" "}
                      <span className="underline underline-offset-2">
                        {rider.zwiftracingLink.replace(/^https?:\/\//, "")}
                      </span>
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
