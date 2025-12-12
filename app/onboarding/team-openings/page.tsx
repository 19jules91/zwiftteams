// app/onboarding/team-openings/page.tsx
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import TeamOpeningsManager from "./TeamOpeningsManager"

export default async function TeamOpeningsOnboardingPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  const userId = (session.user as any).id as string

  const team = await prisma.team.findFirst({
    where: { ownerId: userId },
  })

  if (!team) {
    // Kein Team => zuerst Team anlegen
    redirect("/onboarding/team")
  }

  const openings = await prisma.teamOpening.findMany({
    where: { teamId: team.id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <TeamOpeningsManager openings={openings} />
      </div>
    </main>
  )
}
