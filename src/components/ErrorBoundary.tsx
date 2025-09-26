/** @jsxImportSource react */
import React, { Component, ReactNode } from "react"
import styles from "./ErrorBoundary.module.css"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * React Error Boundary component for graceful error handling
 * Catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details
    console.error("ErrorBoundary caught an error:", error, errorInfo)

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className={styles.errorBoundary}>
          <div className={styles.errorContent}>
            <h2>🚨 Something went wrong</h2>
            <p>We encountered an unexpected error. This has been logged and we'll look into it.</p>

            {this.state.error && (
              <details className={styles.errorDetails}>
                <summary>Error Details</summary>
                <pre className={styles.errorMessage}>{this.state.error.message}</pre>
                <pre className={styles.errorStack}>{this.state.error.stack}</pre>
              </details>
            )}

            <div className={styles.errorActions}>
              <button onClick={this.handleRetry} className={styles.retryButton}>
                Try Again
              </button>
              <button onClick={() => window.location.reload()} className={styles.refreshButton}>
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Higher-order component for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}

/**
 * Specialized Error Boundary for wallet operations
 * Provides wallet-specific error messages and recovery options
 */
export function WalletErrorBoundary({
  children,
  onError,
}: {
  children: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}) {
  const walletFallback = (
    <div className={styles.errorBoundary}>
      <div className={styles.errorContent}>
        <h2>🔌 Wallet Connection Error</h2>
        <p>We encountered an issue with your wallet connection.</p>

        <div className={styles.walletTroubleshooting}>
          <h3>Troubleshooting Steps:</h3>
          <ol>
            <li>Check if your wallet extension is installed and unlocked</li>
            <li>Refresh the page and try connecting again</li>
            <li>Try switching to a different network and back</li>
            <li>Restart your browser if the issue persists</li>
          </ol>
        </div>

        <div className={styles.errorActions}>
          <button onClick={() => window.location.reload()} className={styles.refreshButton}>
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <ErrorBoundary fallback={walletFallback} onError={onError}>
      {children}
    </ErrorBoundary>
  )
}
