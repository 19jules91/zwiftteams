// app/inbox/page.tsx
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import ChatThread from "@/components/ChatThread"

export default async function InboxPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  const userId = (session.user as any).id as string

  // Alle ContactRequests, an denen der User beteiligt ist
  const applications = await prisma.contactRequest.findMany({
    where: {
      OR: [
        { fromUserId: userId },        // als Rider gesendet
        { toUserId: userId },          // direkt adressiert
        { team: { ownerId: userId } }, // als Team-Owner
      ],
    },
    include: {
      fromUser: true,
      toUser: true,
      team: true,
      opening: true,
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-6 flex items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-slate-50">Inbox</h1>
            <p className="mt-1 text-xs text-slate-300">
              All applications and messages between riders and teams.
            </p>
          </div>
          <Link
            href="/openings"
            className="text-xs text-sky-300 hover:text-sky-200"
          >
            ← Back to openings
          </Link>
        </header>

        {applications.length === 0 ? (
          <p className="text-sm text-slate-300">
            No applications yet. Browse{" "}
            <Link href="/openings" className="text-sky-300 hover:text-sky-200">
              openings
            </Link>{" "}
            or set up your rider / team profile.
          </p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const isTeamOwner = app.team && app.team.ownerId === userId
              const isRider = app.fromUserId === userId

              const counterpartLabel = isTeamOwner
                ? app.fromUser?.name || "Rider"
                : app.team?.name || "Team"

              const roleLabel = isTeamOwner ? "Team owner" : isRider ? "Rider" : "Participant"

              // Last message preview
              const lastMessage =
                app.messages.length > 0
                  ? app.messages[app.messages.length - 1]
                  : null

              const lastTextRaw =
                (lastMessage && lastMessage.text) || app.message || ""

              const lastText =
                lastTextRaw.length > 80
                  ? lastTextRaw.slice(0, 77) + "..."
                  : lastTextRaw

              const lastActivityDate =
                lastMessage?.createdAt || app.createdAt

              const lastActivityLabel =
                lastActivityDate &&
                (lastActivityDate.toLocaleString?.() ??
                  lastActivityDate.toString())

              return (
                <section
                  key={app.id}
                  className="rounded-2xl border border-slate-700/70 bg-slate-900/95 p-4 shadow-lg"
                >
                  {/* Kopfzeile */}
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-full bg-slate-800 px-2 py-[2px] text-[10px] text-slate-200">
                          {roleLabel}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Conversation with{" "}
                          <span className="font-semibold text-slate-50">
                            {counterpartLabel}
                          </span>
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        {app.opening && (
                          <>
                            <span>Opening:</span>
                            <Link
                              href={`/openings/${app.openingId}`}
                              className="text-sky-300 hover:text-sky-200"
                            >
                              {app.opening.title}
                            </Link>
                          </>
                        )}
                      </div>

                      {/* Last message Preview */}
                      <div className="mt-1 text-[11px] text-slate-400">
                        {lastText ? (
                          <>
                            <span className="text-slate-500">
                              Last message:
                            </span>{" "}
                            <span className="text-slate-200">
                              {lastText}
                            </span>
                            {lastActivityLabel && (
                              <span className="text-slate-500">
                                {" "}
                                · {lastActivityLabel}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-slate-500">
                            No messages yet.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Chat-Verlauf + Eingabe */}
                  <div className="rounded-xl border border-slate-700/70 bg-slate-950/80 p-3 text-xs">
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                      Conversation
                    </div>

                    {/* initiale Bewerbungs-Nachricht separat anzeigen */}
                    {app.message && (
                      <div className="mb-2 flex justify-start">
                        <div className="max-w-[75%] rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-100">
                          <div className="mb-1 text-[10px] font-semibold text-slate-300">
                            {app.fromUser?.name || "Rider"}
                          </div>
                          <div>{app.message}</div>
                        </div>
                      </div>
                    )}

                    <ChatThread
                      contactRequestId={app.id}
                      currentUserId={userId}
                      initialMessages={app.messages.map((m) => ({
                        id: m.id,
                        text: m.text,
                        senderId: m.senderId,
                        senderName: m.sender?.name ?? null,
                      }))}
                      showEmptyHint={!app.message}
                    />
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
