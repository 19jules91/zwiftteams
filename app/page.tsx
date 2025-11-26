<details>
<summary><strong>📄 Homepage Code (English)</strong> – antippen zum Öffnen</summary>

  import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-12 md:flex-row md:items-center">
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              zwiftteams – The rider market for Zwift racing
            </h1>
            <p className="mt-4 text-slate-600">
              Connect riders and teams for ZRL, WTRL and Club Ladder.
              Simple, transparent and built for the Zwift community.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#"
                className="rounded-md bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-orange-600"
              >
                I&apos;m a rider
              </a>
              <a
                href="#"
                className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100"
              >
                I&apos;m a team
              </a>
            </div>
          </div>

          <div className="mt-8 flex-1 md:mt-0">
            <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 text-slate-50 shadow-lg">
              <p className="text-sm font-semibold text-orange-300">
                Quick start
              </p>
              <p className="mt-2 text-sm text-slate-100">
                Sign in with Google, Discord or email, create your rider or team
                profile and get visible in the Zwift community.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

  </details>
