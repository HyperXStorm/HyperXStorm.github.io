import { Link, useLocation } from "react-router-dom";
import { HOME } from "@/constants/testIds";

export default function Navbar() {
  const loc = useLocation();
  const onAdmin = loc.pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#F7F5F0]/80 border-b border-[#E2DFD8]/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
        <Link
          to="/"
          data-testid={HOME.navLogo}
          className="flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-full bg-[#3E533B] text-[#F7F5F0] grid place-items-center font-serif-display text-xl leading-none">
            अ
          </div>
          <div className="leading-tight">
            <div className="font-serif-display text-xl text-[#243021] tracking-tight">
              Aham Arogyam
            </div>
            <div className="text-[10px] tracking-[0.25em] uppercase text-[#8A7965] -mt-0.5">
              TCM · Five Element Clinic
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-6 text-sm">
          <Link
            to="/quiz"
            className="hidden sm:inline text-[#4A4846] hover:text-[#3E533B] transition-colors"
          >
            Take the Quiz
          </Link>
          <Link
            to={onAdmin ? "/" : "/admin"}
            data-testid={HOME.navAdminLink}
            className="text-[#4A4846] hover:text-[#3E533B] transition-colors px-3 py-1.5 rounded-full border border-transparent hover:border-[#E2DFD8]"
          >
            {onAdmin ? "Back to Site" : "Clinic Admin"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
