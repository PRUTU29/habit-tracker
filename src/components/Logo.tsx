import React from "react";

export function Logo({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* The Gravity Defying Platform */}
            <rect x="25" y="85" width="50" height="4" rx="2" fill="#3f3f46" opacity="0.6" />

            {/* The Main Levitating Crystal Left Face */}
            <path
                d="M50 10 L30 75 L50 65 Z"
                fill="url(#crystal-light)"
            />

            {/* The Main Levitating Crystal Right Face */}
            <path
                d="M50 10 L70 75 L50 65 Z"
                fill="url(#crystal-dark)"
            />

            {/* Central Glowing Core (The Focus) */}
            <path
                d="M50 35 L40 65 L50 58 L60 65 Z"
                fill="#ffffff"
                style={{ filter: "drop-shadow(0px 0px 8px rgba(139, 92, 246, 0.8))" }}
            />

            {/* Escaping Particle (The Habit) */}
            <circle cx="50" cy="0" r="4" fill="#E0E7FF" style={{ filter: "drop-shadow(0px 0px 5px rgba(255, 255, 255, 1))" }} />
            <circle cx="50" cy="5" r="2" fill="#ffffff" />

            <defs>
                <linearGradient id="crystal-light" x1="30" y1="75" x2="50" y2="10" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#C7D2FE" />
                    <stop offset="1" stopColor="#6366F1" />
                </linearGradient>
                <linearGradient id="crystal-dark" x1="70" y1="75" x2="50" y2="10" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4F46E5" />
                    <stop offset="1" stopColor="#C084FC" />
                </linearGradient>
            </defs>
        </svg>
    );
}
