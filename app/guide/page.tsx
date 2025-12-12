// app/guide/page.tsx

import Link from "next/link"

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-50">
            How ZwiftTeams works
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            A short guideline for riders and teams on how to use ZwiftTeams as a
            rider market for Zwift leagues.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Rider guide */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
            <h2 className="text-lg font-semibold text-slate-50">
              For riders 🧑‍🚴
            </h2>
            <p className="mt-1 text-xs text-slate-300">
              You are looking for a team for ZRL, WTRL TTT, Club Ladder, or
              other Zwift leagues? This is your flow.
            </p>

            <ol className="mt-4 space-y-3 text-sm text-slate-100">
              <li>
                <span className="font-semibold text-orange-400">
                  1. Sign in
                </span>
                <p className="mt-1 text-xs text-slate-300">
                  Use <span className="font-medium">Discord</span>,{" "}
                  <span className="font-medium">Google</span>, or{" "}
                  <span className="font-medium">email</span> to log in. You can
                  always switch devices later.
                </p>
              </li>

              <li>
                <span className="font-semibold text-orange-400">
                  2. Create your rider profile
                </span>
                <p className="mt-1 text-xs text-slate-300">
                  Go to <span className="font-mono text-slate-100">Account → Rider profile</span> and fill in:
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-slate-300">
                  <li>Display name and nation</li>
                  <li>Main Zwift race category (A / B / C / D)</li>
                  <li>ZwiftRacing.com and ZwiftPower links</li>
                  <li>Preferred leagues (ZRL, TTT, Club Ladder, etc.)</li>
                  <li>Preferred race days and timezone</li>
                  <li>Rider type (sprinter, climber, all-rounder, TT, …)</li>
                  <li>Discord handle so teams can contact you</li>
                  <li>Gender (required for some leagues / female-only teams)</li>
                </ul>
              </li>

              <li>
                <span className="font-semibold text-orange-400">
                  3. Browse openings
                </span>
                <p className="mt-1 text-xs text-slate-300">
                  Go to <Link href="/openings" className="text-sky-300 hover:text-sky-200">Openings</Link> and:
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-slate-300">
                  <li>Filter by league (ZRL, TTT, Club Ladder, …)</li>
                  <li>Filter by category and timezone</li>
                  <li>Check team details (description, nation, Discord)</li>
                </ul>
              </li>

              <li>
                <span className="font-semibold text-orange-400">
                  4. Apply to a team
                </span>
                <p className="mt-1 text-xs text-slate-300">
                  On an opening, click <span className="font-medium">Apply</span>, send a short message and your
                  application will go directly to the team owner.
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  All conversations appear in your{" "}
                  <Link href="/inbox" className="text-sky-300 hover:text-sky-200">
                    Inbox
                  </Link>{" "}
                  where you can chat in real time.
                </p>
              </li>

              <li>
                <span className="font-semibold text-orange-400">
                  5. Keep your profile up to date
                </span>
                <p className="mt-1 text-xs text-slate-300">
                  Update your category, race score, weight or focus when things
                  change. This helps teams understand if you are a fit for their
                  league roster.
                </p>
              </li>
            </ol>

            <div className="mt-4 rounded-xl border border-slate-700/70 bg-slate-950/80 p-3 text-[11px] text-slate-300">
              <div className="mb-1 font-semibold text-slate-50">
                Rider tips
              </div>
              <ul className="list-disc space-y-1 pl-4">
                <li>Be honest about your power, availability and goals.</li>
                <li>
                  If you only want to race specific leagues (e.g. ZRL only),
                  mention it in your bio.
                </li>
                <li>
                  Answer team messages in your Inbox so teams know you are
                  active.
                </li>
              </ul>
            </div>
          </section>

          {/* Team guide */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
            <h2 className="text-lg font-semibold text-slate-50">
              For teams 🚴‍♂️🚴‍♀️
            </h2>
            <p className="mt-1 text-xs text-slate-300">
              You are building or growing a Zwift race team? Use ZwiftTeams to
              recruit riders and manage openings.
            </p>

            <ol className="mt-4 space-y-3 text-sm text-slate-100">
              <li>
                <span className="font-semibold text-sky-400">
                  1. Sign in as team owner
                </span>
                <p className="mt-1 text-xs text-slate-300">
                  Log in with Discord, Google or email. You should use the
                  account that will manage your roster long-term.
                </p>
              </li>

              <li>
                <span className="font-semibold text-sky-400">
                  2. Create your team profile
                </span>
                <p className="mt-1 text-xs text-slate-300">
                  Go to <span className="font-mono text-slate-100">Account → Team profile</span> and add:
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-slate-300">
                  <li>Team name and nation</li>
                  <li>Logo (optional, but recommended)</li>
                  <li>Short description (vibe, goals, communication style)</li>
                  <li>Discord invite link</li>
                  <li>
                    Website or social links (if you have them)
                  </li>
                  <li>
                    Leagues you are active in (
                    <span className="font-mono text-slate-100">
                      ZRL, WTRL_TTT, Club Ladder, Workout, Grouprides, Female
                      only
                    </span>
                    )
                  </li>
                </ul>
              </li>

              <li>
                <span className="font-semibold text-sky-400">
                  3. Create team openings
                </span>
                <p className="mt-1 text-xs text-slate-300">
                  Go to{" "}
                  <span className="font-mono text-slate-100">
                    Account → Manage team openings
                  </span>{" "}
                  and:
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-slate-300">
                  <li>Select league / format</li>
                  <li>Select category needed (A / B / C / D)</li>
                  <li>Choose main timezone and race days</li>
                  <li>Add a clear description and expectations</li>
                </ul>
              </li>

              <li>
                <span className="font-semibold text-sky-400">
                  4. Manage applications
                </span>
                <p className="mt-1 text-xs text-slate-300">
                  When riders apply to your openings, you will see a new thread
                  in your{" "}
                  <Link href="/inbox" className="text-sky-300 hover:text-sky-200">
                    Inbox
                  </Link>
                  . Use the chat to:
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-slate-300">
                  <li>Ask for extra info (ZwiftPower, race experience, etc.)</li>
                  <li>Align on goals, availability and league slots</li>
                  <li>Share Discord roles or team server link</li>
                </ul>
              </li>

              <li>
                <span className="font-semibold text-sky-400">
                  5. Clean up your openings
                </span>
                <p className="mt-1 text-xs text-slate-300">
                  When a spot is filled or no longer needed, go back to{" "}
                  <span className="font-mono text-slate-100">
                    Manage team openings
                  </span>{" "}
                  and delete the opening. This keeps the openings page relevant
                  and avoids confusion for riders.
                </p>
              </li>
            </ol>

            <div className="mt-4 rounded-xl border border-slate-700/70 bg-slate-950/80 p-3 text-[11px] text-slate-300">
              <div className="mb-1 font-semibold text-slate-50">
                Team tips
              </div>
              <ul className="list-disc space-y-1 pl-4">
                <li>
                  Be specific: mention race days, time windows and what you
                  expect from riders.
                </li>
                <li>
                  If you run female-only rosters, clearly mark and respect this
                  in your openings.
                </li>
                <li>
                  Reply to applications, even if it&apos;s a polite &quot;no&quot; – this
                  keeps the community friendly.
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* FAQ */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
          <h2 className="text-lg font-semibold text-slate-50">FAQ</h2>
          <div className="mt-4 space-y-4 text-sm text-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-50">
                Is ZwiftTeams official?
              </h3>
              <p className="mt-1 text-xs text-slate-300">
                No. ZwiftTeams is an independent rider marketplace built around
                Zwift leagues like ZRL, WTRL TTT and Club Ladder. It is not
                owned or operated by Zwift.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-50">
                Do I have to pay for ZwiftTeams?
              </h3>
              <p className="mt-1 text-xs text-slate-300">
                No. The platform is free to use for both riders and
                teams.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-50">
                Do I need ZwiftPower / ZwiftRacing.com?
              </h3>
              <p className="mt-1 text-xs text-slate-300">
                Most competitive teams will ask for your ZwiftPower and/or
                ZwiftRacing.com profiles to verify your race results, category
                and race score. We recommend adding both links to your rider
                profile.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-50">
                Can I race for multiple teams?
              </h3>
              <p className="mt-1 text-xs text-slate-300">
                That depends on the league rules. Some leagues allow different
                teams in different formats (e.g. one for ZRL and one for TTT),
                others don&apos;t. Always check the rules and be transparent with
                the teams you talk to.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-50">
                I found a bug or have an idea – what now?
              </h3>
              <p className="mt-1 text-xs text-slate-300">
                Reach out to the project owner via Discord or any contact link
                provided on the site. Feedback from riders and team managers is
                super valuable to improve ZwiftTeams.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
