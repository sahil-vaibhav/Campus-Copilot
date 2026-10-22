import React, { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertCircle, RefreshCw, Home } from "lucide-react"
import { Button } from "./ui/Button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught an unhandled exception:", error, errorInfo)
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = "/"
  }

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background text-foreground">
          <div className="max-w-md w-full rounded-2xl border bg-card p-6 shadow-xl text-center space-y-5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertCircle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold tracking-tight">Something went wrong</h1>
              <p className="text-sm text-muted-foreground">
                An unexpected error occurred while loading this page. Our campus systems have logged this incident.
              </p>
            </div>

            {import.meta.env.DEV && this.state.error?.message && (
              <div className="rounded-lg bg-muted p-3 text-left font-mono text-xs text-muted-foreground overflow-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                className="gap-2"
                onClick={this.handleGoHome}
              >
                <Home className="h-4 w-4" />
                Go to Home
              </Button>
              <Button
                className="gap-2"
                onClick={this.handleReset}
              >
                <RefreshCw className="h-4 w-4" />
                Reload Application
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
