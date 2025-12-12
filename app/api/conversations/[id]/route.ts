// app/api/conversations/[id]/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Ctx) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = (session.user as any).id as string
  const { id } = await params

  const convo = await prisma.contactRequest.findUnique({
    where: { id },
    include: {
      fromUser: true,
      toUser: true,
      team: true,
      opening: true,
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!convo) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const isFromUser = convo.fromUserId === userId
  const isToUser = convo.toUserId === userId
  const isTeamOwner = convo.team?.ownerId === userId

  if (!isFromUser && !isToUser && !isTeamOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json(convo)
}

export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = (session.user as any).id as string
  const { id } = await params
  const body = await req.json().catch(() => ({} as any))

  const status = (body?.status as string | undefined)?.toLowerCase()
  if (!status || !["accepted", "declined", "pending"].includes(status)) {
    return NextResponse.json(
      { error: "Invalid status. Use accepted|declined|pending" },
      { status: 400 }
    )
  }

  const convo = await prisma.contactRequest.findUnique({
    where: { id },
    include: { team: true },
  })

  if (!convo) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (!convo.team || convo.team.ownerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const updated = await prisma.contactRequest.update({
    where: { id },
    data: { status },
  })

  return NextResponse.json(updated)
}
