import { Component } from 'react';
import { buttonStyles } from '../../utils/buttonStyles';

// Catches render errors anywhere below it and shows a friendly, on-brand
// fallback instead of a blank screen. Must be a class component: React has no
// hook equivalent for componentDidCatch / getDerivedStateFromError.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Keep the error visible for observability while the UI degrades gracefully.
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
          <div className="max-w-md w-full text-center bg-white rounded-card shadow-card p-8">
            <i className="fas fa-exclamation-circle text-gold-500 text-5xl mb-4" aria-hidden="true"></i>
            <h1 className="text-2xl font-serif font-bold tracking-tight text-navy-900 mb-3">
              Algo salió mal
            </h1>
            <p className="text-navy-600 mb-6">
              Tuvimos un problema al mostrar esta página. Recargá para intentarlo de nuevo.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className={buttonStyles({ variant: 'primary' })}
            >
              <i className="fas fa-redo" aria-hidden="true"></i>
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
