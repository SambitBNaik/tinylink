import { Link } from "react-router-dom"

export  function AppHeader(){
    return(
        <header className="sticky top-0 z-10 border-b border-white/5 bg-slate-950/70 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                        TinyLink
                    </p>
                    <p className="text-lg font-semibold text-white">
                        Short Links. Real-time stats.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link 
                      to="/"
                      className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-white/40"
                      
                    >
                       Dashboard
                    </Link>
                    <Link
                    to="/"
                    //   to={`${process.env.NEXT_PUBLIC_API_URL}/healthz`}
                      className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-900 transition-shadow hover:bg-slate-200">
                        Health
                    </Link>
                </div>
            </div>
        </header>
    )
}