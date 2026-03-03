import React from "react";
import {
    ArrowRight,
    Play,
    Target,
    Crown,
    Star,
    Activity,
    HeartPulse,
    Watch,
    Zap,
    Flame,
    Trophy
} from "lucide-react";
import Link from "next/link";

// --- MOCK INTEGRATIONS / FEATURES ---
const INTEGRATIONS = [
    { name: "Neural Sync", icon: Zap },
    { name: "Bio-Metrics", icon: HeartPulse },
    { name: "Deep Focus", icon: Target },
    { name: "Momentum", icon: Flame },
    { name: "Elite Tier", icon: Trophy },
    { name: "Wearables", icon: Watch },
];

// --- SUB-COMPONENTS ---
const StatItem = ({ value, label }: { value: string; label: string }) => (
    <div className="flex flex-col items-center justify-center transition-transform hover:-translate-y-1 cursor-default">
        <span className="text-xl font-bold text-white sm:text-2xl">{value}</span>
        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium sm:text-xs">{label}</span>
    </div>
);

// --- MAIN COMPONENT ---
export default function HeroSection() {
    return (
        <div className="relative w-full text-white overflow-hidden font-sans rounded-[2.5rem] border border-white/5 bg-black/20 backdrop-blur-3xl shadow-2xl">
            {/* 
        SCOPED ANIMATIONS 
      */}
            <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-fade-in {
          animation: fadeSlideIn 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-marquee {
          animation: marquee 40s linear infinite; /* Slower for readability */
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>

            {/* Background Image with Gradient Mask */}
            <div
                className="absolute inset-0 z-0 bg-[url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop)] bg-cover bg-center opacity-30"
                style={{
                    maskImage: "linear-gradient(180deg, transparent, black 10%, black 70%, transparent)",
                    WebkitMaskImage: "linear-gradient(180deg, transparent, black 10%, black 70%, transparent)",
                }}
            />

            {/* Dark Overlay to ensure perfect contrast with rest of page */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/40 to-transparent z-0" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 pt-20 pb-12 sm:px-6 md:pt-28 md:pb-20 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">

                    {/* --- LEFT COLUMN --- */}
                    <div className="lg:col-span-7 flex flex-col justify-center space-y-8">

                        {/* Badge */}
                        <div className="animate-fade-in delay-100">
                            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 backdrop-blur-md transition-colors hover:bg-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-indigo-200 flex items-center gap-2">
                                    <Activity className="w-3.5 h-3.5 text-indigo-400" />
                                    Next-Generation Habit Engine
                                </span>
                            </div>
                        </div>

                        {/* Heading */}
                        <h1
                            className="animate-fade-in delay-200 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.9]"
                        >
                            Escape the<br />
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-md">
                                gravity
                            </span> of<br />
                            procrastination.
                        </h1>

                        {/* Description */}
                        <p className="animate-fade-in delay-300 max-w-xl text-lg text-zinc-400 leading-relaxed font-medium">
                            A premium, ultra-responsive tracker for the elite 1%. Build
                            routines, shatter limits, and watch your discipline compound effortlessly.
                        </p>

                        {/* CTA Buttons */}
                        <div className="animate-fade-in delay-400 flex flex-col sm:flex-row gap-4">
                            <Link href="/login" className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-zinc-950 transition-all hover:scale-[1.02] hover:bg-zinc-200 active:scale-[0.98]">
                                IGNITE YOUR POTENTIAL
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>

                            <button className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10 hover:border-white/20">
                                <Play className="w-4 h-4 fill-current" />
                                View Demo
                            </button>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN --- */}
                    <div className="lg:col-span-5 space-y-6 lg:mt-8">

                        {/* Stats Card */}
                        <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
                            {/* Card Glow Effect */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 ring-1 ring-indigo-500/40">
                                        <Target className="h-6 w-6 text-indigo-400" />
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold tracking-tight text-white">100,000+</div>
                                        <div className="text-sm text-zinc-400 font-medium">Habits Formed</div>
                                    </div>
                                </div>

                                {/* Progress Bar Section */}
                                <div className="space-y-3 mb-8">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-zinc-400 uppercase tracking-widest text-[10px]">Elite Consistency</span>
                                        <span className="text-indigo-400">98%</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-black/50 border border-white/5">
                                        <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                    </div>
                                </div>

                                <div className="h-px w-full bg-white/10 mb-6" />

                                {/* Mini Stats Grid */}
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <StatItem value="66" label="Avg Days" />
                                    <div className="w-px h-full bg-white/10 mx-auto" />
                                    <StatItem value="24/7" label="Tracking" />
                                    <div className="w-px h-full bg-white/10 mx-auto" />
                                    <StatItem value="100%" label="Focus" />
                                </div>

                                {/* Tag Pills */}
                                <div className="mt-8 flex flex-wrap gap-2">
                                    <div className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-[10px] font-bold tracking-wider text-green-400">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        SYSTEM ONLINE
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-[10px] font-bold tracking-wider text-yellow-500">
                                        <Crown className="w-3 h-3 text-yellow-500" />
                                        PRO TIER ACTIVE
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Marquee Card */}
                        <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 py-8 backdrop-blur-xl">
                            <h3 className="mb-6 px-8 text-xs font-bold uppercase tracking-widest text-zinc-500">Powered By</h3>

                            <div
                                className="relative flex overflow-hidden"
                                style={{
                                    maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                                    WebkitMaskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)"
                                }}
                            >
                                <div className="animate-marquee flex gap-10 whitespace-nowrap px-4">
                                    {/* Triple list for seamless loop */}
                                    {[...INTEGRATIONS, ...INTEGRATIONS, ...INTEGRATIONS].map((integration, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-2 opacity-50 transition-all hover:opacity-100 hover:scale-105 cursor-default grayscale hover:grayscale-0"
                                        >
                                            {/* Brand Icon */}
                                            <integration.icon className="h-5 w-5 text-indigo-400" />
                                            {/* Brand Name */}
                                            <span className="text-sm font-bold text-white tracking-widest uppercase">
                                                {integration.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
