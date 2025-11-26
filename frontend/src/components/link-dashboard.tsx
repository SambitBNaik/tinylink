import {
  Copy,
  ExternalLink,
  Loader2,
  RefreshCcw,
  Search,
  Trash2,
} from "lucide-react";
import { useLinkStore } from "../store/linkStore";
import { useEffect, useState, useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import type { Linki } from "../types/link";
import { LinkForm } from "./link-form";

const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
const formatUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.hostname + parsed.pathname + (parsed.search ?? "");
  } catch (error) {
    return url;
  }
};

const copyToClipboard = async (value: string) => {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return false;
  }
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
};

// type BannerState = { text: string; tone: "success" | "error" } | null;
export function LinkDashboard() {
  const { loading, error, links, fetchLinks } =
    useLinkStore();
  const [filteredLinks, setFilteredLinks] = useState<Linki[]>([]);
//   const [banner, setBanner] = useState<BannerState>(null);
  const [isCopying, startCopyTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);     

  useEffect(() => {
    setFilteredLinks(links);
  }, [links]);

  const handleCopy = async (shortUrl: string, code: string) => {
    const success = await copyToClipboard(shortUrl);
    if (success) {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
    startCopyTransition(() => {
    //   setBanner({
    //     text: success
    //       ? "Short link copied to clipboard"
    //       : "Unable to copy link.",
    //     tone: success ? "success" : "error",
    //   });
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredLinks(links);
      return;
    }
    const filtered = filteredLinks.filter((link) => {
      const formatted = formatUrl(link.target_url).toLowerCase();
      return (
        link.code.toLowerCase().includes(query.toLowerCase()) ||
        link.target_url.toLowerCase().includes(query.toLowerCase()) ||
        formatted.includes(query.toLowerCase())
      );
    });
    setFilteredLinks(filtered);
  };

  const shortUrlFor = (code: string) => {
    if (baseUrl) {
      return `${baseUrl}/${code}`;
    }
    if (typeof window !== "undefined") {
      return `${window.location.origin}/${code}`;
    }
    return `/${code}`;
  };

  const handleLinkCreate = () => {
    fetchLinks();
  };

  const handleDelete = async (code: string) => {
    const confirmDelete = confirm(`Are you sure you want to delete "${code}"?`);
    if (!confirmDelete) return;
    try {
      await useLinkStore.getState().deleteLink(code);
    //   setBanner({
    //     text: `Link "${code}" deleted successfully.`,
    //     tone: "success",
    //   });
    } catch (err) {
    //   setBanner({
    //     text: "Failed to delete link.",
    //     tone: "error",
    //   });
    }
  };
  return (
    <div className="space-y-8">
      <LinkForm onLinkCreated={handleLinkCreate} />
      <section className="card space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
              Dashboard
            </p>
            <h2 className="text-2xl font-semibold text-white">
              Your short links
            </h2>
          </div>
          <button
            onClick={() => fetchLinks()}
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-white/40"
          >
            <RefreshCcw className="size-4" />
            Refresh
          </button>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400 focus-within:border-white/40 focus-within:text-white">
            <Search className="size-4" />
            <input
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Filter by code or url"
              className="flex-1 bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
            />
          </label>
          <p className="text-xs text-slate-500">
            Showing {filteredLinks.length} of {links.length} links
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10">
         <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead>
              <tr className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Target URL</th>
                <th className="px-4 py-3 text-right">Clicks</th>
                <th className="px-4 py-3">Last clicked</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-16 text-center text-slate-400"
                  >
                    <Loader2 className="mx-auto mb-3 size-6 animate-spin text-white" />
                    Loading Links...
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-red-300"
                  >
                    Failed to load links. Please try again.
                  </td>
                </tr>
              )}
              {!loading && filteredLinks.length === 0 && !error && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-slate-400"
                  >
                    No links found.Create your first link above.
                  </td>
                </tr>
              )}
              {filteredLinks.map((link, index) => {
                const shortUrl = shortUrlFor(link.code);
                return (
                  <tr key={index} className="text-slate-200">
                    <td className="px-4 py-3 font-mono text-sm text-white">
                      <a
                        href={`${import.meta.env.VITE_API_URL}/${link.code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.code}
                      </a>
                    </td>
                    <td className="px-4 py-3 max-w-[240px] truncate text-slate-400">
                      <span title={link.target_url}>
                        {formatUrl(link.target_url)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {link.clicks}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      {link.last_clicked
                        ? formatDistanceToNow(new Date(link.last_clicked), {
                            addSuffix: true,
                          })
                        : "Never"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <div className="relative">
                          {copiedCode === link.code && (
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 rounded-md bg-emerald-500 px-2 py-1 text-[10px] font-semibold text-black whitespace-nowrap z-10">
                              Copied!
                            </div>
                          )}
                          <button
                            type="button"
                            className="rounded-full border border-white/10 px-3 py-1 text-xs text-white transition hover:border-white/40"
                            onClick={() => handleCopy(shortUrl, link.code)}
                            disabled={isCopying}
                          >
                            <Copy className="mr-1 inline size-3.5" />
                            Copy
                          </button>
                        </div>
                        <Link
                          to={`/code/${link.code}`}
                          className="rounded-full border border-white/10 px-3 py-1 text-xs text-white transition hover:border-white/40"
                        >
                          <ExternalLink className="mr-1 inline size-3.5" />
                          Stats
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(link.code)}
                          className="rounded-full border border-red-500/30 px-3 py-1 text-xs text-red-300 transition hover:border-red-500/70"
                        >
                          <Trash2 className="mr-1 inline size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
         </div>
        </div>
      </section>
    </div>
  );
}
