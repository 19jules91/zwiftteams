"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const ALL_LEAGUES = ["ZRL", "WTRL_TTT", "Club Ladder", "Local leagues"]

export type TeamFormValues = {
  name: string
  nation: string
  description: string
  discordLink: string
  website: string
  leagues: string[]
}

export default function TeamOnboardingForm({
  initialData,
}: {
  initialData: TeamFormValues
}) {
  const [values, setValues] = useState<TeamFormValues>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function toggleLeague(league: string) {
    setValues((prev) => {
      const exists = prev.leagues.includes(league)
      return {
        ...prev,
        leagues: exists
          ? prev.leagues.filter((l) => l !== league)
          : [...prev.leagues, league],
      }
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to save team profile")
      }

      // Nach erfolgreichem Speichern zurück zum Account
      router.push("/account")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Something went wrong")
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700">
          Team name
        </label>
        <input
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={values.name}
          onChange={(e) =>
            setValues((v) => ({ ...v, name: e.target.value }))
          }
          required
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Nation (e.g. 🇩🇪 or DE)
          </label>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={values.nation}
            onChange={(e) =>
              setValues((v) => ({ ...v, nation: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Discord server / invite link
          </label>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="https://discord.gg/..."
            value={values.discordLink}
            onChange={(e) =>
              setValues((v) => ({ ...v, discordLink: e.target.value }))
            }
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700">
          Website (optional)
        </label>
        <input
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="https://yourteam.com"
          value={values.website}
          onChange={(e) =>
            setValues((v) => ({ ...v, website: e.target.value }))
          }
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700">
          Leagues you race
        </label>
        <div className="mt-1 flex flex-wrap gap-2">
          {ALL_LEAGUES.map((league) => {
            const active = values.leagues.includes(league)
            return (
              <button
                key={league}
                type="button"
                onClick={() => toggleLeague(league)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  active
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-slate-300 bg-white text-slate-700"
                }`}
              >
                {league}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700">
          Short description
        </label>
        <textarea
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          rows={4}
          placeholder="Tell riders about your team, goals, vibe, etc."
          value={values.description}
          onChange={(e) =>
            setValues((v) => ({ ...v, description: e.target.value }))
          }
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : "Save team profile"}
      </button>
    </form>
  )
}
