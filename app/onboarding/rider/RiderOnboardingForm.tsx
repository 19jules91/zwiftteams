"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const ALL_LEAGUES = ["ZRL", "WTRL_TTT", "Club Ladder"]
const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export type RiderFormValues = {
  displayName: string
  nation: string
  mainCategory: string
  racingScore: string
  searchStatus: string
  zwiftpowerLink: string
  zwiftracingLink: string
  preferredLeagues: string[]
  preferredDays: string[]
  preferredTime: string
  riderType: string
  discordHandle: string
  bio: string
}

export default function RiderOnboardingForm({
  initialData,
}: {
  initialData: RiderFormValues
}) {
  const [values, setValues] = useState<RiderFormValues>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function toggleArrayValue(field: "preferredLeagues" | "preferredDays", v: string) {
    setValues((prev) => {
      const arr = prev[field]
      const exists = arr.includes(v)
      return {
        ...prev,
        [field]: exists ? arr.filter((x) => x !== v) : [...arr, v],
      }
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/rider-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to save rider profile")
      }

      // Nach dem Speichern z.B. auf /account weiterleiten
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

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Display name
          </label>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={values.displayName}
            onChange={(e) =>
              setValues((v) => ({ ...v, displayName: e.target.value }))
            }
            required
          />
        </div>

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
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Zwift category
          </label>
          <select
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={values.mainCategory}
            onChange={(e) =>
              setValues((v) => ({ ...v, mainCategory: e.target.value }))
            }
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Zwift Racing Score
          </label>
          <input
            type="number"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={values.racingScore}
            onChange={(e) =>
              setValues((v) => ({ ...v, racingScore: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Status
          </label>
          <select
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={values.searchStatus}
            onChange={(e) =>
              setValues((v) => ({ ...v, searchStatus: e.target.value }))
            }
          >
            <option value="looking_for_team">Looking for a team</option>
            <option value="open_to_offers">Open to offers</option>
            <option value="guest_only">Guest rides only</option>
          </select>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">
            ZwiftPower link
          </label>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="https://zwiftpower.com/..."
            value={values.zwiftpowerLink}
            onChange={(e) =>
              setValues((v) => ({ ...v, zwiftpowerLink: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Zwiftracing.com link
          </label>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="https://zwiftracing.app/..."
            value={values.zwiftracingLink}
            onChange={(e) =>
              setValues((v) => ({ ...v, zwiftracingLink: e.target.value }))
            }
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700">
          Preferred leagues
        </label>
        <div className="mt-1 flex flex-wrap gap-2">
          {ALL_LEAGUES.map((league) => {
            const active = values.preferredLeagues.includes(league)
            return (
              <button
                key={league}
                type="button"
                onClick={() => toggleArrayValue("preferredLeagues", league)}
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
          Preferred race days
        </label>
        <div className="mt-1 flex flex-wrap gap-2">
          {ALL_DAYS.map((day) => {
            const active = values.preferredDays.includes(day)
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleArrayValue("preferredDays", day)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-700"
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Time window (e.g. 18:00 - 22:00 CET)
          </label>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={values.preferredTime}
            onChange={(e) =>
              setValues((v) => ({ ...v, preferredTime: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Rider type (e.g. Allrounder / Climber)
          </label>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={values.riderType}
            onChange={(e) =>
              setValues((v) => ({ ...v, riderType: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Discord handle
          </label>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Jules#1234"
            value={values.discordHandle}
            onChange={(e) =>
              setValues((v) => ({ ...v, discordHandle: e.target.value }))
            }
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700">
          Short bio
        </label>
        <textarea
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          rows={4}
          value={values.bio}
          onChange={(e) =>
            setValues((v) => ({ ...v, bio: e.target.value }))
          }
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : "Save rider profile"}
      </button>
    </form>
  )
}
