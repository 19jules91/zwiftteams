import Link from "next/link"

type RiderProfileProps = {
  params: { id: string }
}

// Later you will fetch real data from the database using params.id
export default async function RiderProfilePage({ params }: RiderProfileProps) {
  const riderId = params.id

  // Placeholder data – replace with real DB data later
  const rider = {
    displayName: "Jules",
    nation: "🇩🇪",
    category: "B",
    racingScore: 642,
    status: "Looking for a team",
    discord: "Jules#1234",
    zwiftpowerLink: "https://zwiftpower.com/profile.php?z=123456",
    zwiftracingLink: "https://zwiftracing.app/riders/123456",
    leagues: ["ZRL", "Club Ladder"],
    days: ["Mon", "Wed", "Fri"],
    time: "18:00 - 22:00",
    riderType: "Allrounder / Climber",
    bio: "Ambitious Zwift racer currently looking for a competitive team for ZRL and Club Ladder races.",
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link href="/riders" className="text-xs text-slate-500 hover:underline">
          ← Back to rider search
        </Link>

        {/* Profile header */}
        <section className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">{rider.displayName}</h1>
              <p className="text-sm text-slate-500">{rider.nation}</p>
              <p className="mt-2 text-sm text-slate-700">
                Category <span className="font-semibold">{rider.category}</span> ·
                Zwift Racing Score:{" "}
                <span className="font-semibold">{rider.racingScore}</span>
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 md:items-end">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                Status: {rider.status}
              </span>

              {rider.discord && (
                <p className="text-xs text-slate-600">
                  Discord: <span className="font-mono">{rider.discord}</span>
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {rider.zwiftpowerLink && (
                  <a
                    href={rider.zwiftpowerLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-orange-600 hover:underline"
                  >
                    ZwiftPower profile
                  </a>
                )}
                {rider.zwiftracingLink && (
                  <a
                    href={rider.zwiftracingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-orange-600 hover:underline"
                  >
                    ZwiftRacing profile
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Rider details */}
        <section className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold">Racing preferences</h2>
            <dl className="mt-3 space-y-1 text-xs text-slate-700">
              <div className="flex justify-between">
                <dt>Preferred leagues</dt>
                <dd>{rider.leagues.join(", ")}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Race days</dt>
                <dd>{rider.days.join(" / ")}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Time window</dt>
                <dd>{rider.time}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Rider type</dt>
                <dd>{rider.riderType}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold">About the rider</h2>
            <p className="mt-3 text-xs text-slate-700 whitespace-pre-line">
              {rider.bio}
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold">Contact</h2>
          <p className="mt-2 text-xs text-slate-600">
            Contact {rider.displayName} directly via Discord or send a request:
          </p>
          <button className="mt-3 rounded-md bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600">
            Send request (placeholder)
          </button>
        </section>
      </div>
    </main>
  )
}
