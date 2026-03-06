import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-carbon p-4">
          <div className="max-w-md rounded-xl border border-border/70 bg-card/90 p-8 text-center">
            <h1 className="mb-2 font-racing text-xl font-bold tracking-wide text-foreground">
              Something went wrong
            </h1>
            <p className="mb-4 text-sm text-muted-foreground">
              This page hit an error. Try reloading.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
