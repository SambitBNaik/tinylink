import { LinkDashboard } from "../components/link-dashboard";


export default function Dashboard() {
    return (
        <div className="bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
            <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
                <section className="card relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                        <p className="text-xs uppercase tracking:[0.5em] text-emerald-300">
                            TinyLink
                        </p>
                        <p className="text-4xl font-bold text-white sm:text-5xl">
                            Shorten URLs. Track every click.
                        </p>
                        <p className="max-w-2xl text-lg text-slate-300">
                            Create branded short links, monitor engagement in real-time, and manage
                            your portfolio from a single, responsive dashboard.
                        </p>
                    </div>
                    <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-blue-500/10" />
                </section>
                <LinkDashboard />
            </main>
        </div>
    );
}