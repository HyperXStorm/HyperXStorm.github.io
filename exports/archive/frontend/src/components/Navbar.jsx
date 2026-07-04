import { Link, useLocation } from "react-router-dom";
import { HOME } from "@/constants/testIds";

export default function Navbar() {
  const loc = useLocation();
  const onAdmin = loc.pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#F5EDDF]/85 border-b border-[#1F3A2E]/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
        <Link to="/" data-testid={HOME.navLogo} className="leading-tight">
          <div className="font-serif-display text-2xl text-[#1F3A2E] tracking-tight">
            Aham Arogyam
          </div>
          <div className="text-[10px] tracking-[0.32em] uppercase text-[#B68B47] mt-1">
            I am health
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-6 text-sm">
          <Link to="/" className="hidden sm:inline text-[#2C2A29] hover:text-[#B68B47] transition-colors">
            Home
          </Link>
          <Link
            to={onAdmin ? "/" : "/admin"}
            data-testid={HOME.navAdminLink}
            className="text-[#2C2A29] hover:text-[#B68B47] transition-colors px-3 py-1.5 rounded-full border border-transparent hover:border-[#B68B47]/40"
          >
            {onAdmin ? "Back to Site" : "Clinic Admin"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
