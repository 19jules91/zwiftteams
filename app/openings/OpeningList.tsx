"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import CategoryBadge from "@/components/CategoryBadge"

type OpeningWithTeam = {
  id: string
  categoryNeeded: string
  role: string | null
  league: string | null
  dayOfWeek: string | null
  raceTime: string | null
  minRacingScore: number | null
  requirements: string | null
  isOpen: boolean
  team: {
    id: string
    name: string
    nation: string | null
    discordLink: string | null
  }
}

export default function OpeningList({ openings }: { openings: OpeningWithTeam[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  async function handleApply(openingId: string) {
    setError(null)
    setSuccess(null)

    const message = window.prompt(
      "Optional: send a short message to the team (who you are, race experience, etc.)",
    )

    if (message === null) return

    setLoadingId(openingId)
    try {
      const res = await fetch("/api/opening-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ openingId, message }),
      })

      if (res.status === 401) {
        setError("Please log in before applying.")
        router.push("/login")
        return
      }

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || "Failed to send application")
      }

      setSuccess("Your application has been sent to the team.")
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div>
      {error && (
        <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p className="mb-3 rounded-md bg-green-50 px-3 py-2 text-xs text-green-700">
          {success}
        </p>
      )}

      <ul className="space-y-3">
        {openings.map((o) => (
          <li
            key={o.id}
            className="rounded-xl border border-slate-200 bg-white p-4 text-xs md:text-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Kategorie-Icon */}
                <CategoryBadge category={o.categoryNeeded} />

                <Link
                  href={`/teams/${o.team.id}`}
                  className="text-sm font-semibold text-slate-900 hover:underline underline-offset-2"
                >
                  {o.team.name}
                </Link>

                {o.team.nation && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                    {o.team.nation}
                  </span>
                )}

                {o.league && (
                  <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-700">
                    {o.league}
                  </span>
                )}

                {o.role && (
                  <span className="text-[11px] text-slate-700">{o.role}</span>
                )}
              </div>

              <div className="text-right text-[11px] text-slate-600">
                {o.dayOfWeek && <div>{o.dayOfWeek}</div>}
                {o.raceTime && <div>{o.raceTime}</div>}
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600">
              {typeof o.minRacingScore === "number" && (
                <span>Min. Zwift Racing Score: {o.minRacingScore}</span>
              )}
              <span>Status: {o.isOpen ? "Open" : "Filled / closed"}</span>
            </div>

            {o.requirements && (
              <p className="mt-2 text-[11px] text-slate-700">
                {o.requirements}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div className="flex gap-2">
                <button
                  onClick={() => handleApply(o.id)}
                  disabled={loadingId === o.id}
                  className="rounded-md bg-slate-900 px-3 py-1 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {loadingId === o.id ? "Sending..." : "I’m interested"}
                </button>

                <Link
                  href={`/teams/${o.team.id}`}
                  className="rounded-md border border-slate-300 px-2 py-1 font-semibold text-slate-800 hover:bg-slate-100"
                >
                  View team
                </Link>
              </div>

              {o.team.discordLink && (
                <a
                  href={o.team.discordLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-600 underline-offset-2 hover:underline"
                >
                  Contact via Discord
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
