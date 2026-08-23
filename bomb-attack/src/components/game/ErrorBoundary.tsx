'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
  showDetails?: boolean;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }
  
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
    
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    this.props.onReset?.();
  };
  
  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="min-h-[200px] flex items-center justify-center p-8 bg-slate-900 rounded-lg border border-red-500/50">
          <div className="text-center max-w-md">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-white mb-2">Algo deu errado</h2>
            <p className="text-slate-400 mb-4">
              Ocorreu um erro inesperado. Tente novamente ou volte para a página anterior.
            </p>
            
            {this.props.showDetails && this.state.error && (
              <details className="mb-4 text-left">
                <summary className="text-sm text-slate-500 cursor-pointer hover:text-slate-300">
                  Detalhes do erro
                </summary>
                <pre className="mt-2 p-3 bg-slate-800 rounded text-xs text-red-400 overflow-auto">
                  {this.state.error.message}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
              >
                Tentar Novamente
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Recarregar Página
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

export default ErrorBoundary;
