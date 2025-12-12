import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  const user = session.user

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-xl px-4 py-12">
        <h1 className="text-2xl font-bold">My account</h1>
        <p className="mt-2 text-sm text-slate-600">
          You are logged in with Discord.
        </p>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm">
            <span className="font-semibold">Name:</span>{" "}
            {user?.name ?? "No name from Discord"}
          </p>
          <p className="mt-1 text-sm">
            <span className="font-semibold">Email:</span>{" "}
            {user?.email ?? "No email available"}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/onboarding/rider"
            className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Create / edit rider profile
          </Link>

          <Link
            href="/onboarding/team"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Create / edit team profile
          </Link>

          <Link
            href="/api/auth/signout"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            Sign out
          </Link>

  <Link
    href="/account/team-applications"
    className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
  >
    View team applications
  </Link>



          <Link
  href="/onboarding/team-openings"
  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
>
  Manage team openings
</Link>

        </div>
      </div>
    </main>
  )
}
