"use client";

import { motion } from "framer-motion";
import { Activity, Sparkles, Plus, CheckCircle2, Zap, Target, Flame, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { CardStack, CardStackItem } from "@/components/ui/card-stack";
import GlassmorphismTrustHero from "@/components/ui/glassmorphism-trust-hero";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { GradientButton } from "@/components/ui/gradient-button";
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";

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

  useEffect(() => setMounted(true), []);



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
          <GradientButton asChild variant="variant" className="px-6 py-2.5 rounded-xl text-sm min-w-0 h-auto font-bold flex items-center gap-2">
            <Link href="/login">
              Get Started <ChevronRight className="w-4 h-4" />
            </Link>
          </GradientButton>
        </motion.div>
      </nav>

      {/* Geometric Absolute Flow Header */}
      <HeroGeometric />

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-24 z-10 relative">

        {/* Spline Interactive 3D Demo Section */}
        <div id="demo" className="mt-24 relative z-30 w-full max-w-6xl">
          <Card className="w-full h-[600px] md:h-[700px] bg-black/40 backdrop-blur-2xl border-white/10 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] rounded-[2.5rem]">
            <Spotlight
              className="-top-40 left-0 md:left-60 md:-top-20"
            />

            <div className="flex flex-col md:flex-row h-full">
              {/* Left content */}
              <div className="flex-1 p-8 md:p-16 relative z-10 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white via-indigo-200 to-indigo-600 mb-6 drop-shadow-sm">
                    Visualize <br />Your Habits
                  </h2>
                  <p className="text-lg md:text-xl text-neutral-400 font-medium leading-relaxed max-w-lg mb-8">
                    Being ready is a myth. You start, you suck, you figure it out, and you get better.
                  </p>

                  <div className="flex gap-4 items-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
                      className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 hover:bg-indigo-500/40 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)]"
                      role="button"
                      aria-label="Interact"
                    >
                      <Zap className="w-6 h-6 text-indigo-400" />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
                      className="w-12 h-12 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center border border-fuchsia-500/30 hover:bg-fuchsia-500/40 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.2)] hover:shadow-[0_0_25px_rgba(217,70,239,0.4)]"
                      role="button"
                      aria-label="Monitor Activity"
                    >
                      <Activity className="w-6 h-6 text-fuchsia-400" />
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Right content - Spline 3D Scene */}
              <div className="flex-1 relative cursor-grab active:cursor-grabbing min-h-[400px] md:min-h-full">
                {/* 
                  Using a dark aesthetic abstract spline cube / geometry that fits the theme. 
                  Users can swap this URL with their own exported scene.splinecode! 
                */}
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Card>
        </div>

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
