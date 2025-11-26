import { useLinkStore } from "../store/linkStore";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

interface LinkFromProps {
  onLinkCreated?: () => void
}

export function LinkForm({ onLinkCreated }: LinkFromProps) {
  const [state, setState] = useState({
    targetUrl: "",
    code: "",
    error: null,
    success: "",
    isSubmitting: false
  })
  // const [displayBase, setDisplayBase] = useState(
  //   import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "",);
  const { createLink } = useLinkStore();

  const displayBase = import.meta.env.VITE_API_URL?.replace(/\/$/, "")
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, error: null, success: "", isSubmitting: true }));
    const payload = {
      target_url: state.targetUrl,
      code: state.code
    }
    try {
      const res = await createLink(payload);
      setState({ targetUrl: "", code: "", error: null, success: "Linked created successfully.", isSubmitting: false });
      if (res && onLinkCreated) {
        onLinkCreated();
      }
      setTimeout(() => setState(prev => ({ ...prev, success: "" })), 5000);
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: err?.response?.data?.error || "Failed to create link"
      }))
    }
  }
  return (
    <section className="card space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
          Create
        </p>
        <h2 className="text-2xl font-semibold text-white">Shorten a link</h2>
        <p className="mt-2 text-sm text-slate-400">
          Paste your long URL, optionally pick a custom code, and we&apos;ll
          handle the rest.
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-white">Destination URL</span>
          <input
            type="url"
            name="targetUrl"
            value={state.targetUrl}
            onChange={(e) => setState((prev) => ({ ...prev, targetUrl: e.target.value }))}
            placeholder="https://example.com/docs"
            className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-white/40 focus:outline"
            required
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-white">Custom code</span>
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 focus-within:border-white/40">
            <span className="text-sm text-slate-500">
              {(displayBase || "").replace(/^http?:\/\//, "")}/
            </span>
            <input
              type="text"
              name="code"
              value={state.code}
              onChange={(e) => setState(prev => ({ ...prev, code: e.target.value }))}
              placeholder="e.g docs123"
              pattern="[A-Za-z0-9]{6,8}"
              className="flex-1 bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
            />
            <span className="text-xs text-slate-500">6-8 chars</span>
          </div>
        </label>
        {state.error && (
          <p className="text-sm text-red-300">{state.error}</p>
        )}
        {state.success && (
          <p className="text-sm text-emerald-300">{state.success}</p>
        )}
        <button
          type="submit"
          disabled={state.isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {
            state.isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Shortening...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Shorten URL
              </>
            )
          }
        </button>
      </form>
    </section>
  );
}