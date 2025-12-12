import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function TeamApplicationsPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  const userId = (session.user as any).id as string

  // Alle Bewerbungen an Teams, die diesem User gehören
  const requests = await prisma.contactRequest.findMany({
    where: {
      team: {
        ownerId: userId,
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      team: true,
      fromUser: {
        include: {
          riderProfile: true,
        },
      },
    },
  })

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <header className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">Team applications</h1>
            <p className="mt-2 text-sm text-slate-600">
              Riders who applied to your team openings.
            </p>
          </div>

          <Link
            href="/account"
            className="text-xs text-slate-600 underline-offset-2 hover:underline"
          >
            ← Back to account
          </Link>
        </header>

        <section className="mt-6">
          {requests.length === 0 ? (
            <p className="text-sm text-slate-600">
              No applications yet. Once riders apply to your open spots, they
              will show up here.
            </p>
          ) : (
            <ul className="space-y-3">
              {requests.map((req) => {
                const riderProfile = req.fromUser?.riderProfile as
                  | {
                      displayName: string | null
                      mainCategory: string
                      racingScore: number | null
                      nation: string | null
                      discordHandle: string | null
                    }
                  | null

                const riderName =
                  riderProfile?.displayName ||
                  req.fromUser?.name ||
                  "Unknown rider"

                const category = riderProfile?.mainCategory
                const score = riderProfile?.racingScore
                const nation = riderProfile?.nation
                const discord = riderProfile?.discordHandle

                const createdDate = req.createdAt.toISOString().slice(0, 10)

                return (
                  <li
                    key={req.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 text-xs md:text-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm font-semibold">{riderName}</h2>
                        {nation && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                            {nation}
                          </span>
                        )}
                        {category && (
                          <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                            Cat {category}
                          </span>
                        )}
                        {typeof score === "number" && (
                          <span className="text-[11px] text-slate-600">
                            Zwift Racing Score: {score}
                          </span>
                        )}
                      </div>

                      <div className="text-right text-[11px] text-slate-500">
                        <div>{req.team?.name ?? "Unknown team"}</div>
                        <div>{createdDate}</div>
                      </div>
                    </div>

                    {discord && (
                      <p className="mt-2 text-[11px] text-slate-700">
                        Discord: <span className="font-medium">{discord}</span>
                      </p>
                    )}

                    {req.message && (
                      <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-[11px] text-slate-800">
                        {req.message}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
                      <div className="flex gap-2">
                        <Link
                          href={`/riders`}
                          className="underline-offset-2 hover:underline"
                        >
                          View riders directory
                        </Link>
                        <Link
                          href={`/teams/${req.team?.id ?? ""}`}
                          className="underline-offset-2 hover:underline"
                        >
                          View team
                        </Link>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Later we can add accept / decline actions here.
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
