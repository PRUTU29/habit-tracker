"use client";

import { motion } from "framer-motion";
import { Circle, Hexagon, Sparkles, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { GradientButton } from "@/components/ui/gradient-button";

function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[2px] border-2 border-white/[0.15]",
                        "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                        "after:absolute after:inset-0 after:rounded-full",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

export function HeroGeometric({
    badge = "Antigravity Protocol",
    title1 = "Escape the Gravity",
    title2 = "of Procrastination",
}: {
    badge?: string;
    title1?: string;
    title2?: string;
}) {
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.5 + i * 0.2,
                ease: [0.25, 0.4, 0.25, 1] as const,
            },
        }),
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#020202]">
            {/* Themed Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.08] via-transparent to-purple-500/[0.08] blur-3xl" />

            {/* Geometric Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <ElegantShape
                    delay={0.3}
                    width={600}
                    height={140}
                    rotate={12}
                    gradient="from-indigo-500/[0.15]"
                    className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
                />

                <ElegantShape
                    delay={0.5}
                    width={500}
                    height={120}
                    rotate={-15}
                    gradient="from-fuchsia-500/[0.15]"
                    className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
                />

                <ElegantShape
                    delay={0.4}
                    width={300}
                    height={80}
                    rotate={-8}
                    gradient="from-violet-500/[0.15]"
                    className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
                />

                <ElegantShape
                    delay={0.6}
                    width={200}
                    height={60}
                    rotate={20}
                    gradient="from-blue-500/[0.15]"
                    className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
                />

                <ElegantShape
                    delay={0.7}
                    width={150}
                    height={40}
                    rotate={-25}
                    gradient="from-cyan-500/[0.15]"
                    className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-4 md:px-6 mt-20 md:mt-0">
                <div className="max-w-4xl mx-auto text-center">

                    {/* Badge */}
                    <motion.div
                        custom={0}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12 shadow-[0_0_20px_rgba(99,102,241,0.1)] backdrop-blur-md"
                    >
                        <Zap className="h-4 w-4 text-indigo-400 fill-indigo-400/20" />
                        <span className="text-sm text-indigo-200 font-semibold tracking-wide uppercase">
                            {badge}
                        </span>
                    </motion.div>

                    {/* Headings */}
                    <motion.div
                        custom={1}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-6 md:mb-8 tracking-tighter leading-[0.9]">
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70 drop-shadow-lg">
                                {title1}
                            </span>
                            <br />
                            <span
                                className={cn(
                                    "bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 drop-shadow-md"
                                )}
                            >
                                {title2}
                            </span>
                        </h1>
                    </motion.div>

                    {/* Description */}
                    <motion.div
                        custom={2}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <p className="text-lg sm:text-xl md:text-2xl text-neutral-400 mb-10 leading-relaxed font-medium tracking-wide max-w-2xl mx-auto px-4">
                            A premium, ultra-responsive tracker for the elite 1%. Build routines,
                            shatter limits, and watch your discipline compound effortlessly.
                        </p>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        custom={3}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <GradientButton asChild variant="variant" className="w-full sm:w-auto px-8 py-5 rounded-2xl text-lg font-bold flex items-center justify-center gap-3">
                            <Link href="/login">
                                Ignite Your Potential <ChevronRight className="w-5 h-5" />
                            </Link>
                        </GradientButton>

                        <a href="#demo" className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10 hover:border-white/20">
                            <Sparkles className="w-5 h-5 text-indigo-400" />
                            View Interactive Demo
                        </a>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Gradient Fade to merge into page */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202]/80 pointer-events-none" />
        </div>
    );
}
