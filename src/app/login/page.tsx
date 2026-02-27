"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Mail, Lock, ArrowRight, Loader2, User, Calendar, Quote } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const FITNESS_QUOTES = [
    {
        text: "Discipline is the bridge between goals and accomplishment.",
        author: "Jim Rohn"
    },
    {
        text: "We are what we repeatedly do. Excellence then is not an act, but a habit.",
        author: "Aristotle"
    },
    {
        text: "The hard days are what make you stronger.",
        author: "Aly Raisman"
    },
    {
        text: "No matter how slow you go, you are still lapping everybody on the couch.",
        author: "Dan John"
    }
];

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [quoteIndex, setQuoteIndex] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIndex((prev) => (prev + 1) % FITNESS_QUOTES.length);
        }, 7000);
        return () => clearInterval(interval);
    }, []);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isForgotPassword) {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin + '/reset-password',
                });
                if (error) throw error;
                alert("If an account exists with this email, a password reset link has been sent.");
                setIsForgotPassword(false);
            } else if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push("/dashboard");
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                            dob: dob,
                        }
                    }
                });
                if (error) throw error;
                alert("Success! Please check your email for the confirmation link.");
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-foreground flex relative overflow-hidden">

            {/* LEFT SIDE: Image & Quote Showcase */}
            <div className="hidden lg:flex flex-col flex-1 relative bg-black border-r border-white/5 overflow-hidden">
                {/* The Premium AI Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/fitness.png"
                        alt="Fitness Motivation"
                        fill
                        className="object-cover opacity-60 mix-blend-luminosity scale-[1.02] transform transition-transform duration-[20s] hover:scale-105"
                        priority
                    />
                    {/* Gradients to blend the image seamlessly into the right side */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050505]" />
                    <div className="absolute inset-0 bg-indigo-900/10 mix-blend-color" />
                </div>

                <div className="relative z-10 p-12 flex flex-col h-full justify-between">
                    <Link href="/" className="flex items-center gap-3 w-fit group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                            <Activity className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">Antigravity Tracker</span>
                    </Link>

                    {/* Rotating Quotes */}
                    <div className="max-w-xl pb-12">
                        <Quote className="w-12 h-12 text-indigo-500/50 mb-6" />
                        <div className="h-32 relative">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={quoteIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0"
                                >
                                    <p className="text-3xl font-black text-white leading-tight mb-4">
                                        "{FITNESS_QUOTES[quoteIndex].text}"
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="h-[1px] w-8 bg-indigo-500" />
                                        <p className="text-indigo-300 font-semibold tracking-widest uppercase text-sm">
                                            {FITNESS_QUOTES[quoteIndex].author}
                                        </p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Dots */}
                        <div className="flex gap-2 mt-8">
                            {FITNESS_QUOTES.map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition-all duration-500 ${i === quoteIndex ? 'w-8 bg-indigo-500' : 'bg-white/20'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: Auth Form */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 lg:px-12 relative z-10">

                {/* Mobile Logo Logo */}
                <Link href="/" className="lg:hidden absolute top-8 left-8 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Activity className="text-white w-4 h-4" />
                    </div>
                    <span className="font-bold tracking-tight">Antigravity Tracker</span>
                </Link>

                {/* Animated Background Glow specifically for the form */}
                <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-md relative"
                >
                    <div className="mb-10">
                        <h2 className="text-4xl font-black tracking-tight mb-3">
                            {isForgotPassword ? "Reset Password" : isLogin ? "Welcome back" : "Start your journey"}
                        </h2>
                        <p className="text-neutral-400">
                            {isForgotPassword
                                ? "Enter your email address to receive a secure password reset link."
                                : isLogin
                                    ? "Enter your details to sign in to your account and track your progress."
                                    : "Create your account and start crushing your goals today."}
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-5">

                        {!isLogin && !isForgotPassword && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-5"
                            >
                                <div className="space-y-2">
                                    <label className="text-xs font-bold tracking-wider text-neutral-400 uppercase">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
                                        <input
                                            type="text"
                                            required={!isLogin}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
                                            placeholder="David Goggins"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold tracking-wider text-neutral-400 uppercase">Date of Birth</label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
                                        <input
                                            type="date"
                                            required={!isLogin}
                                            value={dob}
                                            onChange={(e) => setDob(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner [color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-neutral-400 uppercase">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {!isForgotPassword && (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold tracking-wider text-neutral-400 uppercase">Password</label>
                                    {isLogin && (
                                        <button
                                            type="button"
                                            onClick={() => { setIsForgotPassword(true); setError(null); }}
                                            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                                        >
                                            Forgot password?
                                        </button>
                                    )}
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 mt-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold tracking-wide shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:hover:translate-y-0"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>{isForgotPassword ? "SEND RESET LINK" : isLogin ? "SIGN IN" : "CREATE ACCOUNT"}</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        {isForgotPassword ? (
                            <button
                                onClick={() => { setIsForgotPassword(false); setIsLogin(true); setError(null); }}
                                className="text-sm text-indigo-400 hover:text-indigo-300 font-bold tracking-wide transition-colors"
                            >
                                ← Back to Sign in
                            </button>
                        ) : (
                            <p className="text-sm text-neutral-500">
                                {isLogin ? "Don't have an account?" : "Already crushing it?"}
                                <button
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError(null);
                                    }}
                                    className="ml-2 text-indigo-400 hover:text-indigo-300 font-bold tracking-wide transition-colors"
                                >
                                    {isLogin ? "Sign up" : "Sign in"}
                                </button>
                            </p>
                        )}
                    </div>
                </motion.div>
            </div>

        </div>
    );
}
