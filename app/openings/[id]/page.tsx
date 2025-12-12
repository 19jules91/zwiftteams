// app/openings/[id]/page.tsx
import { prisma } from "@/lib/prisma"
import Link from "next/link"

type OpeningPageProps = {
  params: Promise<{ id: string }>
}

export default async function OpeningPage({ params }: OpeningPageProps) {
  const { id } = await params

  const opening = await prisma.teamOpening.findUnique({
    where: { id },
    include: {
      team: true,
    },
  })

  if (!opening) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <p className="text-sm text-slate-200">Opening not found.</p>
          <Link
            href="/openings"
            className="mt-4 inline-block text-xs text-sky-300 hover:text-sky-200"
          >
            ← Back to openings
          </Link>
        </div>
      </main>
    )
  }

  const createdAtLabel = opening.createdAt
    ? opening.createdAt.toLocaleDateString?.() ?? ""
    : ""

  const daysLabel =
    opening.days && opening.days.length > 0
      ? opening.days.join(", ")
      : "Flexible"

  const leagueLabel = opening.league || "Various formats"
  const categoryLabel = opening.category
    ? `Cat ${opening.category}`
    : "All cats"

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Back-Link */}
        <div className="mb-4 flex items-center justify-between gap-2 text-xs">
          <Link
            href="/openings"
            className="inline-flex items-center text-slate-200 hover:text-slate-50"
          >
            ← Back to openings
          </Link>
          {opening.teamId && (
            <Link
              href={`/teams/${opening.teamId}`}
              className="text-sky-300 hover:text-sky-200"
            >
              View team →
            </Link>
          )}
        </div>

        {/* Card */}
        <section className="rounded-2xl border border-slate-700/70 bg-slate-900/95 p-5 shadow-xl">
          <header className="mb-4">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              {opening.team?.nation || "INTL"} • {leagueLabel}
            </p>
            <h1 className="mt-1 text-xl font-bold text-slate-50">
              {opening.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
              <span className="font-semibold">
                {opening.team?.name || "Unknown team"}
              </span>
              {createdAtLabel && (
                <>
                  <span className="text-slate-500">•</span>
                  <span className="text-[10px] text-slate-400">
                    Posted: {createdAtLabel}
                  </span>
                </>
              )}
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Left: Description & details */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
                  Opening description
                </h2>
                {opening.description ? (
                  <p className="text-sm text-slate-100/90 whitespace-pre-line">
                    {opening.description}
                  </p>
                ) : (
                  <p className="text-sm text-slate-400">
                    No description provided yet. Team has not added additional
                    details for this opening.
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-slate-700/70 bg-slate-900/90 p-3 text-[11px] text-slate-200">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
                  Race schedule & format
                </h3>
                <div className="space-y-1">
                  <p>
                    <span className="text-slate-400">League/format: </span>
                    {leagueLabel}
                  </p>
                  <p>
                    <span className="text-slate-400">Target category: </span>
                    {categoryLabel}
                  </p>
                  <p>
                    <span className="text-slate-400">Typical race days: </span>
                    {daysLabel}
                  </p>
                  {opening.timezone && (
                    <p>
                      <span className="text-slate-400">Timezone: </span>
                      {opening.timezone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Team info + Apply */}
            <div className="space-y-3">
              {/* Team info */}
              <div className="rounded-xl border border-slate-700/70 bg-slate-900/90 p-3 text-[11px] text-slate-200">
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
                  Team info
                </h2>
                {opening.team ? (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-50">
                      {opening.team.name}
                    </p>
                    {opening.team.nation && (
                      <p>
                        <span className="text-slate-400">Nation: </span>
                        {opening.team.nation}
                      </p>
                    )}
                    {opening.team.discordLink && (
                      <p>
                        <span className="text-slate-400">Discord: </span>
                        <a
                          href={opening.team.discordLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-300 hover:text-sky-200"
                        >
                          Join server
                        </a>
                      </p>
                    )}
                    {opening.team.website && (
                      <p>
                        <span className="text-slate-400">Website: </span>
                        <a
                          href={opening.team.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-300 hover:text-sky-200"
                        >
                          {opening.team.website}
                        </a>
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400">
                    Team information unavailable.
                  </p>
                )}
              </div>

              {/* Apply box – einfacher POST zu /api/applications */}
              <div className="rounded-xl border border-slate-700/70 bg-slate-900/90 p-3 text-[11px] text-slate-200">
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
                  Apply to this opening
                </h2>
                <p className="mb-2 text-[11px] text-slate-300">
                  Send a short message to the team. Make sure you&apos;re logged in
                  and have a rider profile so they can see your details.
                </p>
                <form
                  action="/api/apply-opening"
                  method="POST"
                  className="space-y-2"
                >
                  <input type="hidden" name="openingId" value={opening.id} />
                  {opening.teamId && (
                    <input
                      type="hidden"
                      name="teamId"
                      value={opening.teamId}
                    />
                  )}
                  <textarea
                    name="message"
                    rows={3}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-100 placeholder:text-slate-500"
                    placeholder="Tell the team who you are, your Zwift category, race score, preferred leagues, etc."
                  />
                  <button
                    type="submit"
                    className="mt-1 inline-flex w-full items-center justify-center rounded-md bg-emerald-500 px-3 py-2 text-[11px] font-semibold text-emerald-950 hover:bg-emerald-400"
                  >
                    Send application
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
