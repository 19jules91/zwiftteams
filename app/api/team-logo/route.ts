// app/api/team-logo/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  // NICHT beim Import throwen – nur wenn die Route wirklich aufgerufen wird
  if (!url || !key) {
    throw new Error(
      "Supabase env missing. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel."
    )
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  })
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id as string

    const form = await req.formData()
    const file = form.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 })
    }

    const team = await prisma.team.findFirst({ where: { ownerId: userId } })
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    const supabase = getSupabaseAdmin()

    const ext = file.name.split(".").pop()?.toLowerCase() || "png"
    const path = `team-logos/${team.id}-${Date.now()}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from("team-logos")
      .upload(path, buffer, {
        contentType: file.type || "image/png",
        upsert: true,
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data } = supabase.storage.from("team-logos").getPublicUrl(path)
    const publicUrl = data.publicUrl

    // optional: direkt im Team speichern (oder nur URL zurückgeben)
    await prisma.team.update({
      where: { id: team.id },
      data: { logoUrl: publicUrl },
    })

    return NextResponse.json({ url: publicUrl })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Upload failed" }, { status: 500 })
  }
}
