// app/api/applications/[id]/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request, context: { params: { id: string } }) {
  const { id } = context.params

  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const userId = (session.user as any).id as string

  const formData = await req.formData()
  const action = (formData.get("action") as string | null) || ""

  // Application + Team holen
  const application = await prisma.contactRequest.findUnique({
    where: { id },
    include: {
      team: true,
    },
  })

  if (!application || !application.team) {
    return NextResponse.redirect(new URL("/inbox", req.url))
  }

  // Nur Team-Owner darf entscheiden
  if (application.team.ownerId !== userId) {
    return NextResponse.redirect(new URL("/inbox", req.url))
  }

  let status: string

  if (action === "accept") {
    status = "accepted"
  } else if (action === "decline") {
    status = "declined"
  } else {
    return NextResponse.redirect(new URL("/inbox", req.url))
  }

  await prisma.contactRequest.update({
    where: { id },
    data: {
      status,
    },
  })

  return NextResponse.redirect(new URL("/inbox", req.url))
}
