'use client';

import React from 'react';

export function AuthIllustration() {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto py-2 select-none">
      {/* Brand Icon Badge - Compact */}
      <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg mb-6 transition-transform hover:scale-105">
        <div className="w-6 h-6 bg-white rounded-md" />
      </div>

      {/* POS Illustration Graphic - Compact scale */}
      <div className="relative w-52 h-52 sm:w-56 sm:h-56 flex items-center justify-center">
        <svg
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
          aria-hidden="true"
        >
          {/* Base Stand */}
          <path
            d="M120 250 H200 M160 210 V250"
            stroke="#1e293b"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M125 250 H195"
            stroke="#f1f5f9"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Dollar Tag Floating Bubble */}
          <g transform="translate(180, 25)">
            <circle cx="28" cy="28" r="22" fill="#facc15" stroke="#1e293b" strokeWidth="3" />
            <text
              x="28"
              y="37"
              textAnchor="middle"
              fill="#1e293b"
              fontSize="24"
              fontWeight="800"
              fontFamily="sans-serif"
            >
              $
            </text>
            {/* Connecting pointer */}
            <path d="M12 40 L0 52" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* POS Monitor Screen Container */}
          <rect
            x="50"
            y="70"
            width="190"
            height="130"
            rx="14"
            fill="#3b82f6"
            stroke="#1e293b"
            strokeWidth="3.5"
          />
          {/* Monitor Screen Header/Bottom Bar */}
          <rect x="50" y="170" width="190" height="30" fill="#1e293b" />

          {/* Decorative Dot Matrix on Screen */}
          <g fill="#1d4ed8" opacity="0.6">
            <circle cx="75" cy="130" r="2" />
            <circle cx="85" cy="130" r="2" />
            <circle cx="95" cy="130" r="2" />
            <circle cx="75" cy="140" r="2" />
            <circle cx="85" cy="140" r="2" />
            <circle cx="95" cy="140" r="2" />
            <circle cx="75" cy="150" r="2" />
            <circle cx="85" cy="150" r="2" />
            <circle cx="95" cy="150" r="2" />
          </g>

          {/* Sunburst lines on Screen */}
          <path d="M175 90 L185 80" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
          <path d="M190 98 L202 93" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
          <path d="M195 110 L208 112" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />

          {/* Circular Pie Chart Graphic */}
          <g transform="translate(85, 110)">
            <circle cx="35" cy="35" r="42" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
            {/* Pie Slices */}
            {/* Slice 1: Pink */}
            <path
              d="M35 35 L-7 35 A42 42 0 0 1 35 -7 Z"
              fill="#f43f5e"
              stroke="#1e293b"
              strokeWidth="2.5"
            />
            {/* Slice 2: Blue */}
            <path
              d="M35 35 L35 -7 A42 42 0 0 1 77 35 Z"
              fill="#93c5fd"
              stroke="#1e293b"
              strokeWidth="2.5"
            />
            {/* Slice 3: Magenta Bottom */}
            <path
              d="M35 35 L77 35 A42 42 0 0 1 -7 35 Z"
              fill="#ec4899"
              stroke="#1e293b"
              strokeWidth="2.5"
            />
          </g>

          {/* Paper Receipt behind POS Calculator */}
          <rect
            x="195"
            y="105"
            width="65"
            height="85"
            rx="4"
            fill="#ffffff"
            stroke="#1e293b"
            strokeWidth="3"
          />
          <line x1="208" y1="120" x2="245" y2="120" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="208" y1="130" x2="240" y2="130" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="208" y1="140" x2="235" y2="140" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />

          {/* POS Terminal / Calculator Machine */}
          <rect
            x="185"
            y="140"
            width="72"
            height="95"
            rx="8"
            fill="#bfdbfe"
            stroke="#1e293b"
            strokeWidth="3.5"
          />
          {/* Display screen on calculator */}
          <rect x="195" y="150" width="52" height="16" rx="4" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
          {/* Keypad Buttons */}
          <g fill="#1e293b">
            <rect x="195" y="174" width="10" height="10" rx="2" />
            <rect x="209" y="174" width="10" height="10" rx="2" />
            <rect x="223" y="174" width="10" height="10" rx="2" />
            <rect x="237" y="174" width="10" height="10" rx="2" />

            <rect x="195" y="188" width="10" height="10" rx="2" />
            <rect x="209" y="188" width="10" height="10" rx="2" />
            <rect x="223" y="188" width="10" height="10" rx="2" />
            <rect x="237" y="188" width="10" height="10" rx="2" />

            <rect x="195" y="202" width="10" height="10" rx="2" />
            <rect x="209" y="202" width="10" height="10" rx="2" />
            <rect x="223" y="202" width="10" height="10" rx="2" />
            <rect x="237" y="202" width="10" height="10" rx="2" />
          </g>

          {/* Exclamation Badge on top of Calculator */}
          <g transform="translate(230, 130)">
            <rect x="0" y="0" width="18" height="26" rx="9" fill="#f43f5e" stroke="#1e293b" strokeWidth="2.5" />
            <text
              x="9"
              y="18"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="16"
              fontWeight="900"
              fontFamily="sans-serif"
            >
              !
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
