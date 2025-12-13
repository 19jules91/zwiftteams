import "./globals.css"
import Link from "next/link"
import { ReactNode } from "react"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import TickerBar from "@/components/TickerBar"

export const metadata = {
  title: "ZwiftTeams",
  description: "Rider & team marketplace for Zwift leagues",
}

type RootLayoutProps = {
  children: ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession(authOptions)

  let pendingInboxCount = 0

  if (session && session.user) {
    const userId = (session.user as any).id as string

    pendingInboxCount = await prisma.contactRequest.count({
      where: {
        status: "pending",
        team: { ownerId: userId },
      },
    })
  }

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        {/* HEADER MIT BANNER + NAVIGATION */}
        <header className="w-full border-b border-slate-800 bg-slate-950">
          {/* Bildbanner */}
          <div className="w-full overflow-hidden">
            <img
              src="/zwiftteams_header.png"
              alt="ZwiftTeams – Watopia Ocean Boulevard"
              className="h-[160px] w-full object-cover md:h-[220px] lg:h-[260px]"
            />
          </div>

          {/* 🔥 Live Ticker */}
          <TickerBar />

          {/* Navigation */}
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <div className="text-sm font-semibold tracking-wide text-slate-100">
              ZwiftTeams
            </div>

            <nav className="flex items-center gap-4 text-xs font-medium text-slate-300">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <Link href="/openings" className="hover:text-white">
                Openings
              </Link>
              <Link href="/teams" className="hover:text-white">
                Teams
              </Link>
              <Link href="/riders" className="hover:text-white">
                Riders
              </Link>

              <Link
                href="/inbox"
                className="flex items-center gap-1 hover:text-white"
              >
                <span>Inbox</span>
                {pendingInboxCount > 0 && (
                  <span className="flex h-4 min-w-[1.2rem] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-semibold text-white">
                    {pendingInboxCount > 9 ? "9+" : pendingInboxCount}
                  </span>
                )}
              </Link>

              <Link href="/guide" className="hover:text-white">
                Guide
              </Link>

              <Link href="/account" className="hover:text-white">
                Account
              </Link>
            </nav>
          </div>
        </header>

        {/* PAGE CONTENT */}
        {children}
      </body>
    </html>
  )
}
