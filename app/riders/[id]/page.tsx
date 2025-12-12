// app/riders/[id]/page.tsx

import Link from "next/link"
import { prisma } from "@/lib/prisma"
import GenderBadge from "@/components/GenderBadge"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

function computeMatchScore(opening: any, rider: any) {
  let score = 0
  const reasons: string[] = []

  // 1) Category match
  if (opening.category && opening.category === rider.mainCategory) {
    score += 40
    reasons.push("Category match")
  } else if (!opening.category) {
    score += 10
    reasons.push("Category flexible")
  }

  // 2) League match (if rider has preferences)
  if (
    Array.isArray(rider.preferredLeagues) &&
    rider.preferredLeagues.length > 0 &&
    opening.league
  ) {
    if (rider.preferredLeagues.includes(opening.league)) {
      score += 30
      reasons.push("League preference match")
    }
  }

  // 3) Timezone match
  if (opening.timezone && rider.preferredTime) {
    // sehr grob: wenn beide überhaupt etwas eingetragen haben, geben wir Punkte
    score += 10
    reasons.push("Timezone / schedule info")
  } else if (opening.timezone) {
    score += 5
  }

  // 4) Days overlap
  if (
    Array.isArray(opening.days) &&
    opening.days.length > 0 &&
    Array.isArray(rider.preferredDays) &&
    rider.preferredDays.length > 0
  ) {
    const overlap = opening.days.filter((d: string) =>
      rider.preferredDays.includes(d)
    )
    if (overlap.length > 0) {
      score += 15
      reasons.push("Race days overlap")
    }
  }

  // 5) Female-only / gender
  if (opening.league === "Female only") {
    if (rider.gender === "female") {
      score += 20
      reasons.push("Female-only compatible")
    } else {
      // Hard mismatch
      score -= 100
      reasons.push("Female-only opening")
    }
  }

  // 6) Team leagues vs rider preferences (zusätzlicher Bonus)
  if (
    opening.team &&
    Array.isArray(rider.preferredLeagues) &&
    rider.preferredLeagues.length > 0
  ) {
    const teamLeagues: string[] = opening.team.leagues ?? []
    const overlap = teamLeagues.filter((l) =>
      rider.preferredLeagues.includes(l)
    )
    if (overlap.length > 0) {
      score += 10
      reasons.push("Team races in your preferred leagues")
    }
  }

  return { score, reasons }
}

export default async function RiderPage({ params }: PageProps) {
  // ⬇️ Next.js 15: params ist ein Promise → erst auflösen
  const { id } = await params

  const rider = await prisma.riderProfile.findUnique({
    where: { id },
    include: {
      user: true,
    },
  })

  if (!rider) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <p className="text-sm text-slate-300">
            Rider not found.{" "}
            <Link href="/riders" className="text-sky-300 hover:text-sky-200">
              Back to riders.
            </Link>
          </p>
        </div>
      </main>
    )
  }

  // Alle Openings holen, inkl. Team – Matching machen wir in JS
  const allOpenings = await prisma.teamOpening.findMany({
    include: { team: true },
    orderBy: { createdAt: "desc" },
  })

  const openingsWithScore = allOpenings
    .map((o) => {
      const { score, reasons } = computeMatchScore(o, rider)
      return { ...o, matchScore: score, matchReasons: reasons }
    })
    // Female-only mismatch => score stark negativ -> rausfiltern
    .filter((o) => o.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5)

  const createdLabel =
    rider.createdAt &&
    (rider.createdAt instanceof Date
      ? rider.createdAt.toLocaleDateString()
      : new Date(rider.createdAt).toLocaleDateString())

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        {/* Header / Rider summary */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-50">
                  {rider.displayName}
                </h1>
                {rider.gender && <GenderBadge gender={rider.gender} />}
              </div>
              <p className="mt-1 text-xs text-slate-300">
                Main category:{" "}
                <span className="inline-flex items-center rounded-full bg-slate-800 px-2 py-[2px] text-[11px] font-semibold text-orange-300">
                  {rider.mainCategory}
                </span>
                {typeof rider.racingScore === "number" && (
                  <>
                    <span className="mx-2 text-slate-500">•</span>
                    Racing score:{" "}
                    <span className="font-semibold text-slate-100">
                      {rider.racingScore}
                    </span>
                  </>
                )}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Nation:{" "}
                <span className="font-mono text-slate-100">
                  {rider.nation || "N/A"}
                </span>
                {createdLabel && (
                  <>
                    <span className="mx-2 text-slate-600">•</span>
                    Joined ZwiftTeams: {createdLabel}
                  </>
                )}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2 text-right text-[11px] text-slate-300">
              {rider.discordHandle && (
                <p>
                  Discord:{" "}
                  <span className="font-mono text-slate-100">
                    {rider.discordHandle}
                  </span>
                </p>
              )}
              <div className="flex flex-wrap justify-end gap-2">
                {Array.isArray(rider.preferredLeagues) &&
                  rider.preferredLeagues.map((l: string) => (
                    <span
                      key={l}
                      className="rounded-full bg-slate-800 px-2 py-[2px] text-[10px] text-slate-200"
                    >
                      {l}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {rider.bio && (
            <p className="mt-3 text-xs text-slate-200">{rider.bio}</p>
          )}

          {/* Links zu ZwiftPower / ZwiftRacing */}
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            {rider.zwiftpowerLink && (
              <a
                href={rider.zwiftpowerLink}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-1 text-slate-100 hover:border-sky-500 hover:text-sky-200"
              >
                ZwiftPower profile
              </a>
            )}
            {rider.zwiftracingLink && (
              <a
                href={rider.zwiftracingLink}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-1 text-slate-100 hover:border-sky-500 hover:text-sky-200"
              >
                ZwiftRacing.com profile
              </a>
            )}
          </div>
        </section>

        {/* Matching openings */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-50">
                Best matching openings for this rider
              </h2>
              <p className="mt-1 text-[11px] text-slate-400">
                Based on category, leagues, timezone and race days.
              </p>
            </div>
            <Link
              href="/openings"
              className="text-[11px] text-sky-300 hover:text-sky-200"
            >
              View all openings →
            </Link>
          </div>

          {openingsWithScore.length === 0 ? (
            <p className="mt-3 text-xs text-slate-300">
              No strong matches yet. Once more teams create openings, they will
              show up here.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {openingsWithScore.map((o) => {
                const teamName = o.team?.name ?? "Unknown team"
                const score = o.matchScore
                const title =
                  o.title ||
                  [o.league, o.category].filter(Boolean).join(" • ") ||
                  "Team opening"

                // Match-Label
                let matchLabel = "Decent match"
                if (score >= 75) matchLabel = "Excellent match"
                else if (score >= 50) matchLabel = "Good match"

                return (
                  <article
                    key={o.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/80 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-slate-50">
                            {title}
                          </h3>
                          <span className="rounded-full bg-slate-800 px-2 py-[2px] text-[10px] text-slate-200">
                            {teamName}
                          </span>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
                          <span className="rounded-full bg-slate-900 px-2 py-[2px] font-semibold text-orange-300">
                            Cat {o.category ?? "?"}
                          </span>
                          {o.league && (
                            <span className="rounded-full bg-orange-50 px-2 py-[2px] text-[10px] font-medium text-orange-700">
                              {o.league}
                            </span>
                          )}
                          {o.timezone && (
                            <span className="rounded-full bg-slate-800 px-2 py-[2px] text-[10px] text-slate-200">
                              {o.timezone}
                            </span>
                          )}
                          {Array.isArray(o.days) && o.days.length > 0 && (
                            <span className="rounded-full bg-slate-800 px-2 py-[2px] text-[10px] text-slate-200">
                              {o.days.map((d) => d.slice(0, 3)).join(", ")}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 text-right">
                        <div className="text-[11px]">
                          <span className="font-semibold text-slate-50">
                            {matchLabel}
                          </span>
                          <span className="ml-1 text-slate-400">
                            ({score} pts)
                          </span>
                        </div>
                        <Link
                          href={`/openings/${o.id}`}
                          className="rounded-md bg-orange-500 px-3 py-1 text-[11px] font-semibold text-slate-950 hover:bg-orange-400"
                        >
                          View opening
                        </Link>
                      </div>
                    </div>

                    {o.description && (
                      <p className="mt-2 text-xs text-slate-200">
                        {o.description}
                      </p>
                    )}

                    {Array.isArray(o.matchReasons) &&
                      o.matchReasons.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1 text-[10px] text-slate-300">
                          {o.matchReasons.map((r: string, idx: number) => (
                            <span
                              key={idx}
                              className="rounded-full bg-slate-800 px-2 py-[1px]"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      )}
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
