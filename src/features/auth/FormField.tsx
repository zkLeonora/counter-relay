'use client';

import React, { forwardRef, useState } from 'react';
import { LucideIcon, Eye, EyeOff } from 'lucide-react';

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  icon?: LucideIcon;
  rightAction?: React.ReactNode;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, id, error, icon: Icon, type = 'text', rightAction, className = '', ...props }, ref) => {
    const errorId = `${id}-error`;
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordType = type === 'password';
    const effectiveType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="flex flex-col w-full text-left">
        <div className="flex items-center justify-between mb-0.5">
          <label 
            htmlFor={id} 
            className="text-xs text-slate-500 font-medium tracking-tight select-none cursor-pointer"
          >
            {label}
          </label>
          {rightAction}
        </div>
        
        <div className="relative flex items-center w-full">
          <input
            ref={ref}
            id={id}
            type={effectiveType}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={`
              w-full h-10 px-3.5 text-xs sm:text-sm font-normal text-slate-800 bg-white
              border ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'} 
              rounded-full transition-all duration-150 ease-in-out
              placeholder:text-slate-300 focus:outline-none focus:ring-2
              disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
              ${isPasswordType || Icon ? 'pr-9' : 'pr-3.5'}
              ${className}
            `}
            {...props}
          />

          {isPasswordType ? (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none flex items-center justify-center cursor-pointer p-0.5 rounded transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 stroke-[1.75]" />
              ) : (
                <Eye className="w-4 h-4 stroke-[1.75]" />
              )}
            </button>
          ) : Icon ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center justify-center">
              <Icon className="w-4 h-4 stroke-[1.75]" aria-hidden="true" />
            </div>
          ) : null}
        </div>

        {error && (
          <p id={errorId} role="alert" className="text-[11px] leading-tight text-rose-500 font-medium mt-0.5 ml-3 flex items-center gap-1">
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
