import { Component } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Aap yahan error reporting service ko bhi error bhej sakte hain
    this.setState({
      error,
      errorInfo,
    });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    // Error reset karne ke liye
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI jo user ko dikhega agar app crash hoti hai
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
          <Card className="max-w-md text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-error mb-4">Something went wrong</h2>
            <p className="text-gray-400 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className="space-y-2">
              <Button onClick={this.handleReset} className="w-full" size="lg">
                Try Again
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Go Home
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    // Agar sab sahi hai toh children components render karein
    return this.props.children;
  }
}

export default ErrorBoundary;