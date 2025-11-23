"use client";
import { useLinkStore } from "@/app/store/linkStore";
import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect } from "react";

export default function CodeStatsPage() {
  const params = useParams();
  const code = params.code as string;
  const { selectedLink, fetchLinkStats, loading, error ,redirectTotarget} = useLinkStore();
  useEffect(() => {
      fetchLinkStats(code);
  }, [code]);

 
    // Still loading? Show a loader
  if (loading || !selectedLink) {
    return (
      <div className="mx-auto max-w-4xl p-10 text-center text-white">
        Loading stats...
      </div>
    );
  }

   if (!loading && !selectedLink) {
    notFound();
  }


  const formattedLastClicked = selectedLink.last_clicked
    ? formatDistanceToNow(new Date(selectedLink.last_clicked), {
        addSuffix: true,
      })
    : "Never";

  const createdAt = selectedLink.created_at
    ? format(new Date(selectedLink.created_at), "PPpp")
    : "Unknown";

  const shortBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
  console.log("Selected link", selectedLink);
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.5em] text-emerald-300">
            Stats
        </p>
        <h1 className="text-4xl font-bold text-white">{selectedLink.code}</h1>
        <p>
            Created on {createdAt} · Last clicked: {formattedLastClicked}
        </p>
      </div>
      <section className="card mt-8 space-y-6">
        <div>
            <p className="text-sm font-medium text-white">Destination</p>
            <a
            href={selectedLink.target_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 font-mono text-sm text-emerald-300 underline decoration-dotted break-all"
          >
            {selectedLink.target_url}
          </a>
        </div>
         <dl className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <dt className="text-xs uppercase tracking-wide text-slate-400">
              Total clicks
            </dt>
            <dd className="text-3xl font-semibold text-white">{selectedLink.clicks}</dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <dt className="text-xs uppercase tracking-wide text-slate-400">
              Last clicked
            </dt>
            <dd className="text-lg font-semibold text-white">{formattedLastClicked}</dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <dt className="text-xs uppercase tracking-wide text-slate-400">
              Short URL
            </dt>
            <dd className="text-sm font-mono text-emerald-300 break-all">
              {shortBase ? `${shortBase}/${selectedLink.code}` : `/${selectedLink.code}`}
            </dd>
          </div>
        </dl>

         <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:border-white/40"
          >
            Back to dashboard
          </Link>
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/${selectedLink.code}`}
            // onClick={()=>redirectTotarget(selectedLink.code)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Test redirect
          </a>
        </div>
      </section>
    </div>
  );
}
