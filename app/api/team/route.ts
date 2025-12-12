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
  const body = await req.json()

  try {
    // Gibt es schon ein Team für diesen User?
    const existingTeam = await prisma.team.findFirst({
      where: { ownerId: userId },
    })

    const data = {
      ownerId: userId,
      name: body.name as string,
      nation: (body.nation as string) || null,
      description: (body.description as string) || null,
      discordLink: (body.discordLink as string) || null,
      website: (body.website as string) || null,
      leagues: (body.leagues as string[]) ?? [],
    }

    let team

    if (existingTeam) {
      // Update vorhandenes Team
      team = await prisma.team.update({
        where: { id: existingTeam.id },
        data,
      })
    } else {
      // Neues Team anlegen
      team = await prisma.team.create({
        data,
      })
    }

    return NextResponse.json({ ok: true, team })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to save team profile" },
      { status: 500 },
    )
  }
}
