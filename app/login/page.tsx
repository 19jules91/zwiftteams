"use client"

import { signIn } from "next-auth/react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-10">
        {/* Card */}
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-slate-900/60">
          {/* Logo / Title */}
          <div className="mb-6 text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Welcome to
            </div>
            <div className="mt-1 text-2xl font-bold text-slate-50">
              ZwiftTeams
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Rider &amp; team marketplace for Zwift leagues
            </p>
          </div>

          {/* Info */}
          <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-[11px] text-slate-300">
            <p>
              Log in to create your{" "}
              <span className="font-semibold text-slate-50">rider profile</span>,{" "}
              manage your{" "}
              <span className="font-semibold text-slate-50">team openings</span>{" "}
              and chat via the{" "}
              <span className="font-semibold text-slate-50">Inbox</span>.
            </p>
          </div>

          {/* Login buttons */}
          <div className="space-y-3">
            {/* Discord */}
            <button
              type="button"
              onClick={() =>
                signIn("discord", {
                  callbackUrl: "/",
                })
              }
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#5865F2] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#4752d6] focus:outline-none focus:ring-2 focus:ring-[#5865F2]/70 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <span className="text-lg">💬</span>
              <span>Continue with Discord</span>
            </button>

            {/* Google */}
            <button
              type="button"
              onClick={() =>
                signIn("google", {
                  callbackUrl: "/",
                })
              }
              className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-100 shadow-sm hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <span className="text-lg">🌐</span>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Small extra info */}
          <div className="mt-5 border-t border-slate-800 pt-4 text-[11px] text-slate-400">
            <p>
              By continuing, you agree that this project is{" "}
              <span className="font-semibold text-slate-200">community-run</span>{" "}
              and not affiliated with Zwift. Please keep all communication
              friendly and respectful.
            </p>

            <p className="mt-3">
              Not sure what to do next? Check the{" "}
              <Link
                href="/guide"
                className="font-semibold text-sky-300 hover:text-sky-200"
              >
                ZwiftTeams guide
              </Link>{" "}
              for riders and teams.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
