// app/api/team-openings/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    // Frontend erwartet JSON, keine HTML-Redirects mehr
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const userId = (session.user as any).id as string

  // Team des Users suchen (Owner)
  const team = await prisma.team.findFirst({
    where: { ownerId: userId },
  })

  if (!team) {
    return NextResponse.json(
      { error: "no_team_for_user" },
      { status: 400 }
    )
  }

  // 🔍 Sowohl JSON-Body als auch FormData unterstützen
  const contentType = req.headers.get("content-type") || ""
  let body: any = {}

  if (contentType.includes("application/json")) {
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { error: "invalid_json" },
        { status: 400 }
      )
    }
  } else {
    const formData = await req.formData()
    body = Object.fromEntries(formData.entries())
  }

  const rawTitle = (body.title as string | undefined) || ""
  const titleFromBody = rawTitle.trim()

  const category = (body.category as string | undefined) || ""
  const role = (body.role as string | undefined) || ""
  const league = (body.league as string | undefined) || ""
  const description = (body.description as string | undefined) || ""
  const timezone = (body.timezone as string | undefined) || ""

  // days kann als Array oder als einzelner String kommen
  let days: string[] = []
  if (Array.isArray(body.days)) {
    days = body.days.map((d: any) => String(d))
  } else if (typeof body.days === "string" && body.days.trim() !== "") {
    // evtl. kommasepariert
    days = body.days.split(",").map((d: string) => d.trim())
  }

  // Falls kein expliziter Title, aus anderen Feldern zusammenbauen
  const autoTitle = [league, role, category].filter(Boolean).join(" • ")
  const title = titleFromBody || autoTitle || "Team opening"

  const opening = await prisma.teamOpening.create({
    data: {
      teamId: team.id,
      title,
      league: league || null,
      category: category || null,
      description: description.trim() || null,
      days,
      timezone: timezone.trim() || null,
    },
  })

  // 👉 Immer JSON zurückgeben, kein HTML/Redirect
  return NextResponse.json({
    ok: true,
    openingId: opening.id,
    teamId: team.id,
  })
}
