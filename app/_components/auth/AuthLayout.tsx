'use client';

import React from 'react';
import { AuthIllustration } from './AuthIllustration';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="h-screen w-full bg-[#f0f2fa] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden font-sans antialiased text-slate-800">
      {/* Compact Centered Split Card Layout */}
      <div className="w-full max-w-4xl h-full max-h-[560px] bg-[#f0f2fa] rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-sm border border-slate-200/50">
        
        {/* Left Side: Authentication Form Panel (Strictly overflow-hidden) */}
        <div className="bg-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between rounded-3xl lg:rounded-r-none h-full overflow-hidden">
          {children}
        </div>

        {/* Right Side: Brand & Visual Illustration Panel */}
        <div className="bg-[#f0f2fa] p-6 sm:p-8 lg:p-10 hidden lg:flex flex-col items-center justify-center relative h-full overflow-hidden">
          <AuthIllustration />
        </div>

      </div>
    </div>
  );
}
