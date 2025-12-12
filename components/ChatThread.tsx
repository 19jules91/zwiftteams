"use client"

import { useEffect, useRef, useState } from "react"

type ClientMessage = {
  id: string
  text: string
  senderId: string
  senderName: string | null
}

type ChatThreadProps = {
  contactRequestId: string
  currentUserId: string
  initialMessages: ClientMessage[]
  showEmptyHint?: boolean
}

export default function ChatThread({
  contactRequestId,
  currentUserId,
  initialMessages,
  showEmptyHint = true,
}: ChatThreadProps) {
  const [messages, setMessages] = useState<ClientMessage[]>(initialMessages)
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)

  const [otherOnline, setOtherOnline] = useState(false)
  const [otherTyping, setOtherTyping] = useState(false)
  const [lastSeenByOtherId, setLastSeenByOtherId] = useState<string | null>(
    null
  )

  const bottomRef = useRef<HTMLDivElement | null>(null)

  // Immer zum neuesten Message-Ende scrollen
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  // Polling alle 3 Sekunden – Messages + Meta (online, typing, seen)
  useEffect(() => {
    let cancelled = false

    async function loadMessages() {
      try {
        const res = await fetch(
          `/api/messages?contactRequestId=${contactRequestId}`,
          {
            cache: "no-store",
          }
        )
        if (!res.ok) return
        const data = await res.json()
        if (cancelled) return

        if (Array.isArray(data.messages)) {
          setMessages(
            data.messages as ClientMessage[]
          )
        }
        if (typeof data.otherOnline === "boolean") {
          setOtherOnline(data.otherOnline)
        }
        if (typeof data.otherIsTyping === "boolean") {
          setOtherTyping(data.otherIsTyping)
        }
        if (typeof data.lastSeenByOtherId === "string") {
          setLastSeenByOtherId(data.lastSeenByOtherId)
        } else if (data.lastSeenByOtherId === null) {
          setLastSeenByOtherId(null)
        }
      } catch {
        // ignore
      }
    }

    loadMessages()
    const id = setInterval(loadMessages, 3000)

    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [contactRequestId])

  // Tippen-Indikator: bei Eingabe alle ~300ms "ich tippe" melden
  useEffect(() => {
    if (!input.trim()) return

    let cancelled = false
    const timeout = setTimeout(async () => {
      if (cancelled) return
      const formData = new FormData()
      formData.append("contactRequestId", contactRequestId)
      try {
        await fetch("/api/typing", {
          method: "POST",
          body: formData,
        })
      } catch {
        // ignore
      }
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [input, contactRequestId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return

    setSending(true)
    try {
      const formData = new FormData()
      formData.append("contactRequestId", contactRequestId)
      formData.append("text", text)

      const res = await fetch("/api/messages", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        setInput("")
        // neue Messages kommen über Polling
      }
    } catch {
      // ignore
    } finally {
      setSending(false)
    }
  }

  // letzte eigene Nachricht
  const lastOwnMessage = [...messages]
    .reverse()
    .find((m) => m.senderId === currentUserId)

  const showSeen =
    lastOwnMessage && lastSeenByOtherId === lastOwnMessage.id

  return (
    <div>
      {/* Status-Zeile: Online + tippt */}
      <div className="mb-2 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1">
          <span
            className={`h-2 w-2 rounded-full ${
              otherOnline ? "bg-emerald-400" : "bg-slate-600"
            }`}
          />
          {otherOnline ? (
            <span className="text-emerald-300">Online</span>
          ) : (
            <span className="text-slate-500">Offline</span>
          )}
        </div>
        {otherTyping && (
          <span className="italic text-slate-300">Typing…</span>
        )}
      </div>

      {/* Chat Verlauf */}
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
        {messages.length === 0 && showEmptyHint && (
          <p className="text-[11px] text-slate-500">
            No messages yet. Start the conversation below.
          </p>
        )}

        {messages.map((msg) => {
          const isOwn = msg.senderId === currentUserId
          const senderName =
            msg.senderName || (isOwn ? "You" : "Rider / Team")

          return (
            <div
              key={msg.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 text-xs ${
                  isOwn
                    ? "bg-sky-500 text-sky-950"
                    : "bg-slate-800 text-slate-100"
                }`}
              >
                <div className="mb-1 text-[10px] font-semibold text-slate-200/80">
                  {senderName}
                </div>
                <div>{msg.text}</div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Seen-Indicator unter dem Verlauf */}
      {showSeen && (
        <div className="mt-1 text-right text-[10px] text-slate-400">
          Seen
        </div>
      )}

      {/* Eingabefeld */}
      <form onSubmit={handleSubmit} className="mt-3 space-y-2">
        <textarea
          name="text"
          rows={2}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-100 placeholder:text-slate-500"
          placeholder="Write a message to continue the conversation..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center rounded-md bg-sky-500 px-3 py-1.5 text-[11px] font-semibold text-sky-950 hover:bg-sky-400 disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send message"}
          </button>
        </div>
      </form>
    </div>
  )
}
