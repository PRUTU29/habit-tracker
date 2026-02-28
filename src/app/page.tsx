"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Activity, Sparkles, Plus, CheckCircle2, Zap, Target, Flame, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 3D Card Tilt Effect parameters
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#020202] text-foreground flex flex-col items-center relative overflow-hidden font-sans [perspective:1000px]">

      {/* Animated 3D Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] opacity-20 mix-blend-overlay"
          style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]"
        />
      </div>

      {/* Navigation Layer */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 mt-4 flex justify-between items-center z-50 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 backdrop-blur-xl bg-black/40 px-5 py-3 rounded-2xl border border-white/5 shadow-2xl"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]">
            <Activity className="text-white w-6 h-6 animate-pulse" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Antigravity</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex gap-4 items-center backdrop-blur-xl bg-black/40 px-3 py-3 rounded-2xl border border-white/5"
        >
          <Link href="/login" className="px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-white/10 text-neutral-300 hover:text-white transition-all">
            Sign In
          </Link>
          <Link href="/login" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-white text-black hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 flex items-center gap-2">
            Get Started <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </nav>

      {/* 3D Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-6xl px-6 py-12 z-10 text-center relative">

        {/* Floating 3D Component: Focus */}
        <motion.div
          animate={{ y: [-20, 20, -20], rotateX: [0, 20, 0], rotateY: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-0 lg:left-10 top-20 glass-panel p-4 rounded-2xl hidden md:flex items-center gap-3 shadow-2xl border border-indigo-500/30"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <Target className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white">Focus Factor</p>
            <p className="text-xs text-neutral-400">Deep Work Protocol</p>
          </div>
        </motion.div>

        {/* Floating 3D Component: Streak */}
        <motion.div
          animate={{ y: [20, -20, 20], rotateX: [0, -20, 0], rotateY: [0, 20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute right-0 lg:right-10 top-40 glass-panel p-4 rounded-2xl hidden md:flex items-center gap-3 shadow-2xl border border-orange-500/30"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white">45 Days</p>
            <p className="text-xs text-neutral-400">Current Streak</p>
          </div>
        </motion.div>

        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="max-w-4xl space-y-8 relative z-20"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-sm text-indigo-300 font-bold mb-4 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Next-Generation Habit Engine</span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[1] text-white drop-shadow-2xl">
            Escape the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 inline-block drop-shadow-md">
              gravity
            </span> of <br /> procrastination.
          </h1>

          <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto leading-relaxed font-medium">
            A premium, ultra-responsive tracker for the elite 1%. Build routines, shatter limits, and watch your discipline compound.
          </p>

          <div className="pt-8 flex justify-center gap-6">
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 md:px-10 md:py-5 rounded-2xl bg-white text-black font-black text-lg md:text-xl overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all flex items-center gap-4"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <span className="relative z-10 tracking-wide uppercase">Ignite Your Potential</span>
                <Zap className="relative z-10 w-6 h-6 group-hover:translate-x-1 transition-transform group-hover:text-indigo-600" />
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* 3D Interactive Demo Dashboard Viewport */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, type: "spring" }}
          className="mt-24 relative z-30 w-full max-w-5xl [perspective:2000px]"
        >
          <motion.div
            style={{
              x,
              y,
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full rounded-[2.5rem] p-6 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/10 bg-[#111111]/80 backdrop-blur-2xl relative cursor-crosshair transition-colors duration-500 hover:border-indigo-500/50"
          >
            {/* 3D Floating Screen Reflection */}
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-white/10 to-transparent opacity-30 pointer-events-none" style={{ transform: "translateZ(1px)" }} />

            {/* Depth Level 1 */}
            <div className="flex flex-col md:flex-row items-start justify-between mb-10 border-b border-white/5 pb-8" style={{ transform: "translateZ(40px)" }}>
              <div className="text-left">
                <h3 className="text-3xl md:text-4xl font-black text-white mb-2">Today's Protocol</h3>
                <p className="text-neutral-400 font-medium tracking-wide shadow-black drop-shadow-md">Sunday, Oct 24th</p>
              </div>
              <div className="bg-indigo-500/10 border border-indigo-500/20 px-6 py-3 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.2)] mt-4 md:mt-0">
                <span className="text-indigo-400 font-black text-lg">75% Completion</span>
              </div>
            </div>

            {/* Depth Level 2 - Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ transform: "translateZ(80px)" }}>
              {[
                { name: "Zero-Gravity Meditation", time: "20 mins", done: true, icon: "🧘‍♂️", color: "from-blue-500 to-cyan-500" },
                { name: "Hypertrophy Circuit", time: "1.5 Hours", done: true, icon: "🏋️", color: "from-red-500 to-orange-500" },
                { name: "Deep Code Mode", time: "4 Hours", done: true, icon: "💻", color: "from-indigo-500 to-purple-500" },
                { name: "Hydration Protocol", time: "3 Liters", done: false, icon: "💧", color: "from-sky-400 to-blue-600" },
              ].map((habit, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, translateZ: 120 }}
                  className={`relative flex items-center justify-between p-6 rounded-3xl transition-all duration-300 border ${habit.done ? 'bg-white/5 border-white/10 shadow-2xl' : 'bg-black/60 border-white/5 hover:bg-white/10 shadow-lg'}`}
                >
                  <div className="flex items-center gap-5 relative z-10 text-left">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-xl ${habit.done ? `bg-gradient-to-br ${habit.color}` : 'bg-white/5 grayscale opacity-50'}`}>
                      {habit.icon}
                    </div>
                    <div>
                      <h4 className={`text-xl font-bold ${habit.done ? 'text-white' : 'text-neutral-400'}`}>{habit.name}</h4>
                      <span className="text-sm text-neutral-500 font-medium">{habit.time}</span>
                    </div>
                  </div>
                  {habit.done ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center relative z-10 shadow-[0_0_20px_rgba(52,211,153,0.4)]"
                    >
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    </motion.div>
                  ) : (
                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-white/20 relative z-10 hover:border-white/50 transition-colors" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
