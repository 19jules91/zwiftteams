// app/api/team-openings/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const userId = (session.user as any).id as string

  // 🔍 ID direkt aus der URL ziehen, statt über params
  const url = new URL(req.url)
  const segments = url.pathname.split("/").filter(Boolean)
  const openingId = segments[segments.length - 1]

  if (!openingId) {
    return NextResponse.json({ error: "missing_id" }, { status: 400 })
  }

  // Opening + Team holen
  const opening = await prisma.teamOpening.findUnique({
    where: { id: openingId },
    include: { team: true },
  })

  if (!opening || !opening.team) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }

  // Nur der Team-Owner darf löschen
  if (opening.team.ownerId !== userId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }

  // Löschen
  await prisma.teamOpening.delete({
    where: { id: openingId },
  })

  return NextResponse.json({ ok: true })
}
