import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { revalidatePath } from "next/cache"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const LEAGUES = [
  "ZRL",
  "WTRL_TTT",
  "Club Ladder",
  "Workout",
  "Grouprides",
  "Female only",
]

const CATEGORIES = ["A", "B", "C", "D"]

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

const TIMEZONES = [
  "Europe/Berlin",
  "Europe/London",
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Australia/Sydney",
]

export default async function OpeningOnboardingPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  const userId = (session.user as any).id as string

  // Team des Users holen – Opening gehört immer zu einem Team
  const team = await prisma.team.findFirst({
    where: { ownerId: userId },
  })

  if (!team) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-xl font-bold mb-2">Create opening</h1>
          <p className="text-sm text-slate-200">
            You need a team profile before you can create openings.
          </p>
          <Link
            href="/onboarding/team"
            className="mt-4 inline-flex items-center text-xs text-sky-300 hover:text-sky-200"
          >
            Go to team onboarding →
          </Link>
        </div>
      </main>
    )
  }

  async function saveOpening(formData: FormData) {
    "use server"

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      redirect("/login")
    }
    const userId = (session.user as any).id as string

    const team = await prisma.team.findFirst({
      where: { ownerId: userId },
    })

    if (!team) {
      redirect("/onboarding/team")
    }

    const title = ((formData.get("title") as string) || "").trim()
    const league = ((formData.get("league") as string) || "").trim() || null
    const category = ((formData.get("category") as string) || "").trim() || null
    const description =
      ((formData.get("description") as string) || "").trim() || null
    const timezone =
      ((formData.get("timezone") as string) || "").trim() || null
    const days = formData.getAll("days") as string[]

    if (!title) {
      throw new Error("Title is required")
    }

    await prisma.teamOpening.create({
      data: {
        teamId: team.id,
        title,
        league,
        category,
        description,
        timezone,
        days,
      },
    })

    revalidatePath("/openings")
    redirect("/openings")
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-slate-50">
              Create team opening
            </h1>
            <p className="mt-1 text-xs text-slate-300">
              Publish an opening so riders can find and apply to your team.
            </p>
          </div>
          <Link
            href="/openings"
            className="text-xs text-sky-300 hover:text-sky-200"
          >
            ← Back to openings
          </Link>
        </header>

        {/* Info über Team */}
        <section className="mb-4 rounded-xl border border-slate-700/70 bg-slate-900/80 p-4 text-xs text-slate-200">
          <p>
            Creating opening for team{" "}
            <span className="font-semibold text-slate-50">{team.name}</span>
            {team.nation && (
              <span className="text-slate-400"> ({team.nation})</span>
            )}
          </p>
        </section>

        {/* Formular */}
        <section className="rounded-2xl border border-slate-700/70 bg-slate-900/90 p-5 text-xs shadow-lg">
          <form action={saveOpening} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                Opening title
              </label>
              <input
                name="title"
                required
                className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
                placeholder="e.g. B-cat ZRL race leader"
              />
            </div>

            {/* League & Category */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                  League / format
                </label>
                <select
                  name="league"
                  className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                  defaultValue=""
                >
                  <option value="">Select league (optional)</option>
                  {LEAGUES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                  Target category
                </label>
                <select
                  name="category"
                  className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                  defaultValue=""
                >
                  <option value="">All / flexible</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      Cat {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Days & Timezone */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                  Typical race days
                </label>
                <div className="mt-2 grid grid-cols-2 gap-1 text-[11px] text-slate-100">
                  {DAYS.map((d) => (
                    <label key={d} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        name="days"
                        value={d}
                        className="h-3 w-3 rounded border-slate-600 bg-slate-900"
                      />
                      <span>{d}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                  Timezone
                </label>
                <select
                  name="timezone"
                  className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                  defaultValue=""
                >
                  <option value="">Select timezone (optional)</option>
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-slate-400">
                  Helps riders in other regions understand if your race times fit
                  them.
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
                placeholder="Describe what kind of rider you are looking for, expectations, communication language, race schedule etc."
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-sky-950 hover:bg-sky-400"
              >
                Publish opening
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}
