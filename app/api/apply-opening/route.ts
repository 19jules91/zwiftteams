// app/api/apply-opening/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Nur zum Testen: GET /api/apply-opening
export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/apply-opening" })
}

// POST /api/apply-opening – wird vom Opening-Formular benutzt
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const userId = (session.user as any).id as string

  const formData = await req.formData()
  const openingId = (formData.get("openingId") as string | null) || null
  const teamIdFromForm = (formData.get("teamId") as string | null) || null
  const messageRaw = (formData.get("message") as string | null) || ""
  const message = messageRaw.trim() || null

  if (!openingId) {
    return NextResponse.redirect(new URL("/openings", req.url))
  }

  const opening = await prisma.teamOpening.findUnique({
    where: { id: openingId },
    include: {
      team: true,
    },
  })

  if (!opening) {
    return NextResponse.redirect(new URL("/openings", req.url))
  }

  const teamId = teamIdFromForm || opening.teamId
  const toUserId = opening.team?.ownerId ?? null

  await prisma.contactRequest.create({
    data: {
      fromUserId: userId,
      toUserId,
      teamId,
      openingId,
      message,
      status: "pending",
    },
  })

  return NextResponse.redirect(new URL("/inbox", req.url))
}
