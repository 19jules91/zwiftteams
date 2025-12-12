"use client"

import { useState } from "react"

type Props = {
  teamId: string
  existingLogoUrl?: string | null
}

export default function TeamLogoUploader({ teamId, existingLogoUrl }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(existingLogoUrl ?? null)

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const form = new FormData()
      form.append("file", file)
      form.append("teamId", teamId)

      // ✅ Deine Upload-Route (falls sie anders heißt: sag mir den Pfad)
      const res = await fetch("/api/team-logo", {
        method: "POST",
        body: form,
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Upload failed")
      }

      const data = (await res.json()) as { logoUrl?: string }

      if (!data.logoUrl) {
        throw new Error("Upload succeeded but logoUrl missing in response")
      }

      setLogoUrl(data.logoUrl)

      // ✅ Hidden input im Team-Onboarding aktualisieren
      const hidden = document.querySelector(
        'input[name="logoUrl"]'
      ) as HTMLInputElement | null
      if (hidden) hidden.value = data.logoUrl
    } catch (err: any) {
      setError(err?.message ?? "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="h-16 w-16 overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt="Team logo"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-500">
              No logo
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={onFileChange}
            disabled={uploading || !teamId}
            className="block text-xs text-slate-200 file:mr-3 file:rounded-md file:border-0 file:bg-orange-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-950 hover:file:bg-orange-400 disabled:opacity-60"
          />
          <p className="text-[10px] text-slate-500">
            Recommended: square image (PNG/JPG/WebP), max a few MB.
          </p>
        </div>
      </div>

      {uploading && (
        <p className="text-[11px] text-slate-400">Uploading…</p>
      )}
      {error && (
        <p className="text-[11px] text-rose-400">Upload error: {error}</p>
      )}
    </div>
  )
}
