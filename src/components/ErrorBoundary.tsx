import React, { Component } from 'react';
import type { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ff4444',
          background: '#101419',
          padding: '24px',
          textAlign: 'center'
        }}>
          <h2>Failed to load the 3D Model</h2>
          <p style={{ color: '#8b95a5', marginTop: '12px' }}>
            {this.state.error?.message || 'Network error or invalid 3D model file.'}
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            style={{
              marginTop: '24px',
              padding: '12px 24px',
              background: 'var(--panel-bg)',
              border: '1px solid var(--panel-border)',
              color: 'var(--text-main)',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
