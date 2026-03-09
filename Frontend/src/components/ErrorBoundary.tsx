import React, { type ErrorInfo, type ReactNode } from "react"

type Props = {
  children: ReactNode
  fallback: ReactNode
  className?: string
}

type State = {
  hasError: boolean
}

class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.log(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={this.props.className}>
          {this.props.fallback}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary