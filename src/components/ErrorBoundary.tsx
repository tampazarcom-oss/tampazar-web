/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("TamPazar Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white font-sans">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/20">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-black text-white">Bir şeyler ters gitti ama endişelenmeyin</h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                TamPazar sistem koruma kalkanı beklenmeyen bir hatayı yakaladı. Verileriniz ve esnaf kasalarınız güvendedir.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => window.location.href = '/'}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Home className="w-4 h-4" />
                Ana Sayfaya Dön (Vitrin)
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
              >
                <RefreshCw className="w-4 h-4" />
                Sayfayı Yenile
              </button>
            </div>

            <div className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800">
              tampazar.com · Açık Dijital AVM İşletim Sistemi
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
