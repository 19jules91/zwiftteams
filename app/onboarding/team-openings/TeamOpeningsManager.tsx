"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type TeamOpening = {
  id: string
  title: string | null
  league: string | null
  category: string | null
  description: string | null
  days: string[]
  timezone: string | null
  createdAt: string | Date
}

type Props = {
  openings: TeamOpening[]
}

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
  "UTC-8",
  "UTC-5",
  "UTC",
  "UTC+1",
  "UTC+2",
  "UTC+8",
  "UTC+10",
]

export default function TeamOpeningsManager({ openings }: Props) {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [league, setLeague] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [timezone, setTimezone] = useState("UTC+1")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function toggleDay(day: string) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  async function handleCreateOpening(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!league && !title) {
      setError("Please select a league or enter a title.")
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        title,
        league,
        category,
        description,
        days: selectedDays,
        timezone,
      }

      const res = await fetch("/api/team-openings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(
          data?.error
            ? `Failed to create opening: ${data.error}`
            : "Failed to create opening."
        )
      } else {
        setTitle("")
        setLeague("")
        setCategory("")
        setDescription("")
        setSelectedDays([])
        setTimezone("UTC+1")
        router.refresh()
      }
    } catch {
      setError("Network error while creating opening.")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    setError(null)
    if (!window.confirm("Delete this opening?")) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/team-openings/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(
          data?.error
            ? `Failed to delete opening: ${data.error}`
            : "Failed to delete opening."
        )
      } else {
        router.refresh()
      }
    } catch {
      setError("Network error while deleting opening.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-50">Team openings</h1>
          <p className="mt-1 text-xs text-slate-300">
            Create and manage your open spots for Zwift riders.
          </p>
        </div>
      </div>

      {/* Create Opening Form */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
        <h2 className="text-sm font-semibold text-slate-100">
          Create new opening
        </h2>
        <p className="mt-1 text-[11px] text-slate-400">
          Define what kind of rider you are looking for. This will show up on
          the global openings page and on your team profile.
        </p>

        <form
          onSubmit={handleCreateOpening}
          className="mt-4 grid gap-4 md:grid-cols-2"
        >
          {/* Left column */}
          <div className="space-y-3">
            {/* League */}
            <div>
              <label className="block text-[11px] font-medium text-slate-200">
                League / format
              </label>
              <select
                value={league}
                onChange={(e) => setLeague(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100"
              >
                <option value="">Select league</option>
                {LEAGUES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-[11px] font-medium text-slate-200">
                Category needed
              </label>
              <div className="mt-1 flex flex-wrap gap-1">
                {CATEGORIES.map((cat) => {
                  const active = category === cat
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() =>
                        setCategory((prev) => (prev === cat ? "" : cat))
                      }
                      className={`rounded-md px-2 py-1 text-[11px] font-semibold ${
                        active
                          ? "bg-orange-500 text-slate-950"
                          : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                      }`}
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-[11px] font-medium text-slate-200">
                Main timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[10px] text-slate-500">
                Riders can filter by timezone to find suitable race times.
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-3">
            {/* Title */}
            <div>
              <label className="block text-[11px] font-medium text-slate-200">
                Title (optional)
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100"
                placeholder="e.g. B sprinter for ZRL team"
              />
              <p className="mt-1 text-[10px] text-slate-500">
                If empty, a title will be auto-generated from league,
                category and role.
              </p>
            </div>

            {/* Days */}
            <div>
              <label className="block text-[11px] font-medium text-slate-200">
                Preferred race days
              </label>
              <div className="mt-1 flex flex-wrap gap-1">
                {DAYS.map((day) => {
                  const active = selectedDays.includes(day)
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`rounded-md px-2 py-1 text-[10px] ${
                        active
                          ? "bg-sky-500 text-sky-950"
                          : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-medium text-slate-200">
                Short description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100"
                placeholder="Describe what you expect from riders, schedule, communication, etc."
              />
            </div>
          </div>

          {/* Error + Submit */}
          <div className="md:col-span-2 flex flex-col gap-2 pt-1">
            {error && (
              <p className="text-[11px] text-rose-400">
                {error}
              </p>
            )}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center rounded-md bg-orange-500 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-orange-400 disabled:opacity-60"
              >
                {submitting ? "Creating..." : "Create opening"}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Existing Openings List */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-100">
          Your current openings
        </h2>

        {(openings || []).filter(Boolean).length === 0 ? (
          <p className="text-xs text-slate-400">
            You don&apos;t have any openings yet. Create one above to let riders
            know you are recruiting.
          </p>
        ) : (
          <div className="space-y-3">
            {(openings || [])
              .filter(Boolean)
              .map((o) => {
                const title =
                  o?.title ||
                  [o?.league, o?.category]
                    .filter(Boolean)
                    .join(" • ") ||
                  "Team opening"

                const createdLabel =
                  o?.createdAt &&
                  (o.createdAt instanceof Date
                    ? o.createdAt.toLocaleString()
                    : new Date(o.createdAt).toLocaleString())

                return (
                  <article
                    key={o!.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-50">
                          {title}
                        </h3>
                        {createdLabel && (
                          <p className="mt-1 text-[11px] text-slate-500">
                            Created {createdLabel}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleDelete(o!.id)}
                          disabled={deletingId === o!.id}
                          className="rounded-md border border-rose-500/70 px-2 py-[3px] text-[10px] font-semibold text-rose-300 hover:bg-rose-500/10 disabled:opacity-60"
                        >
                          {deletingId === o!.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                      {/* Category */}
                      <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                        Cat {o?.category ?? "?"}
                      </span>

                      {/* League */}
                      {o?.league && (
                        <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-700">
                          {o.league}
                        </span>
                      )}

                      {/* Days */}
                      {o?.days && o.days.length > 0 && (
                        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200">
                          {o.days.map((d) => d.slice(0, 3)).join(", ")}
                        </span>
                      )}

                      {/* Timezone */}
                      {o?.timezone && (
                        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200">
                          {o.timezone}
                        </span>
                      )}
                    </div>

                    {o?.description && (
                      <p className="mt-2 text-xs text-slate-200">
                        {o.description}
                      </p>
                    )}
                  </article>
                )
              })}
          </div>
        )}
      </section>
    </div>
  )
}
