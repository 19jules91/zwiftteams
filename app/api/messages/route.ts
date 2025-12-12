// app/api/messages/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const contactRequestId = url.searchParams.get("contactRequestId")

  if (!contactRequestId) {
    return NextResponse.json(
      { error: "Missing contactRequestId" },
      { status: 400 }
    )
  }

  const session = await getServerSession(authOptions)
  const currentUserId = session?.user
    ? ((session.user as any).id as string)
    : null

  // 👣 aktuellen User als "online" markieren
  if (currentUserId) {
    try {
      await prisma.user.update({
        where: { id: currentUserId },
        data: { lastActiveAt: new Date() },
      })
    } catch {
      // ignore
    }
  }

  const [rows, contact] = await Promise.all([
    prisma.message.findMany({
      where: { contactRequestId },
      include: { sender: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.contactRequest.findUnique({
      where: { id: contactRequestId },
      include: { team: true },
    }),
  ])

  // 👀 alle Messages vom Gegenüber als "gesehen" markieren
  if (currentUserId) {
    try {
      await prisma.message.updateMany({
        where: {
          contactRequestId,
          senderId: { not: currentUserId },
          seenAt: null,
        },
        data: { seenAt: new Date() },
      })
    } catch {
      // ignore
    }
  }

  // 🔎 Gegenüber bestimmen (andere Seite der Konversation)
  let otherUserId: string | null = null

  if (contact) {
    const teamOwnerId = contact.team?.ownerId ?? null

    if (currentUserId) {
      if (currentUserId === contact.fromUserId) {
        otherUserId = contact.toUserId ?? teamOwnerId
      } else if (
        currentUserId === contact.toUserId ||
        currentUserId === teamOwnerId
      ) {
        otherUserId = contact.fromUserId
      }
    }

    if (!otherUserId) {
      otherUserId =
        contact.fromUserId ?? contact.toUserId ?? teamOwnerId
    }
  }

  let otherOnline = false
  let otherIsTyping = false
  let lastSeenByOtherId: string | null = null

  if (otherUserId) {
    // 💡 Online-Status: lastActiveAt < 30 Sekunden
    const other = await prisma.user.findUnique({
      where: { id: otherUserId },
      select: { lastActiveAt: true },
    })

    if (other?.lastActiveAt) {
      const diffMs = Date.now() - other.lastActiveAt.getTime()
      if (diffMs < 30_000) {
        otherOnline = true
      }
    }

    // ✅ "Seen" – letzte Nachricht von currentUser, die vom anderen gesehen wurde
    if (currentUserId) {
      const lastSeenByOther = await prisma.message.findFirst({
        where: {
          contactRequestId,
          senderId: currentUserId,
          seenAt: { not: null },
        },
        orderBy: { seenAt: "desc" },
      })
      lastSeenByOtherId = lastSeenByOther?.id ?? null
    }

    // ⌨️ Tippt der andere gerade?
    const typing = await prisma.typingState.findFirst({
      where: {
        contactRequestId,
        userId: otherUserId,
        updatedAt: {
          gte: new Date(Date.now() - 5000), // letzte 5 Sekunden
        },
      },
    })
    otherIsTyping = !!typing
  }

  const messages = rows.map((m) => ({
    id: m.id,
    text: m.text,
    senderId: m.senderId,
    senderName: m.sender?.name ?? null,
  }))

  return NextResponse.json({
    messages,
    otherOnline,
    otherIsTyping,
    lastSeenByOtherId,
  })
}

// POST bleibt wie vorher – Nachricht speichern
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const userId = (session.user as any).id as string

  const formData = await req.formData()
  const contactRequestId =
    (formData.get("contactRequestId") as string | null) || null
  const textRaw = (formData.get("text") as string | null) || ""
  const text = textRaw.trim()

  if (!contactRequestId || !text) {
    return NextResponse.redirect(new URL("/inbox", req.url))
  }

  const application = await prisma.contactRequest.findUnique({
    where: { id: contactRequestId },
    include: {
      team: true,
    },
  })

  if (!application) {
    return NextResponse.redirect(new URL("/inbox", req.url))
  }

  const isParticipant =
    application.fromUserId === userId ||
    application.toUserId === userId ||
    (application.team && application.team.ownerId === userId)

  if (!isParticipant) {
    return NextResponse.redirect(new URL("/inbox", req.url))
  }

  await prisma.message.create({
    data: {
      contactRequestId,
      senderId: userId,
      text,
    },
  })

  return NextResponse.redirect(new URL("/inbox", req.url))
}
