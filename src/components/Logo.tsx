import React from "react";

export function Logo({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Dynamic upward energetic arrow/A-shape */}
            <path
                d="M50 15 L85 85 L50 65 L15 85 Z"
                fill="white"
            />

            {/* Right side gradient/highlight for depth */}
            <path
                d="M50 15 L85 85 L50 65 Z"
                fill="url(#logo-gradient)"
            />

            {/* Hovering energetic particle/dot */}
            <circle cx="50" cy="5" r="4" fill="#C084FC" />

            <defs>
                <linearGradient id="logo-gradient" x1="50" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#818CF8" />
                    <stop offset="1" stopColor="#C084FC" />
                </linearGradient>
            </defs>
        </svg>
    );
}
