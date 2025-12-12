// app/onboarding/rider/page.tsx

import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import Link from "next/link"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const CATEGORIES = ["A", "B", "C", "D"]

const COUNTRIES = [
  { code: "", label: "Select nation" },
  { code: "DE", label: "Germany" },
  { code: "AT", label: "Austria" },
  { code: "CH", label: "Switzerland" },
  { code: "NL", label: "Netherlands" },
  { code: "BE", label: "Belgium" },
  { code: "FR", label: "France" },
  { code: "GB", label: "United Kingdom" },
  { code: "IE", label: "Ireland" },
  { code: "ES", label: "Spain" },
  { code: "IT", label: "Italy" },
  { code: "DK", label: "Denmark" },
  { code: "NO", label: "Norway" },
  { code: "SE", label: "Sweden" },
  { code: "FI", label: "Finland" },
  { code: "PL", label: "Poland" },
  { code: "US", label: "United States" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "NZ", label: "New Zealand" },
  { code: "ZA", label: "South Africa" },
]

const LEAGUES = [
  "ZRL",
  "WTRL_TTT",
  "Club Ladder",
  "Workout",
  "Grouprides",
  "Female only",
]

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

const RIDER_TYPES = [
  "All-rounder",
  "Sprinter",
  "Climber",
  "Puncheur",
  "Time trialist",
  "Rouleur",
]

const SEARCH_STATUS = [
  { value: "actively_looking", label: "Actively looking for a team" },
  { value: "open", label: "Open for offers" },
  { value: "not_looking", label: "Not looking right now" },
]

const TIMEZONES = [
  "CET / CEST (Central Europe)",
  "UK time (GMT / BST)",
  "US Eastern",
  "US Central",
  "US Pacific",
  "Australia / New Zealand",
  "Other / flexible",
]

const GENDERS = [
  { value: "", label: "Select gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other / prefer not to say" },
]

export default async function RiderOnboardingPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  const userId = (session.user as any).id as string

  const rider = await prisma.riderProfile.findUnique({
    where: { userId },
  })

  async function saveRider(formData: FormData) {
    "use server"

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      redirect("/login")
    }

    const userId = (session.user as any).id as string

    const preferredLeagues = formData.getAll("preferredLeagues") as string[]
    const preferredDays = formData.getAll("preferredDays") as string[]

    const data = {
      displayName: ((formData.get("displayName") as string) || "").trim(),
      nation: ((formData.get("nation") as string) || "").trim() || null,
      mainCategory: (formData.get("mainCategory") as string) || "B",
      racingScore:
        (formData.get("racingScore") as string)?.trim() !== ""
          ? Number(formData.get("racingScore"))
          : null,
      searchStatus:
        ((formData.get("searchStatus") as string) || "").trim() ||
        "actively_looking",

      zwiftpowerLink:
        ((formData.get("zwiftpowerLink") as string) || "").trim() || null,
      zwiftracingLink:
        ((formData.get("zwiftracingLink") as string) || "").trim() || null,

      preferredLeagues,
      preferredDays,
      preferredTime:
        ((formData.get("preferredTime") as string) || "").trim() || null,
      riderType:
        ((formData.get("riderType") as string) || "").trim() || null,
      discordHandle:
        ((formData.get("discordHandle") as string) || "").trim() || null,
      bio: ((formData.get("bio") as string) || "").trim() || null,

      gender:
        ((formData.get("gender") as string) || "").trim() || null,
    }

    const profile = await prisma.riderProfile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    })

    revalidatePath("/riders")
    revalidatePath(`/riders/${profile.id}`)
    redirect(`/riders/${profile.id}`)
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Step 1 · Rider setup
            </p>
            <h1 className="mt-1 text-xl font-bold text-slate-50">
              Your rider profile
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              This profile is visible to teams and used for matchmaking with team openings.
            </p>
          </div>

          <Link
            href="/account"
            className="text-[11px] text-slate-400 underline-offset-2 hover:text-slate-200 hover:underline"
          >
            ← Back to account
          </Link>
        </header>

        {/* Progress */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-[2px] text-slate-100">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
            Rider profile
          </span>
          <span className="h-[1px] w-8 bg-slate-700" />
          <span className="rounded-full bg-slate-900 px-2 py-[2px]">
            Team profile
          </span>
          <span className="h-[1px] w-8 bg-slate-700" />
          <span className="rounded-full bg-slate-900 px-2 py-[2px]">
            Openings &amp; Inbox
          </span>
        </div>

        <form
          action={saveRider}
          className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg"
        >
          {/* SECTION 1: Core info */}
          <section>
            <h2 className="text-sm font-semibold text-slate-50">
              1. Core rider information
            </h2>
            <p className="mt-1 text-[11px] text-slate-400">
              Basic details teams will look at first: name, category, nation and race score.
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-200">
                  Display name
                </label>
                <input
                  name="displayName"
                  defaultValue={rider?.displayName ?? ""}
                  required
                  className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                  placeholder="How teams should see your name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-200">
                  Nation
                </label>
                <select
                  name="nation"
                  defaultValue={rider?.nation ?? ""}
                  className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-slate-500">
                  Stored as 2-letter code (e.g. DE, US, GB).
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-200">
                  Main Zwift category
                </label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <label
                      key={c}
                      className={`inline-flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-xs ${
                        rider?.mainCategory === c
                          ? "border-orange-500 bg-orange-500/10 text-orange-300"
                          : "border-slate-700 bg-slate-950 text-slate-200 hover:border-slate-500"
                      }`}
                    >
                      <input
                        type="radio"
                        name="mainCategory"
                        value={c}
                        defaultChecked={rider?.mainCategory === c || (!rider && c === "B")}
                        className="hidden"
                      />
                      <span className="font-semibold">{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-200">
                  Zwift Racing Score (optional)
                </label>
                <input
                  type="number"
                  name="racingScore"
                  defaultValue={
                    typeof rider?.racingScore === "number"
                      ? rider.racingScore
                      : ""
                  }
                  className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                  placeholder="e.g. 450"
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  Used by some leagues to balance pens and rosters.
                </p>
              </div>
            </div>

            {/* Gender + search status */}
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-200">
                  Gender (required for some leagues)
                </label>
                <select
                  name="gender"
                  defaultValue={rider?.gender ?? ""}
                  className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                >
                  {GENDERS.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-slate-500">
                  This can be required for female-only leagues and teams.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-200">
                  Search status
                </label>
                <select
                  name="searchStatus"
                  defaultValue={rider?.searchStatus ?? "actively_looking"}
                  className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                >
                  {SEARCH_STATUS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-slate-500">
                  Teams can filter riders based on this.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 2: Links & contact */}
          <section className="border-t border-slate-800 pt-4">
            <h2 className="text-sm font-semibold text-slate-50">
              2. Links & contact
            </h2>
            <p className="mt-1 text-[11px] text-slate-400">
              Optional, but highly recommended for serious teams.
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-200">
                  ZwiftPower profile (URL)
                </label>
                <input
                  name="zwiftpowerLink"
                  defaultValue={rider?.zwiftpowerLink ?? ""}
                  className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                  placeholder="https://zwiftpower.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-200">
                  ZwiftRacing.com profile (URL)
                </label>
                <input
                  name="zwiftracingLink"
                  defaultValue={rider?.zwiftracingLink ?? ""}
                  className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                  placeholder="https://zwiftracing.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-200">
                  Discord handle
                </label>
                <input
                  name="discordHandle"
                  defaultValue={rider?.discordHandle ?? ""}
                  className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                  placeholder="e.g. ridername#1234"
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  Most teams coordinate everything through Discord.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-200">
                  Rider type (optional)
                </label>
                <select
                  name="riderType"
                  defaultValue={rider?.riderType ?? ""}
                  className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                >
                  <option value="">Select type</option>
                  {RIDER_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-slate-500">
                  Helps teams build balanced lineups (sprinters, climbers, TT, …).
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-200">
                Short bio (optional)
              </label>
              <textarea
                name="bio"
                defaultValue={rider?.bio ?? ""}
                rows={4}
                className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                placeholder="Tell teams briefly who you are, your goals and what kind of team you are looking for."
              />
            </div>
          </section>

          {/* SECTION 3: Availability & preferences */}
          <section className="border-t border-slate-800 pt-4">
            <h2 className="text-sm font-semibold text-slate-50">
              3. Availability & league preferences
            </h2>
            <p className="mt-1 text-[11px] text-slate-400">
              This is used for matchmaking with team openings (leagues, days, timezone).
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {/* Leagues */}
              <div>
                <label className="block text-xs font-medium text-slate-200">
                  Leagues / formats you are interested in
                </label>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {LEAGUES.map((l) => (
                    <label
                      key={l}
                      className="flex cursor-pointer items-center gap-1 rounded-full border border-slate-700 bg-slate-950 px-2 py-1 hover:border-slate-500"
                    >
                      <input
                        type="checkbox"
                        name="preferredLeagues"
                        value={l}
                        defaultChecked={rider?.preferredLeagues?.includes(l)}
                        className="h-3 w-3 rounded border-slate-600 bg-slate-900 text-orange-500"
                      />
                      <span className="text-slate-100">{l}</span>
                    </label>
                  ))}
                </div>
                <p className="mt-1 text-[10px] text-slate-500">
                  Used to highlight the most relevant team openings.
                </p>
              </div>

              {/* Days */}
              <div>
                <label className="block text-xs font-medium text-slate-200">
                  Days you are usually available to race
                </label>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {DAYS.map((d) => (
                    <label
                      key={d}
                      className="flex cursor-pointer items-center gap-1 rounded-full border border-slate-700 bg-slate-950 px-2 py-1 hover:border-slate-500"
                    >
                      <input
                        type="checkbox"
                        name="preferredDays"
                        value={d}
                        defaultChecked={rider?.preferredDays?.includes(d)}
                        className="h-3 w-3 rounded border-slate-600 bg-slate-900 text-orange-500"
                      />
                      <span className="text-slate-100">{d}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Timezone */}
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-200">
                  Main timezone / region
                </label>
                <select
                  name="preferredTime"
                  defaultValue={rider?.preferredTime ?? ""}
                  className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                >
                  <option value="">Select timezone</option>
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-slate-500">
                  For example: CET evenings, UK evenings, US East mornings, etc.
                </p>
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <p className="text-[11px] text-slate-500">
              You can update your rider profile at any time.
            </p>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-orange-400"
            >
              Save rider profile
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
