import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    try {
      const crashCount = parseInt(sessionStorage.getItem("crash_count") || "0", 10);
      if (crashCount < 2) {
        sessionStorage.setItem("crash_count", (crashCount + 1).toString());
        const lastWorking = sessionStorage.getItem("last_working_page") || "/";
        
        // If last working page is the current page, redirect to home to prevent loops
        if (lastWorking === window.location.pathname) {
          sessionStorage.setItem("last_working_page", "/");
          window.location.href = "/";
        } else {
          window.location.href = lastWorking;
        }
      }
    } catch {
      // ignore
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-carbon p-4 text-foreground">
          <div className="w-full max-w-md rounded-xl border border-primary/30 bg-card/90 p-8 text-center shadow-[0_0_20px_rgba(225,6,0,0.15)] relative overflow-hidden">
            {/* Red accent bar typical in F1 design */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 to-orange-500" />
            
            {/* Custom F1 warning logo style */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-950/40 border border-primary/40">
              <span className="font-racing text-3xl font-bold text-primary">!</span>
            </div>

            <h1 className="mb-2 font-racing text-2xl font-bold tracking-widest text-gradient-red uppercase">
              Engine Blowout!
            </h1>
            <p className="mb-6 text-sm text-muted-foreground font-medium">
              We've hit a technical issue on this page. To get back in the race, click below.
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  sessionStorage.setItem("crash_count", "0");
                  sessionStorage.setItem("last_working_page", "/");
                  window.location.href = "/";
                }}
                className="w-full rounded-md bg-primary py-2.5 text-sm font-racing uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/90 transition-all font-bold"
              >
                Return to Pits (Home)
              </button>
              <button
                type="button"
                onClick={() => {
                  sessionStorage.setItem("crash_count", "0");
                  window.location.reload();
                }}
                className="w-full rounded-md border border-border bg-background/50 py-2.5 text-sm font-racing uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all"
              >
                Retry Lap (Reload)
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
