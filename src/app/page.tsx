"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Activity, Sparkles, Plus, CheckCircle2, Zap, Target, Flame, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { CardStack, CardStackItem } from "@/components/ui/card-stack";
import GlassmorphismTrustHero from "@/components/ui/glassmorphism-trust-hero";

const cardStackItems: CardStackItem[] = [
  {
    id: 1,
    title: "Deep Focus Mastery",
    description: "Achieve uninterrupted flow state routines.",
    imageSrc: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Shatter Limits",
    description: "Push your physical limits and build unyielding discipline.",
    imageSrc: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Elite Tracking",
    description: "Visualize your momentum and shatter your records.",
    imageSrc: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Hydration Protocol",
    description: "Fuel your biological machine for peak performance.",
    imageSrc: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Zero-Gravity Recovery",
    description: "Center your mind and obliterate stress before the day begins.",
    imageSrc: "https://images.unsplash.com/photo-1554284126-aa88f2247b97?q=80&w=1000&auto=format&fit=crop",
  },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // Interactive Demo State
  const [demoHabits, setDemoHabits] = useState([
    { id: 1, name: "Zero-Gravity Meditation", time: "20 mins", done: true, icon: "🧘‍♂️", color: "from-blue-500 to-cyan-500" },
    { id: 2, name: "Hypertrophy Circuit", time: "1.5 Hours", done: true, icon: "🏋️", color: "from-red-500 to-orange-500" },
    { id: 3, name: "Deep Code Mode", time: "4 Hours", done: true, icon: "💻", color: "from-indigo-500 to-purple-500" },
    { id: 4, name: "Hydration Protocol", time: "3 Liters", done: false, icon: "💧", color: "from-sky-400 to-blue-600" },
  ]);

  const completedCount = demoHabits.filter(h => h.done).length;
  const completionPercentage = Math.round((completedCount / demoHabits.length) * 100);

  const toggleHabit = (id: number) => {
    setDemoHabits(prev => prev.map(h => h.id === id ? { ...h, done: !h.done } : h));
  };

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
          <div className="w-10 h-10 flex items-center justify-center">
            <Logo className="w-8 h-8 drop-shadow-[0_0_15px_rgba(192,132,252,0.6)]" />
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

      {/* Premium Glassmorphism Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-24 z-10 relative">

        <GlassmorphismTrustHero />

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
              <div className="bg-indigo-500/10 border border-indigo-500/20 px-6 py-3 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.2)] mt-4 md:mt-0 transition-all duration-300">
                <span className="text-indigo-400 font-black text-lg">{completionPercentage}% Completion</span>
              </div>
            </div>

            {/* Depth Level 2 - Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ transform: "translateZ(80px)" }}>
              {demoHabits.map((habit) => (
                <motion.div
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  whileHover={{ scale: 1.05, translateZ: 120 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex items-center justify-between p-6 rounded-3xl transition-all duration-300 border cursor-pointer ${habit.done ? 'bg-white/5 border-white/10 shadow-2xl' : 'bg-black/60 border-white/5 hover:bg-white/10 shadow-lg'}`}
                >
                  <div className="flex items-center gap-5 relative z-10 text-left">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-xl transition-all duration-300 ${habit.done ? `bg-gradient-to-br ${habit.color}` : 'bg-white/5 grayscale opacity-50'}`}>
                      {habit.icon}
                    </div>
                    <div>
                      <h4 className={`text-xl font-bold transition-colors ${habit.done ? 'text-white' : 'text-neutral-400'}`}>{habit.name}</h4>
                      <span className="text-sm text-neutral-500 font-medium">{habit.time}</span>
                    </div>
                  </div>
                  {habit.done ? (
                    <motion.div
                      layoutId={`check-${habit.id}`}
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

        {/* Feature Highlights Card Stack */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, type: "spring" }}
          className="mt-40 mb-24 relative z-30 w-full max-w-5xl flex flex-col items-center text-center"
        >
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Master Your Biological Machine
            </h2>
            <p className="text-neutral-300 text-lg md:text-xl font-medium tracking-wide max-w-2xl mx-auto shadow-black drop-shadow-md">
              Unlock the ultimate flow state with automated protocols and stunning visuals.
            </p>
          </div>

          <div className="w-full flex justify-center perspective-[2000px]">
            <CardStack
              items={cardStackItems}
              initialIndex={0}
              autoAdvance
              intervalMs={3000}
              pauseOnHover
              showDots
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
