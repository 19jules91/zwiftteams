// app/onboarding/team/page.tsx

import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import Link from "next/link"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import TeamLogoUploader from "@/components/TeamLogoUploader"

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

export default async function TeamOnboardingPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  const userId = (session.user as any).id as string

  const team = await prisma.team.findFirst({
    where: { ownerId: userId },
  })

  async function saveTeam(formData: FormData) {
    "use server"

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      redirect("/login")
    }

    const userId = (session.user as any).id as string

    const leagues = formData.getAll("leagues") as string[]

    const data = {
      name: ((formData.get("name") as string) || "").trim(),
      nation: ((formData.get("nation") as string) || "").trim() || null,
      description:
        ((formData.get("description") as string) || "").trim() || null,
      discordLink:
        ((formData.get("discordLink") as string) || "").trim() || null,
      website:
        ((formData.get("website") as string) || "").trim() || null,
      leagues,
      logoUrl:
        ((formData.get("logoUrl") as string) || "").trim() || null,
    }

    const saved = await prisma.team.upsert({
      where: { ownerId: userId },
      update: data,
      create: {
        ownerId: userId,
        ...data,
      },
    })

    revalidatePath("/teams")
    revalidatePath(`/teams/${saved.id}`)
    redirect(`/teams/${saved.id}`)
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Step 2 · Team setup
            </p>
            <h1 className="mt-1 text-xl font-bold text-slate-50">
              Your Zwift team
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Set up your team profile so riders can find you and see where you race.
            </p>
          </div>

          <Link
            href="/account"
            className="text-[11px] text-slate-400 underline-offset-2 hover:text-slate-200 hover:underline"
          >
            ← Back to account
          </Link>
        </header>

        {/* Progress indicator */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
          <span className="rounded-full bg-slate-900 px-2 py-[2px]">
            Rider profile
          </span>
          <span className="h-[1px] w-8 bg-slate-700" />
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-[2px] text-slate-100">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
            Team profile
          </span>
          <span className="h-[1px] w-8 bg-slate-700" />
          <span className="rounded-full bg-slate-900 px-2 py-[2px]">
            Openings &amp; Inbox
          </span>
        </div>

        <form
          action={saveTeam}
          className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg"
        >
          {/* SECTION 1: Basic info */}
          <section>
            <h2 className="text-sm font-semibold text-slate-50">
              1. Basic team information
            </h2>
            <p className="mt-1 text-[11px] text-slate-400">
              This is how your team appears in the directory and on openings.
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-200">
                  Team name
                </label>
                <input
                  name="name"
                  defaultValue={team?.name ?? ""}
                  required
                  className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                  placeholder="e.g. Allez Express"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-200">
                  Nation (main base)
                </label>
                <select
                  name="nation"
                  defaultValue={team?.nation ?? ""}
                  className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-slate-500">
                  For example where most riders are based or where you coordinate from.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-200">
                Short description
              </label>
              <textarea
                name="description"
                defaultValue={team?.description ?? ""}
                rows={4}
                className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                placeholder="Describe your team, vibe, race focus and expectations."
              />
            </div>
          </section>

          {/* SECTION 2: Links & logo */}
          <section className="border-t border-slate-800 pt-4">
            <h2 className="text-sm font-semibold text-slate-50">
              2. Discord, website & logo
            </h2>
            <p className="mt-1 text-[11px] text-slate-400">
              Make it easy for riders to learn more and join your community.
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-200">
                  Discord invite link
                </label>
                <input
                  name="discordLink"
                  defaultValue={team?.discordLink ?? ""}
                  className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                  placeholder="https://discord.gg/..."
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  Most teams run everything through Discord.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-200">
                  Website (optional)
                </label>
                <input
                  name="website"
                  defaultValue={team?.website ?? ""}
                  className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                  placeholder="https://your-team-site.com"
                />
              </div>
            </div>

            {/* Logo uploader */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-200 mb-2">
                Team logo
              </label>
              <p className="mb-2 text-[11px] text-slate-500">
                Square PNG or JPG works best. This will be shown in the team directory,
                openings and rider match lists.
              </p>
              <TeamLogoUploader
                teamId={team?.id ?? ""}
                existingLogoUrl={team?.logoUrl ?? null}
              />
              {/* Hidden field that TeamLogoUploader should update */}
              <input
                type="hidden"
                name="logoUrl"
                defaultValue={team?.logoUrl ?? ""}
              />
            </div>
          </section>

          {/* SECTION 3: Leagues */}
          <section className="border-t border-slate-800 pt-4">
            <h2 className="text-sm font-semibold text-slate-50">
              3. Leagues & formats your team races
            </h2>
            <p className="mt-1 text-[11px] text-slate-400">
              This helps riders filter teams that race in the formats they care about.
            </p>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {LEAGUES.map((l) => (
                <label
                  key={l}
                  className="flex cursor-pointer items-center gap-1 rounded-full border border-slate-700 bg-slate-950 px-3 py-1 hover:border-slate-500"
                >
                  <input
                    type="checkbox"
                    name="leagues"
                    value={l}
                    defaultChecked={team?.leagues?.includes(l)}
                    className="h-3 w-3 rounded border-slate-600 bg-slate-900 text-orange-500"
                  />
                  <span className="text-slate-100">{l}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Submit */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
            <p className="text-[11px] text-slate-500">
              You can update your team profile at any time.
            </p>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-orange-400"
            >
              Save team profile
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
