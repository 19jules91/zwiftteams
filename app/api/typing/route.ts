// app/api/typing/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const userId = (session.user as any).id as string
  const formData = await req.formData()
  const contactRequestId =
    (formData.get("contactRequestId") as string | null) || null

  if (!contactRequestId) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  try {
    await prisma.typingState.upsert({
      where: {
        contactRequestId_userId: {
          contactRequestId,
          userId,
        },
      },
      create: {
        contactRequestId,
        userId,
      },
      update: {},
    })
  } catch {
    // ignore
  }

  return NextResponse.json({ ok: true })
}
