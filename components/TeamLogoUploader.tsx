"use client"

import { useState } from "react"
import Image from "next/image"
import { supabaseClient } from "@/lib/supabaseClient"

type Props = {
  initialLogoUrl?: string | null
}

export default function TeamLogoUploader({ initialLogoUrl }: Props) {
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl ?? "")
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setUploading(true)

    try {
      // einfacher, eindeutiger Dateipfad
      const ext = file.name.split(".").pop()
      const path = `team-${crypto.randomUUID()}.${ext}`

      const { error: uploadError } = await supabaseClient.storage
        .from("team-logos")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: true,
        })

      if (uploadError) {
        throw uploadError
      }

      const {
        data: { publicUrl },
      } = supabaseClient.storage.from("team-logos").getPublicUrl(path)

      setLogoUrl(publicUrl)
    } catch (err: any) {
      console.error(err)
      setError("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-slate-700">
        Team logo
      </label>

      {/* Hidden field für das Formular */}
      <input type="hidden" name="logoUrl" value={logoUrl} />

      <div className="flex items-center gap-4">
        <label className="inline-flex cursor-pointer items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold hover:bg-slate-50">
          {uploading ? "Uploading…" : "Choose file"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>

        {logoUrl && (
          <div className="relative h-12 w-12 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt="Team logo"
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>

      {error && <p className="text-[11px] text-red-600">{error}</p>}
      {!error && (
        <p className="text-[11px] text-slate-500">
          PNG or JPG, square works best. Uploaded to Supabase Storage.
        </p>
      )}
    </div>
  )
}
