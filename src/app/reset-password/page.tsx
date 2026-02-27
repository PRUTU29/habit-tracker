"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Activity, Lock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });
            if (error) throw error;
            alert("Password updated successfully!");
            router.push("/dashboard");
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-foreground flex relative overflow-hidden">

            {/* LEFT SIDE: Image Showcase */}
            <div className="hidden lg:flex flex-col flex-1 relative bg-black border-r border-white/5 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/right.png"
                        alt="Reset Password Motivation"
                        fill
                        className="object-cover opacity-60 mix-blend-luminosity scale-[1.02] transform transition-transform duration-[20s] hover:scale-105"
                        priority
                    />
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
                </div>
            </div>

            {/* RIGHT SIDE: Reset Form */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 lg:px-12 relative z-10">
                <Link href="/" className="lg:hidden absolute top-8 left-8 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Activity className="text-white w-4 h-4" />
                    </div>
                    <span className="font-bold tracking-tight">Antigravity Tracker</span>
                </Link>

                <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-md relative"
                >
                    <div className="mb-10">
                        <h2 className="text-4xl font-black tracking-tight mb-3">Update password</h2>
                        <p className="text-neutral-400">Enter a new secure password for your account.</p>
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

                    <form onSubmit={handleReset} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-neutral-400 uppercase">New Password</label>
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 mt-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold tracking-wide shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:hover:translate-y-0"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>UPDATE PASSWORD</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
