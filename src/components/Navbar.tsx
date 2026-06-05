import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const baseLinkClasses =
    "relative block py-2 text-[0.6rem] sm:text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors min-h-[44px] flex items-center " +
    "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:rounded-full after:bg-primary after:opacity-0 after:transition-opacity";
  const activeLinkClasses = "text-foreground after:opacity-100";

  const linkClassName = ({ isActive }: { isActive: boolean }) =>
    [baseLinkClasses, isActive ? activeLinkClasses : ""].join(" ").trim();

  const navLinks = (
    <>
      <NavLink to="/" className={linkClassName} onClick={() => setMobileOpen(false)}>
        Home
      </NavLink>
      <NavLink to="/my-team" className={linkClassName} onClick={() => setMobileOpen(false)}>
        My Team
      </NavLink>
      <NavLink to="/leaderboard" className={linkClassName} onClick={() => setMobileOpen(false)}>
        Leaderboard
      </NavLink>
      <NavLink to="/schedule" className={linkClassName} onClick={() => setMobileOpen(false)}>
        Schedule
      </NavLink>
      {user ? (
        <>
          <NavLink to="/profile" className={linkClassName} onClick={() => setMobileOpen(false)}>
            Profile
          </NavLink>
          <Button
            variant="ghost"
            size="sm"
            className="min-h-[44px] w-full justify-start text-left text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground sm:w-auto sm:min-h-0"
            onClick={() => signOut().then(() => { setMobileOpen(false); navigate("/"); })}
          >
            Log out
          </Button>
        </>
      ) : (
        <NavLink to="/login" className={linkClassName} onClick={() => setMobileOpen(false)}>
          Log in
        </NavLink>
      )}
    </>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl safe-area-inset-top">
      <nav className="container mx-auto flex h-14 min-h-[56px] sm:h-16 items-center justify-between px-3 sm:px-4">
        <NavLink to="/" className="flex min-h-[44px] items-center gap-2 py-2" onClick={() => setMobileOpen(false)}>
          <img src="/f1-logo.png" alt="F1" className="f1-logo-transparent h-8 w-auto object-contain sm:h-9" />
          <span className="font-f1 text-[0.7rem] tracking-[0.25em] text-gradient-red sm:hidden">
            F1 DELHI NCR
          </span>
          <span className="hidden font-f1 text-xs tracking-[0.2em] text-gradient-red sm:inline-block sm:text-sm">
            F1 DELHI NCR COMMUNITY FANTASY
          </span>
        </NavLink>

        {/* Desktop nav */}
        <div className="hidden items-center gap-3 md:flex md:gap-6">
          {navLinks}
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="min-h-[44px] min-w-[44px] md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
