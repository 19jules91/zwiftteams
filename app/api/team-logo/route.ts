import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createClient } from "@supabase/supabase-js"

// Supabase Admin Client (Service Role!)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = (session.user as any).id as string
  const formData = await req.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  // Team prüfen (User muss Owner sein)
  const team = await prisma.team.findFirst({
    where: { ownerId: userId },
  })

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 })
  }

  // Dateiname erzeugen
  const ext = file.name.split(".").pop()
  const fileName = `team-${team.id}.${ext}`

  // Upload zu Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("team-logos")
    .upload(fileName, file, {
      upsert: true,
      contentType: file.type,
    })

  if (uploadError) {
    console.error(uploadError)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }

  // Public URL holen
  const { data } = supabase.storage
    .from("team-logos")
    .getPublicUrl(fileName)

  const logoUrl = data.publicUrl

  // Logo-URL im Team speichern
  await prisma.team.update({
    where: { id: team.id },
    data: { logoUrl },
  })

  return NextResponse.json({ logoUrl })
}
