"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Activity, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
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
                });
                if (error) throw error;
                // Optional: show a message to check email, or redirect
                alert("Success! Please check your email for the confirmation link.");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center relative overflow-hidden px-4">
            {/* Background Orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] opacity-70 pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] opacity-60 pointer-events-none" />

            <Link href="/" className="absolute top-8 left-8 flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Activity className="text-white w-4 h-4" />
                </div>
                <span className="font-bold tracking-tight">Antigravity Tracker</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md glass-panel rounded-3xl p-8 z-10"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold tracking-tight mb-2">
                        {isLogin ? "Welcome back" : "Create an account"}
                    </h2>
                    <p className="text-neutral-400 text-sm">
                        {isLogin ? "Enter your details to sign in to your account" : "Enter your details to create your account"}
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <span>{isLogin ? "Sign In" : "Sign Up"}</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError(null);
                        }}
                        className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
