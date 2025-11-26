import Link from "next/link"

type TeamPageProps = {
  params: { id: string }
}

// Later you will fetch real data from the database using params.id
export default async function TeamPage({ params }: TeamPageProps) {
  const teamId = params.id

  // Placeholder data – replace with DB query later
  const team = {
    name: "Team Velocity",
    nation: "🇩🇪",
    description:
      "Competitive Zwift racing team focusing on ZRL and Club Ladder. Structured training, race analysis and a friendly atmosphere.",
    discordLink: "https://discord.gg/your-team",
    website: "https://team-velocity.com",
    leagues: ["ZRL", "Club Ladder"],
    openings: [
      {
        id: "1",
        categoryNeeded: "B",
        role: "Allrounder / Climber",
        league: "ZRL",
        dayOfWeek: "Tuesday",
        raceTime: "19:30",
        minRacingScore: 600,
        requirements:
          "Consistent B cat performance, good team communication on Discord and regular attendance.",
        isOpen: true,
      },
      {
        id: "2",
        categoryNeeded: "C",
        role: "TTT specialist",
        league: "WTRL TTT",
        dayOfWeek: "Thursday",
        raceTime: "20:15",
        minRacingScore: 500,
        requirements:
          "Strong steady power, good TT pacing and comfort in aero.",
        isOpen: true,
      },
    ],
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link href="/teams" className="text-xs text-slate-500 hover:underline">
          ← Back to team search
        </Link>

        {/* Team header */}
        <section className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">{team.name}</h1>
              <p className="text-sm text-slate-500">{team.nation}</p>
              <p className="mt-2 text-sm text-slate-700">
                Active leagues:{" "}
                <span className="font-semibold">
                  {team.leagues.join(", ")}
                </span>
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 md:items-end">
              {team.discordLink && (
                <a
                  href={team.discordLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-indigo-600 hover:underline"
                >
                  Join team Discord
                </a>
              )}
              {team.website && (
                <a
                  href={team.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-orange-600 hover:underline"
                >
                  Visit team website
                </a>
              )}
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-700">{team.description}</p>
        </section>

        {/* Open positions */}
        <section className="mt-4 rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Open positions</h2>
            <span className="text-xs text-slate-500">
              {team.openings.filter((o) => o.isOpen).length} open
            </span>
          </div>

          <div className="mt-4 space-y-4">
            {team.openings.map((opening) => (
              <article
                key={opening.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold">
                      Category {opening.categoryNeeded} · {opening.league}
                    </p>
                    <p className="text-xs text-slate-500">
                      Role: {opening.role || "Any"} · {opening.dayOfWeek}{" "}
                      {opening.raceTime}
                    </p>
                    {opening.minRacingScore && (
                      <p className="text-xs text-slate-500">
                        Minimum Zwift Racing Score: {opening.minRacingScore}
                      </p>
                    )}
                  </div>
                  {opening.isOpen ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Open
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                      Closed
                    </span>
                  )}
                </div>

                {opening.requirements && (
                  <p className="mt-2 text-xs text-slate-700">
                    {opening.requirements}
                  </p>
                )}

                <button className="mt-3 rounded-md bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600">
                  Apply for this spot (placeholder)
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
