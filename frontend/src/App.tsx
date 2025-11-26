import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppHeader } from "./components/header";
import { AppFooter } from "./components/footer";
import Dashboard from "./pages/Dashboard";
import StatsPage from "./pages/StatsPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-300">
        <AppHeader />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/code/:code" element={<StatsPage />} />
          </Routes>
        </main>

        <AppFooter />
      </div>
    </BrowserRouter>
  );
}

export default App;
