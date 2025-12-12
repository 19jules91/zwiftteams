// app/api/applications/[id]/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = (session.user as any).id as string
  const { id } = await params // ✅ Next.js 16: params is a Promise

  const body = await req.json().catch(() => ({} as any))
  const status = (body?.status as string | undefined)?.toLowerCase()

  if (!status || !["accepted", "declined", "pending"].includes(status)) {
    return NextResponse.json(
      { error: "Invalid status. Use accepted|declined|pending" },
      { status: 400 }
    )
  }

  // Load application and ensure the current user owns the team
  const application = await prisma.contactRequest.findUnique({
    where: { id },
    include: { team: true },
  })

  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (!application.team || application.team.ownerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const updated = await prisma.contactRequest.update({
    where: { id },
    data: { status },
  })

  return NextResponse.json(updated)
}
