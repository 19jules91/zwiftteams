import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = (session.user as any).id as string
  const body = await req.json().catch(() => null)

  if (!body || !body.openingId) {
    return NextResponse.json(
      { error: "Missing openingId" },
      { status: 400 },
    )
  }

  try {
    const opening = await prisma.teamOpening.findUnique({
      where: { id: body.openingId as string },
      include: { team: true },
    })

    if (!opening || !opening.team) {
      return NextResponse.json(
        { error: "Opening or team not found" },
        { status: 404 },
      )
    }

    // ContactRequest anlegen
    const contact = await prisma.contactRequest.create({
      data: {
        fromUserId: userId,
        toUserId: opening.team.ownerId,
        teamId: opening.team.id,
        message:
          typeof body.message === "string" && body.message.trim().length > 0
            ? body.message.trim()
            : null,
      },
    })

    return NextResponse.json({ ok: true, contactId: contact.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to send application" },
      { status: 500 },
    )
  }
}
