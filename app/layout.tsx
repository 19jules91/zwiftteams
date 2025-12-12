import "./globals.css"
import Link from "next/link"
import { ReactNode } from "react"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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
        team: {
          ownerId: userId,
        },
      },
    })
  }

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        {/* HEADER */}
        <header className="w-full border-b border-slate-800 bg-slate-900/95 shadow-sm shadow-slate-950/40">
          {/* Bildbanner */}
          <div className="w-full overflow-hidden">
            <img
              src="/zwiftteams_header.png"
              alt="ZwiftTeams – Watopia Ocean Boulevard"
              className="h-[160px] w-full object-cover md:h-[220px] lg:h-[260px]"
            />
          </div>

          {/* Ticker */}
          <div className="w-full bg-slate-950/95 py-2 text-[11px] text-slate-200">
            <div className="mx-auto flex max-w-5xl items-center gap-6 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap">
                <span className="mx-6">🏆 Allez Express recruited 2 new riders</span>
                <span className="mx-6">🔥 New ZRL team openings available</span>
                <span className="mx-6">🚴 Top Rider: Category A – 92 race score</span>
                <span className="mx-6">🎯 {pendingInboxCount} open applications in Inbox</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-wide text-slate-50">
                ZwiftTeams
              </span>
              <span className="rounded-full bg-slate-800 px-2 py-[2px] text-[10px] text-slate-300">
                beta
              </span>
            </div>

            <nav className="flex items-center gap-4 text-xs font-medium text-slate-300">
              <Link
                href="/"
                className="hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/openings"
                className="hover:text-white transition-colors"
              >
                Openings
              </Link>
              <Link
                href="/teams"
                className="hover:text-white transition-colors"
              >
                Teams
              </Link>
              <Link
                href="/riders"
                className="hover:text-white transition-colors"
              >
                Riders
              </Link>

              <Link
                href="/guide"
                className="hover:text-white transition-colors"
              >
                Guide
              </Link>

              {/* Inbox mit Badge */}
              <Link
                href="/inbox"
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <span>Inbox</span>
                {pendingInboxCount > 0 && (
                  <span className="flex h-4 min-w-[1.2rem] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-semibold text-white">
                    {pendingInboxCount > 9 ? "9+" : pendingInboxCount}
                  </span>
                )}
              </Link>

              <Link
                href="/account"
                className="hover:text-white transition-colors"
              >
                Account
              </Link>
            </nav>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="min-h-[calc(100vh-220px)]">
          {children}
        </div>
      </body>
    </html>
  )
}
