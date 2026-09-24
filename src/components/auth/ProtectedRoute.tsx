/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, LayoutDashboard, LogOut, Lock, UserCheck } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectPath?: string;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectPath
}: ProtectedRouteProps) {
  const { user, isAuthenticated, getNormalizedRole, getRoleRedirectPath, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Not Authenticated
  if (!isAuthenticated || !user) {
    // Pick fallback login URL based on expected role
    let fallbackLogin = '/giris';
    if (allowedRoles.includes('merchant') || allowedRoles.includes('seller')) {
      fallbackLogin = '/saticipaneli';
    } else if (allowedRoles.includes('courier')) {
      fallbackLogin = '/kurye/giris';
    } else if (allowedRoles.includes('admin')) {
      fallbackLogin = '/sistem-admin/login';
    }

    return <Navigate to={redirectPath || fallbackLogin} state={{ from: location }} replace />;
  }

  // 2. Check Role Authorization
  const currentRole = getNormalizedRole();
  const isAllowed = allowedRoles.some(r => {
    if (r === 'customer' || r === 'buyer') return currentRole === 'customer';
    if (r === 'merchant' || r === 'seller') return currentRole === 'merchant';
    return currentRole === r;
  });

  // 3. Unauthorized Role -> Show 403 Access Denied Screen
  if (!isAllowed) {
    const roleLabels: Record<string, string> = {
      customer: 'Müşteri / Tüketici',
      merchant: 'Esnaf / Satıcı',
      courier: 'TamKurye',
      admin: 'Sistem Yöneticisi (Admin)'
    };

    const targetRoleLabel = allowedRoles
      .map(r => roleLabels[r] || r)
      .join(' veya ');

    return (
      <div className="min-h-screen bg-[#0B132B] text-white flex items-center justify-center p-6 selection:bg-rose-500 selection:text-white">
        <div className="max-w-md w-full bg-[#111B38] border border-rose-500/30 rounded-3xl p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
          
          {/* Subtle Glow background */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-black uppercase tracking-wider">
            <Lock className="w-4 h-4 text-rose-400" />
            HTTP 403 — Yetkisiz Erişim Uyarısı
          </div>

          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white">
              Erişim Engellendi
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              Girmeye çalıştığınız sayfa yalnızca <strong className="text-amber-400">{targetRoleLabel}</strong> rolüne sahip hesaplar içindir.
            </p>
          </div>

          {/* User Current Info */}
          <div className="bg-[#0B132B]/80 border border-slate-700/60 rounded-2xl p-4 text-left text-xs space-y-1.5">
            <div className="flex justify-between text-slate-400 font-mono text-[10px]">
              <span>Mevcut Oturum:</span>
              <span className="text-emerald-400 font-bold">Aktif</span>
            </div>
            <div className="font-bold text-white truncate">{user.name}</div>
            <div className="text-slate-400 text-[11px] truncate">{user.email}</div>
            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <span className="text-slate-400 text-[11px]">Mevcut Rolünüz:</span>
              <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-black text-[10px] uppercase">
                {roleLabels[currentRole]}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2.5 pt-2">
            <Link
              to={getRoleRedirectPath()}
              className="w-full py-3.5 bg-gradient-to-r from-[#0F4C3A] to-emerald-600 hover:from-emerald-700 hover:to-[#0F4C3A] text-white font-black text-xs rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-300" />
              <span>Kendi Yönetim Panetime Git ({roleLabels[currentRole]})</span>
            </Link>

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Çıkış Yap & Başka Hesapla Gir</span>
            </button>

            <Link
              to="/"
              className="inline-block text-xs text-slate-400 hover:text-white font-semibold transition pt-1"
            >
              ← Ana Sayfaya Dön
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // 4. Authorized -> Render Children
  return <>{children}</>;
}
