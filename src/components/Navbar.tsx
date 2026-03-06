import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const baseLinkClasses =
    "relative text-[0.6rem] sm:text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors " +
    "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:rounded-full after:bg-primary after:opacity-0 after:transition-opacity";
  const activeLinkClasses = "text-foreground after:opacity-100";

  const linkClassName = ({ isActive }: { isActive: boolean }) =>
    [baseLinkClasses, isActive ? activeLinkClasses : ""].join(" ").trim();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <nav className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-4">
        <NavLink to="/" className="flex items-center gap-2">
          <img src="/f1-logo.png" alt="F1" className="f1-logo-transparent h-8 w-auto object-contain sm:h-9" />
          {/* Short wordmark on very small screens, full title from sm+ */}
          <span className="font-f1 text-[0.7rem] tracking-[0.25em] text-gradient-red sm:hidden">
            F1 DELHI NCR
          </span>
          <span className="hidden font-f1 text-xs tracking-[0.2em] text-gradient-red sm:inline-block sm:text-sm">
            F1 DELHI NCR COMMUNITY FANTASY
          </span>
        </NavLink>

        <div className="flex items-center gap-3 sm:gap-6">
          <NavLink to="/" className={linkClassName}>
            Home
          </NavLink>
          <NavLink to="/my-team" className={linkClassName}>
            My Team
          </NavLink>
          <NavLink to="/leaderboard" className={linkClassName}>
            Leaderboard
          </NavLink>
          <NavLink to="/schedule" className={linkClassName}>
            Schedule
          </NavLink>
          {!loading && user && (
            <NavLink to="/profile" className={linkClassName}>
              Profile
            </NavLink>
          )}
          {!loading && (
            user ? (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
                onClick={() => signOut().then(() => navigate("/"))}
              >
                Log out
              </Button>
            ) : (
              <NavLink to="/login" className={linkClassName}>
                Log in
              </NavLink>
            )
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
