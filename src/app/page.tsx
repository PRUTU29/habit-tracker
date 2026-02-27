"use client";

import { motion } from "framer-motion";
import { Activity, Sparkles, Plus, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-70 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] animate-pulse bg-purple-500/20 rounded-full blur-[100px] opacity-60 pointer-events-none" />

      {/* Navigation Layer */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center z-10 glass-panel rounded-b-3xl border-t-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">Antigravity Tracker</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/5 transition-colors">
            Sign In
          </Link>
          <Link href="/login" className="px-5 py-2.5 rounded-full text-sm font-semibold bg-white text-black hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-6xl px-6 py-24 z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm text-indigo-300 font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Habit Formation</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1]">
            Master your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">habits.</span><br />
            Redefine your life.
          </h1>

          <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            A premium, ultra-fast habit tracker designed for high-achievers. Built with Next.js, powered by AI, and designed to make your daily routines feel effortless.
          </p>

          <div className="pt-8 flex justify-center gap-6">
            <Link
              href="/dashboard"
              className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-10px_rgba(99,102,241,0.7)] transition-all overflow-hidden flex items-center gap-3"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10">Start Tracking Now</span>
              <Plus className="relative z-10 w-5 h-5 group-hover:rotate-90 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Demo Dashboard Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-24 w-full max-w-4xl glass-panel rounded-3xl p-8 transform rotate-x-12 shadow-2xl skew-y-1 hover:skew-y-0 hover:rotate-0 transition-all duration-700 ease-out"
        >
          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
            <h3 className="text-2xl font-bold">Today's Progress</h3>
            <span className="text-indigo-400 font-medium bg-indigo-500/10 px-4 py-1.5 rounded-full">3 / 5 Habits Completed</span>
          </div>

          <div className="space-y-4">
            {[
              { name: "Morning Meditation", time: "10 mins", done: true },
              { name: "Drink Water", time: "2 Liters", done: true },
              { name: "Deep Work Session", time: "2 Hours", done: true },
              { name: "Read a Book", time: "30 Pages", done: false },
            ].map((habit, i) => (
              <div key={i} className={`flex items-center justify-between p-4 rounded-2xl transition-colors ${habit.done ? 'bg-white/5' : 'bg-transparent border border-white/5 hover:bg-white-[0.02]'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${habit.done ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40' : 'bg-white/5 text-neutral-500'}`}>
                    <CheckCircle2 className={`w-6 h-6 ${habit.done ? 'opacity-100' : 'opacity-30'}`} />
                  </div>
                  <div>
                    <h4 className={`text-lg font-semibold ${habit.done ? 'text-white' : 'text-neutral-300'}`}>{habit.name}</h4>
                    <span className="text-sm text-neutral-500">{habit.time}</span>
                  </div>
                </div>
                {habit.done && (
                  <div className="text-sm font-bold text-indigo-400">Done!</div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
