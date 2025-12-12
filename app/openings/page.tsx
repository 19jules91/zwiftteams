// app/openings/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BACKGROUNDS } from "@/lib/backgrounds";

type OpeningsPageProps = {
  searchParams: Promise<{
    league?: string;
    category?: string;
    sort?: string;
  }>;
};

export default async function OpeningsPage({ searchParams }: OpeningsPageProps) {
  const params = await searchParams;
  const league = params.league || "";
  const category = params.category || "";
  const sort = params.sort || "newest";

  // --- Daten aus der DB holen (nur nach League serverseitig filtern) ---
  const allOpenings = await prisma.teamOpening.findMany({
    where: league
      ? {
          league,
        }
      : {},
    include: { team: true },
    orderBy: {
      createdAt: "desc",
    },
  });

  // --- Category-Filter & Sortierung im JS anwenden ---
  let openings = allOpenings;

  if (category) {
    openings = openings.filter((o: any) => o.category === category);
  }

  if (sort === "oldest") {
    openings = [...openings].sort((a, b) =>
      a.createdAt.getTime() - b.createdAt.getTime()
    );
  } else if (sort === "team") {
    openings = [...openings].sort((a, b) => {
      const an = a.team?.name || "";
      const bn = b.team?.name || "";
      return an.localeCompare(bn);
    });
  } else {
    // newest (default) – ist bereits nach createdAt desc aus der DB
  }

  return (
    <main
      className="page-bg"
      style={{ backgroundImage: `url(${BACKGROUNDS.home})` }}
    >
      <div className="page-content mx-auto max-w-5xl px-4 py-8 text-slate-100">
        {/* Titel */}
        <h1 className="text-2xl font-bold mb-4 drop-shadow">
          Team openings
        </h1>

        {/* Filter-Bar als GET-Form */}
        <form
          method="GET"
          className="mb-6 flex flex-wrap gap-4 rounded-xl border border-slate-700/70 bg-slate-900/80 p-4 text-xs"
        >
          {/* League */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-300">League</label>
            <select
              name="league"
              defaultValue={league}
              className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs"
            >
              <option value="">All</option>
              <option value="ZRL">ZRL</option>
              <option value="WTRL_TTT">WTRL TTT</option>
              <option value="Club Ladder">Club Ladder</option>
              <option value="Workout">Workout</option>
              <option value="Grouprides">Grouprides</option>
              <option value="Female only">Female only</option>
            </select>
          </div>

          {/* Category (nur clientseitiger Filter) */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-300">Category</label>
            <select
              name="category"
              defaultValue={category}
              className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs"
            >
              <option value="">All</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-300">Sort</label>
            <select
              name="sort"
              defaultValue={sort}
              className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="team">Team name</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="rounded-md bg-sky-500 px-3 py-1 text-[11px] font-semibold text-sky-950 hover:bg-sky-400"
            >
              Apply filters
            </button>
          </div>
        </form>

        {/* Openings Grid */}
        {openings.length === 0 ? (
          <p className="text-sm text-slate-100/80">
            No openings found with the current filters.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {openings.map((opening: any) => (
              <article
                key={opening.id}
                className="rounded-xl border border-slate-700/70 bg-slate-900/85 p-4 text-xs text-slate-100 shadow-sm backdrop-blur-sm"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-300">
                      {opening.team?.name || "Unknown team"}
                    </p>
                    <h2 className="truncate text-sm font-semibold text-slate-50">
                      {opening.title}
                    </h2>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {opening.category && (
                      <span className="rounded-full bg-slate-800 px-2 py-[2px] text-[10px] font-semibold uppercase text-slate-100">
                        Cat {opening.category}
                      </span>
                    )}
                    {opening.league && (
                      <span className="rounded-full bg-slate-800 px-2 py-[2px] text-[10px] uppercase tracking-wide text-slate-100">
                        {opening.league}
                      </span>
                    )}
                  </div>
                </div>

                {/* Meta */}
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-200">
                  {opening.timezone && (
                    <span className="rounded-md bg-slate-800 px-2 py-[2px] text-[10px] text-slate-100">
                      {opening.timezone}
                    </span>
                  )}
                  {opening.days && opening.days.length > 0 && (
                    <span className="rounded-md bg-slate-800 px-2 py-[2px] text-[10px] text-slate-100">
                      {opening.days.join(", ")}
                    </span>
                  )}
                </div>

                {/* Description */}
                {opening.description && (
                  <p className="mt-2 line-clamp-3 text-[11px] text-slate-200/90">
                    {opening.description}
                  </p>
                )}

                {/* Footer Links */}
                <div className="mt-3 flex items-center justify-between gap-2 text-[11px]">
                  <Link
                    href={`/openings/${opening.id}`}
                    className="text-sky-300 hover:text-sky-200"
                  >
                    View opening →
                  </Link>
                  {opening.teamId && (
                    <Link
                      href={`/teams/${opening.teamId}`}
                      className="text-emerald-300 hover:text-emerald-200"
                    >
                      View team →
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
