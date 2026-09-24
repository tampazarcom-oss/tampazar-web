/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export default function BrandLogo({ className = '', size = 'md', onClick }: BrandLogoProps) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    } else {
      navigate('/');
    }
  };

  const sizeClasses = {
    sm: 'h-7',
    md: 'h-10',
    lg: 'h-14',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <a
      href="/"
      onClick={handleClick}
      className={`flex items-center gap-2.5 select-none cursor-pointer group shrink-0 ${className}`}
      title="TamPazar - Şehrin Açık Dijital AVM'si ve Hibrit Pazaryeri"
    >
      {/* Logo Image with Breakage Shield (onError fallback) */}
      {!imgError ? (
        <img
          src="/tampazar-mark-transparent-1024.png"
          alt="TamPazar Logo"
          className={`${sizeClasses[size]} w-auto object-contain block transition-transform group-hover:scale-105`}
          onError={() => setImgError(true)}
        />
      ) : (
        /* Fallback SVG / Emblem Badge if image is missing */
        <div className="flex flex-col items-center justify-center bg-amber-500 rounded-xl px-2 py-1 shadow-xs group-hover:bg-amber-400 transition-colors">
          <span className="text-xl font-black text-slate-950 tracking-tighter leading-none">TP</span>
          <div className="w-6 h-1 bg-slate-950 rounded-full mt-0.5"></div>
        </div>
      )}

      {/* Typography */}
      <div className={`flex items-center ${textSizes[size]} font-extrabold tracking-tight`}>
        <span className="text-[#0B132B] group-hover:text-indigo-950 transition-colors">Tam</span>
        <span className="text-[#FF6A00]">Pazar</span>
      </div>
    </a>
  );
}
