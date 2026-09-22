import { Component, type ErrorInfo, type ReactNode } from 'react'
import Button from '../Button/Button'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled render error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="section flex min-h-svh flex-col items-center justify-center gap-4 px-section-x text-center">
          <h2 className="font-display text-h2 text-ink">Something went wrong</h2>
          <p className="max-w-[32rem] text-body text-text-body">
            We hit an unexpected error. Please refresh the page, or try again in a moment.
          </p>
          <Button variant="dark" label="Refresh Page" icon="none" onClick={() => window.location.reload()} />
        </section>
      )
    }

    return this.props.children
  }
}
