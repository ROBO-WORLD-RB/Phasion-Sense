'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    // Check if error matches our structured custom API client error shape
    const msg = error?.message || 'An unhandled layout thread exception occurred.';
    return { hasError: true, errorMessage: msg };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Critical Layout Boundary caught failure context:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full p-8 my-4 bg-[#16161e] border border-red-950 text-center font-mono text-xs">
          <h4 className="text-red-400 font-semibold uppercase tracking-widest mb-2">Component Level Exception Caught</h4>
          <p className="text-[#a1a1aa] mb-4 text-[11px]">{this.state.errorMessage}</p>
          <button
            onClick={() => this.setState({ hasError: false, errorMessage: '' })}
            className="px-4 py-2 bg-[#27272a] text-[#f4f4f5] uppercase tracking-widest font-sans text-[10px] font-bold hover:bg-[#f4f4f5] hover:text-[#09090b] transition-colors"
          >
            Reset Component state
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
