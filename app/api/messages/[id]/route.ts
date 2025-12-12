// app/api/messages/[id]/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type Ctx = { params: Promise<{ id: string }> }

async function assertCanAccessMessage(userId: string, messageId: string) {
  const msg = await prisma.message.findUnique({
    where: { id: messageId },
    include: {
      contactRequest: { include: { team: true } },
    },
  })
  if (!msg) return { ok: false as const, status: 404, msg: null }

  const cr = msg.contactRequest
  const isFromUser = cr.fromUserId === userId
  const isToUser = cr.toUserId === userId
  const isTeamOwner = cr.team?.ownerId === userId

  if (!isFromUser && !isToUser && !isTeamOwner) {
    return { ok: false as const, status: 403, msg }
  }

  return { ok: true as const, status: 200, msg }
}

export async function GET(_req: Request, { params }: Ctx) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = (session.user as any).id as string
  const { id } = await params

  const access = await assertCanAccessMessage(userId, id)
  if (!access.ok) {
    return NextResponse.json({ error: access.status === 404 ? "Not found" : "Forbidden" }, { status: access.status })
  }

  return NextResponse.json(access.msg)
}

export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = (session.user as any).id as string
  const { id } = await params
  const body = await req.json().catch(() => ({} as any))

  const access = await assertCanAccessMessage(userId, id)
  if (!access.ok || !access.msg) {
    return NextResponse.json({ error: access.status === 404 ? "Not found" : "Forbidden" }, { status: access.status })
  }

  // Only sender can edit text
  if (access.msg.senderId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const text = typeof body.text === "string" ? body.text.trim() : ""
  if (!text) {
    return NextResponse.json({ error: "Text required" }, { status: 400 })
  }

  const updated = await prisma.message.update({
    where: { id },
    data: { text },
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

  const access = await assertCanAccessMessage(userId, id)
  if (!access.ok || !access.msg) {
    return NextResponse.json({ error: access.status === 404 ? "Not found" : "Forbidden" }, { status: access.status })
  }

  const isSender = access.msg.senderId === userId
  const isTeamOwner = access.msg.contactRequest.team?.ownerId === userId

  if (!isSender && !isTeamOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await prisma.message.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
