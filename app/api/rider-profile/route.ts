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
    const racingScore =
      body.racingScore && body.racingScore !== ""
        ? parseInt(body.racingScore, 10)
        : null

    const profile = await prisma.riderProfile.upsert({
      where: { userId },
      update: {
        displayName: body.displayName,
        nation: body.nation || null,
        mainCategory: body.mainCategory,
        racingScore: racingScore ?? null,
        searchStatus: body.searchStatus,
        zwiftpowerLink: body.zwiftpowerLink || null,
        zwiftracingLink: body.zwiftracingLink || null,
        preferredLeagues: body.preferredLeagues ?? [],
        preferredDays: body.preferredDays ?? [],
        preferredTime: body.preferredTime || null,
        riderType: body.riderType || null,
        discordHandle: body.discordHandle || null,
        bio: body.bio || null,
      },
      create: {
        userId,
        displayName: body.displayName,
        nation: body.nation || null,
        mainCategory: body.mainCategory,
        racingScore: racingScore ?? null,
        searchStatus: body.searchStatus,
        zwiftpowerLink: body.zwiftpowerLink || null,
        zwiftracingLink: body.zwiftracingLink || null,
        preferredLeagues: body.preferredLeagues ?? [],
        preferredDays: body.preferredDays ?? [],
        preferredTime: body.preferredTime || null,
        riderType: body.riderType || null,
        discordHandle: body.discordHandle || null,
        bio: body.bio || null,
      },
    })

    return NextResponse.json({ ok: true, profile })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to save rider profile" },
      { status: 500 },
    )
  }
}
