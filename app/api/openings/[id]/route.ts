// app/api/openings/[id]/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params

  const opening = await prisma.teamOpening.findUnique({
    where: { id },
    include: { team: true },
  })

  if (!opening) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(opening)
}

export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = (session.user as any).id as string
  const { id } = await params
  const body = await req.json().catch(() => ({} as any))

  const opening = await prisma.teamOpening.findUnique({
    where: { id },
    include: { team: true },
  })

  if (!opening) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  if (opening.team.ownerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const data = {
    title: typeof body.title === "string" ? body.title.trim() : opening.title,
    league: typeof body.league === "string" ? body.league.trim() || null : opening.league,
    category:
      typeof body.category === "string" ? body.category.trim() || null : opening.category,
    description:
      typeof body.description === "string" ? body.description.trim() || null : opening.description,
    days: Array.isArray(body.days) ? body.days.filter((x: any) => typeof x === "string") : opening.days,
    timezone:
      typeof body.timezone === "string" ? body.timezone.trim() || null : opening.timezone,
  }

  const updated = await prisma.teamOpening.update({
    where: { id },
    data,
  })

  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = (session.user as any).id as string
  const { id } = await params

  const opening = await prisma.teamOpening.findUnique({
    where: { id },
    include: { team: true },
  })

  if (!opening) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  if (opening.team.ownerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await prisma.teamOpening.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
