"use client"

import { useState } from "react"
import ApplicationStatusBadge from "./ApplicationStatusBadge"

type Props = {
  id: string
  initialStatus: string
}

export default function ApplicationActions({ id, initialStatus }: Props) {
  const [status, setStatus] = useState(initialStatus)
  const [loading, setLoading] = useState<"accepted" | "declined" | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function updateStatus(next: "accepted" | "declined") {
    try {
      setLoading(next)
      setError(null)

      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: next }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Failed to update status")
      }

      const data = await res.json()
      setStatus(data.status ?? next)
    } catch (err: any) {
      console.error(err)
      setError("Could not update. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  const isPending = status === "pending"

  return (
    <div className="flex flex-col items-end gap-1 text-[11px]">
      <ApplicationStatusBadge status={status} />

      {isPending ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => updateStatus("accepted")}
            disabled={loading !== null}
            className="rounded-md bg-emerald-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading === "accepted" ? "Saving..." : "Accept"}
          </button>
          <button
            type="button"
            onClick={() => updateStatus("declined")}
            disabled={loading !== null}
            className="rounded-md bg-rose-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-rose-700 disabled:opacity-60"
          >
            {loading === "declined" ? "Saving..." : "Decline"}
          </button>
        </div>
      ) : (
        <p className="text-[11px] text-slate-500">
          This application has been {status}.
        </p>
      )}

      {error && <p className="text-[11px] text-rose-600">{error}</p>}
    </div>
  )
}
