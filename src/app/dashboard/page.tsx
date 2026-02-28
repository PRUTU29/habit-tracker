"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
    format, getDaysInMonth, startOfMonth, addDays,
    isBefore, startOfDay, isSameDay, addMonths, subMonths, setMonth, setYear
} from "date-fns";
import {
    AreaChart, Area, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";
import { Loader2, Heart, Plus, LogOut, Info, ChevronLeft, ChevronRight, Trash2, Check, Menu, X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const FITNESS_QUOTES = [
    { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
    { text: "We are what we repeatedly do. Excellence then is not an act, but a habit.", author: "Aristotle" },
    { text: "The hard days are what make you stronger.", author: "Aly Raisman" },
    { text: "No matter how slow you go, you are still lapping everybody on the couch.", author: "Dan John" }
];

interface Habit {
    id: string;
    title: string;
    goal: number;
    color: string;
}

interface HabitLog {
    id: string;
    habit_id: string;
    completed_date: string;
}

const COLORS = ['#2dd4bf', '#818cf8', '#facc15', '#f87171', '#4ade80', '#fb923c', '#e879f9'];

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [logs, setLogs] = useState<HabitLog[]>([]);

    // New Habit State
    const [newHabitTitle, setNewHabitTitle] = useState("");
    const [newHabitGoal, setNewHabitGoal] = useState("10");

    const router = useRouter();

    const [currentDate, setCurrentDate] = useState(new Date());
    const year = format(currentDate, "yyyy");
    const monthName = format(currentDate, "MMMM");
    const daysInMonth = getDaysInMonth(currentDate);
    const startDayOfMonth = startOfMonth(currentDate);
    const today = startOfDay(new Date());

    const [quoteIndex, setQuoteIndex] = useState(0);
    const [showCelebration, setShowCelebration] = useState<{ message: string, count: number, title: string } | null>(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    const playCelebrationSound = () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContext();
            const playNote = (frequency: number, startTime: number, duration: number) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'triangle';
                osc.frequency.value = frequency;
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.3, startTime + duration * 0.2);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
                osc.start(startTime);
                osc.stop(startTime + duration);
            };
            const now = ctx.currentTime;
            playNote(523.25, now, 0.4);
            playNote(659.25, now + 0.15, 0.4);
            playNote(783.99, now + 0.3, 0.6);
            playNote(1046.50, now + 0.45, 1.0);
        } catch (e) { }
    };

    const triggerConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };
        function randomInRange(min: number, max: number) { return Math.random() * (max - min) + min; }
        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    const checkAndCelebrateStreak = (habitId: string, toggledDateStr: string, currentLogs: HabitLog[]) => {
        const habitLogsSet = new Set(currentLogs.filter(l => l.habit_id === habitId).map(l => l.completed_date));
        let streakCount = 1;
        let currentDay = new Date(toggledDateStr);
        currentDay.setDate(currentDay.getDate() - 1);
        while (habitLogsSet.has(format(currentDay, "yyyy-MM-dd"))) {
            streakCount++;
            currentDay.setDate(currentDay.getDate() - 1);
        }
        currentDay = new Date(toggledDateStr);
        currentDay.setDate(currentDay.getDate() + 1);
        while (habitLogsSet.has(format(currentDay, "yyyy-MM-dd"))) {
            streakCount++;
            currentDay.setDate(currentDay.getDate() + 1);
        }
        const habitTitle = habits.find(h => h.id === habitId)?.title || "Habit";
        const milestones = [5, 10, 15, 20, 25, 30, daysInMonth];
        if (milestones.includes(streakCount)) {
            playCelebrationSound();
            triggerConfetti();
            setShowCelebration({
                title: habitTitle,
                count: streakCount,
                message: streakCount >= daysInMonth ? "FULL MONTH COMPLETED!" : "INCREDIBLE STREAK!"
            });
            setTimeout(() => setShowCelebration(null), 4000);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIndex((prev) => (prev + 1) % FITNESS_QUOTES.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const daysArray = useMemo(() => {
        return Array.from({ length: daysInMonth }).map((_, i) => addDays(startDayOfMonth, i));
    }, [daysInMonth, startDayOfMonth]);

    useEffect(() => {
        // Listen for Supabase processing the URL hash from Google Login
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                setUser(session.user);
            } else if (event === 'SIGNED_OUT') {
                router.replace("/login");
            }
        });

        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            // Don't bounce them back to login if the hash contains tokens (Google auth callback)
            if (!session && !window.location.hash.includes("access_token")) {
                router.replace("/login");
            } else if (session) {
                setUser(session.user);
            }
        };

        checkUser();

        return () => subscription.unsubscribe();
    }, [router]);

    useEffect(() => {
        if (user) {
            fetchData(user.id);
        }
    }, [user, currentDate]);

    const fetchData = async (userId: string) => {
        // Fetch Habits
        const { data: habitsData } = await supabase
            .from("habits")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: true });

        // Fetch Logs
        // Filter to current month roughly
        const startDate = format(startDayOfMonth, "yyyy-MM-dd");
        const endDate = format(addDays(startDayOfMonth, daysInMonth), "yyyy-MM-dd");

        const { data: logsData } = await supabase
            .from("habit_logs")
            .select("*")
            .eq("user_id", userId)
            .gte("completed_date", startDate)
            .lte("completed_date", endDate);

        if (habitsData) setHabits(habitsData);
        if (logsData) setLogs(logsData);
        setLoading(false);
    };

    const handleToggleLog = async (habitId: string, date: Date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        const existingLog = logs.find(l => l.habit_id === habitId && l.completed_date === dateStr);

        // Optimistic UI update
        if (existingLog) {
            setLogs(logs.filter(l => l.id !== existingLog.id));
            await supabase.from("habit_logs").delete().eq("id", existingLog.id);
        } else {
            const tempId = `temp-${Date.now()}`;
            const newLog = { id: tempId, habit_id: habitId, completed_date: dateStr };
            const newLogs = [...logs, newLog];
            setLogs(newLogs);

            // CELEBRATION CHECK
            checkAndCelebrateStreak(habitId, dateStr, newLogs);

            const { data, error } = await supabase
                .from("habit_logs")
                .insert([{ habit_id: habitId, user_id: user.id, completed_date: dateStr }])
                .select()
                .single();

            if (!error && data) {
                setLogs(prev => prev.map(l => l.id === tempId ? data : l));
            } else {
                // Rollback
                setLogs(logs.filter(l => l.id !== tempId));
                alert("Make sure you ran the generated setup.sql script in Supabase! Error: " + error?.message);
            }
        }
    };

    const addHabit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newHabitTitle.trim()) return;

        const goal = parseInt(newHabitGoal) || 10;
        const color = COLORS[habits.length % COLORS.length];

        const { data, error } = await supabase
            .from("habits")
            .insert([{ title: newHabitTitle, goal, color, user_id: user.id }])
            .select()
            .single();

        if (error) {
            console.error(error);
            alert("Error saving habit. Did you run the setup.sql code in Supabase?");
            return;
        }

        if (data) {
            setHabits([...habits, data]);
            setNewHabitTitle("");
            setNewHabitGoal("10");
        }
    };

    const deleteHabit = async (habitId: string) => {
        if (!confirm("Are you sure you want to delete this habit and all its history?")) return;

        // Optimistic update
        const previousHabits = [...habits];
        setHabits(habits.filter(h => h.id !== habitId));

        const { error } = await supabase.from("habits").delete().eq("id", habitId);

        if (error) {
            console.error(error);
            alert("Error deleting habit.");
            setHabits(previousHabits); // Rollback
        } else {
            // Also clean up local logs if we want UI to reflect immediately without full refetch
            setLogs(logs.filter(l => l.habit_id !== habitId));
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.replace("/");
    };

    const handleDeleteAccount = async () => {
        if (!confirm("WARNING: Are you absolutely sure you want to permanently delete your account and all data? This cannot be undone.")) return;

        try {
            const { error } = await supabase.rpc('delete_user_account');
            if (error) {
                console.error("RPC Error:", error);
                alert("Please make sure you've run the latest setup.sql code in Supabase to enable account deletion.");
                return;
            }
            await supabase.auth.signOut();
            router.replace("/");
        } catch (err) {
            console.error(err);
            alert("An error occurred while deleting your account.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#333] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#2dd4bf] animate-spin" />
            </div>
        );
    }

    // --- Calculations for UI ---

    // Daily totals (for chart and bottom bar)
    const chartData = daysArray.map(day => {
        const dateStr = format(day, "yyyy-MM-dd");
        const count = logs.filter(l => l.completed_date === dateStr).length;
        return { name: format(day, "d"), count };
    });

    const totalPossible = habits.reduce((sum, h) => sum + h.goal, 0);
    const totalCompleted = logs.length;
    const overallSuccessRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

    // Let's cap success rate to 100% just in case they over-achieved
    const displaySuccessRate = Math.min(overallSuccessRate, 100);

    // Calculate Monthly Donut Data
    const monthlyProgress = Math.min(overallSuccessRate, 100);

    // Normalized 22 days progress (mock calculation just estimating a ratio for the visual)
    const daysPassed = daysArray.filter(d => !isBefore(today, d)).length || 1;
    const expectedProratedLogs = totalPossible * (daysPassed / daysInMonth);
    const normalizedProgress = expectedProratedLogs > 0 ? Math.min(Math.round((totalCompleted / expectedProratedLogs) * 100), 100) : 0;

    // Last 3 days momentum
    const last3Days = daysArray.filter(d => d <= today).slice(-3);
    let recentLogs = 0;
    last3Days.forEach(d => {
        const dStr = format(d, "yyyy-MM-dd");
        recentLogs += logs.filter(l => l.completed_date === dStr).length;
    });
    const maxPossible3Days = habits.length * 3;
    const momentum = maxPossible3Days > 0 ? Math.round((recentLogs / maxPossible3Days) * 100) : 0;


    return (
        <div className="min-h-screen bg-[#050505] text-neutral-200 font-sans p-4 md:p-8 flex flex-col items-center relative overflow-hidden">

            {/* Celebration Popup */}
            <AnimatePresence>
                {showCelebration && (
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: -50 }}
                        className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center p-4"
                    >
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-800 p-8 rounded-2xl shadow-2xl text-center border-2 border-white/20">
                            <h2 className="text-6xl font-black text-white mb-2 drop-shadow-lg">{showCelebration.count} DAYS!</h2>
                            <h3 className="text-2xl font-bold text-yellow-300 mb-4">{showCelebration.message}</h3>
                            <p className="text-lg text-white/90">You are doing amazing with <strong className="capitalize text-white">{showCelebration.title}</strong>!</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Images Layer */}
            <div className="absolute inset-0 z-0 flex justify-between pointer-events-none opacity-40 mix-blend-luminosity">
                <div className="w-1/3 h-full relative">
                    <Image src="/images/left.png" alt="Left Background" fill className="object-cover object-left" priority />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050505]" />
                </div>
                <div className="w-1/3 h-full relative">
                    <Image src="/images/right.png" alt="Right Background" fill className="object-cover object-right" priority />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#050505]" />
                </div>
            </div>

            {/* About Modal */}
            <AnimatePresence>
                {isAboutOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#1a1a1a] border border-white/10 p-8 rounded-2xl max-w-md w-full shadow-2xl relative"
                        >
                            <button onClick={() => setIsAboutOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                            <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                                <Info className="text-indigo-400" /> About Antigravity Tracker
                            </h2>
                            <p className="text-neutral-300 mb-4 leading-relaxed">
                                Antigravity Tracker is a premium, performance-focused habit tracking application built to help you establish and maintain discipline.
                            </p>
                            <p className="text-neutral-300 mb-6 leading-relaxed">
                                Developed with a dynamic user experience in mind, it celebrates your milestones and provides a serene yet powerful environment for your daily goals.
                            </p>
                            <div className="text-sm text-neutral-500 border-t border-white/10 pt-4 mt-6 flex justify-between">
                                <span>Version 1.0.0</span>
                                <span>Built with Next.js & Supabase</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header with Hamburger Menu */}
            <div className="w-full max-w-[1400px] flex justify-between items-center mb-6 relative z-50">
                <div className="flex items-center gap-4 text-sm font-medium text-neutral-400">
                    <span>{user?.user_metadata?.full_name || user?.email}</span>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5 text-neutral-300"
                    >
                        <Menu size={20} />
                    </button>

                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-3 w-56 bg-[#1a1a1a] border border-white/10 shadow-2xl rounded-xl overflow-hidden backdrop-blur-xl"
                            >
                                <div className="py-2">
                                    <button
                                        onClick={() => { setIsMenuOpen(false); setIsAboutOpen(true); }}
                                        className="w-full text-left px-4 py-3 text-sm text-neutral-300 hover:bg-white/5 transition-colors flex items-center gap-3"
                                    >
                                        <Info size={16} /> About the app
                                    </button>
                                    <div className="h-px bg-white/5 my-1" />
                                    <button
                                        onClick={() => { setIsMenuOpen(false); handleDeleteAccount(); }}
                                        className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-3"
                                    >
                                        <Trash2 size={16} /> Delete Account
                                    </button>
                                    <div className="h-px bg-white/5 my-1" />
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full text-left px-4 py-3 text-sm text-neutral-300 hover:bg-white/5 transition-colors flex items-center gap-3"
                                    >
                                        <LogOut size={16} /> Sign Out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="w-full max-w-[1400px] bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/5 shadow-2xl rounded-xl overflow-hidden flex flex-col relative z-10">

                {/* TOP SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 md:p-8 border-b border-neutral-600">

                    {/* Metadata */}
                    <div className="col-span-3 text-sm font-bold text-neutral-300 space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-1 hover:bg-neutral-600 rounded-full transition-colors text-white">
                                <ChevronLeft size={20} />
                            </button>
                            <select
                                value={currentDate.getMonth()}
                                onChange={(e) => setCurrentDate(setMonth(currentDate, parseInt(e.target.value)))}
                                className="bg-transparent text-xl font-black text-white text-center uppercase appearance-none outline-none cursor-pointer hover:bg-white/10 rounded px-2 py-1 transition-colors"
                            >
                                {Array.from({ length: 12 }).map((_, i) => {
                                    const mDate = new Date(2000, i, 1);
                                    return <option key={i} value={i} className="text-black uppercase">{format(mDate, "MMMM")}</option>;
                                })}
                            </select>

                            <select
                                value={currentDate.getFullYear()}
                                onChange={(e) => setCurrentDate(setYear(currentDate, parseInt(e.target.value)))}
                                className="bg-transparent text-xl font-black text-white text-center uppercase appearance-none outline-none cursor-pointer hover:bg-white/10 rounded px-2 py-1 transition-colors"
                            >
                                {Array.from({ length: 10 }).map((_, i) => {
                                    const y = new Date().getFullYear() - 5 + i;
                                    return <option key={y} value={y} className="text-black">{y}</option>;
                                })}
                            </select>
                            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-1 hover:bg-neutral-600 rounded-full transition-colors text-white">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                        <div className="mt-8 space-y-4">
                            <div className="grid grid-cols-2">
                                <span className="text-neutral-400">Start Date:</span>
                                <span>{format(startDayOfMonth, "MMMM d, yyyy")}</span>
                            </div>
                            <div className="grid grid-cols-2">
                                <span className="text-neutral-400">End Date:</span>
                                <span>{format(addDays(startDayOfMonth, daysInMonth - 1), "MMMM d, yyyy")}</span>
                            </div>
                            <div className="grid grid-cols-2">
                                <span className="text-neutral-400">Total Days:</span>
                                <span>{daysInMonth}</span>
                            </div>
                        </div>
                    </div>

                    {/* Area Chart */}
                    <div className="col-span-7 h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.5} />
                                        <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#2dd4bf"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorCount)"
                                    isAnimationActive={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                        <div className="flex justify-between w-full px-2 text-xs text-neutral-400 mt-2">
                            <span>Week 1</span>
                            <span>Week 2</span>
                            <span>Week 3</span>
                            <span>Week 4</span>
                        </div>
                    </div>

                    {/* Success Rate */}
                    <div className="col-span-2 flex flex-col items-center justify-center text-center">
                        <h3 className="text-[#fb7185] font-bold tracking-widest text-sm mb-2">SUCCESS RATE</h3>
                        <span className="text-6xl font-black text-white">{displaySuccessRate}%</span>
                        <div className="flex gap-2 text-[#fb7185] my-2">
                            <Heart fill="currentColor" size={20} />
                            <Heart fill="currentColor" size={20} />
                        </div>
                        <span className="text-[#fb7185] font-bold tracking-widest text-sm">GOOD JOB</span>
                    </div>

                </div>

                {/* MIDDLE SECTION: GRID */}
                <div className="p-6 md:p-8 bg-white text-black font-sans uppercase overflow-x-auto relative min-h-[400px]">
                    <div className="min-w-max">

                        {/* Table Header */}
                        <div className="flex border-b-2 border-dashed border-gray-300 pb-2 mb-2 font-bold text-[10px] md:text-xs">
                            <div className="w-[300px] flex justify-between pr-4 items-end">
                                <span>HABIT</span>
                                <span>GOAL</span>
                            </div>
                            <div className="flex">
                                {daysArray.map((day, i) => (
                                    <div key={i} className={`w-[26px] flex flex-col items-center justify-end leading-tight pb-1 pt-2 ${i > 0 && i % 7 === 0 ? 'ml-3' : ''}`}>
                                        <span>{format(day, "d")}</span>
                                        <span>{format(day, "eeeee")}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="w-[120px] ml-4 text-center items-end flex justify-center">
                                <span>PROGRESS</span>
                            </div>
                        </div>

                        {/* Table Body (Habits) */}
                        {habits.map((habit, rIdx) => {
                            const habitLogs = logs.filter(l => l.habit_id === habit.id);
                            const progressPct = habit.goal > 0 ? Math.min(Math.round((habitLogs.length / habit.goal) * 100), 100) : 0;

                            return (
                                <div key={habit.id} className="flex items-center mb-1 text-[11px] md:text-xs font-bold font-mono group/row">

                                    {/* Info Column */}
                                    <div className="w-[300px] flex justify-between items-center pr-4 group/habit relative">
                                        <div className="flex items-center gap-2 max-w-[80%]">
                                            <button
                                                onClick={() => deleteHabit(habit.id)}
                                                className="text-neutral-500 hover:text-red-500 opacity-0 group-hover/habit:opacity-100 transition-opacity p-1"
                                                title="Delete Habit"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                            <span className="capitalize truncate" style={{ color: habit.color }}>{habit.title}</span>
                                        </div>
                                        <span className="mr-2">{habit.goal}</span>
                                    </div>

                                    {/* Day Checkboxes */}
                                    <div className="flex">
                                        {daysArray.map((day, cIdx) => {
                                            const dateStr = format(day, "yyyy-MM-dd");
                                            const isChecked = habitLogs.some(l => l.completed_date === dateStr);
                                            const isFuture = isBefore(today, day) && !isSameDay(today, day);

                                            return (
                                                <div key={cIdx} className={`w-[26px] h-[26px] flex items-center justify-center ${cIdx > 0 && cIdx % 7 === 0 ? 'ml-3' : ''}`}>
                                                    <button
                                                        disabled={isFuture}
                                                        onClick={() => handleToggleLog(habit.id, day)}
                                                        className={`w-[22px] h-[22px] border border-gray-300 border-dotted flex items-center justify-center transition-all ${isChecked ? 'bg-opacity-100 text-black border-none shadow-sm' : 'bg-transparent text-transparent hover:border-solid hover:border-gray-500'
                                                            } ${isFuture ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                                                        style={{ backgroundColor: isChecked ? habit.color : 'transparent' }}
                                                    >
                                                        {isChecked ? <Check size={14} className="text-black/70" /> : null}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Progress Column */}
                                    <div className="w-[120px] ml-4 flex items-center gap-2">
                                        <span className="w-10 text-right">{progressPct}%</span>
                                        <div className="h-3 flex-1 border border-gray-400 bg-white">
                                            <div
                                                className="h-full"
                                                style={{ width: `${progressPct}%`, backgroundColor: habit.color }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Add Habit Prompt (Inline) */}
                        <form onSubmit={addHabit} className="flex items-center mt-3 pt-3 border-t border-dashed border-gray-300 text-xs">
                            <div className="w-[300px] flex pr-4 gap-2">
                                <input
                                    type="text"
                                    value={newHabitTitle}
                                    onChange={e => setNewHabitTitle(e.target.value)}
                                    placeholder="Add a new habit..."
                                    className="w-full bg-gray-100 border border-gray-300 px-2 py-1 outline-none text-black normal-case font-normal"
                                />
                                <input
                                    type="number"
                                    value={newHabitGoal}
                                    onChange={e => setNewHabitGoal(e.target.value)}
                                    className="w-12 bg-gray-100 border border-gray-300 px-1 py-1 outline-none text-black"
                                    min="1" max="31"
                                    title="Monthly Goal"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!newHabitTitle.trim()}
                                className="bg-black text-white px-3 py-1 font-bold disabled:opacity-50"
                            >
                                + ADD
                            </button>
                        </form>

                        {/* Bottom Row Totals */}
                        <div className="flex items-end mt-12 mb-4 text-[10px] md:text-sm font-bold">
                            <div className="w-[300px] pr-4 normal-case font-normal leading-tight text-xs flex flex-col justify-end">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={quoteIndex}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <div className="italic text-indigo-500 mb-1 leading-relaxed">"{FITNESS_QUOTES[quoteIndex].text}"</div>
                                        <div className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider">- {FITNESS_QUOTES[quoteIndex].author}</div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            <div className="flex h-12 items-end">
                                {chartData.map((d, i) => (
                                    <div key={i} className={`w-[26px] flex flex-col items-center justify-end pb-1 pt-1 ${i > 0 && i % 7 === 0 ? 'ml-3' : ''}`}>
                                        {d.count > 0 && (
                                            <div
                                                className="w-[14px] bg-[#2dd4bf] mb-1 rounded-sm"
                                                style={{ height: `${Math.max(d.count * 4, 4)}px` }}
                                            />
                                        )}
                                        <span>{d.count}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="w-[120px] ml-4 flex flex-col items-center justify-end">
                                <span className="text-3xl text-black">{totalCompleted}/{totalPossible}</span>
                                <span className="text-gray-500">Completed</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* BOTTOM SECTION: DONUTS */}
                <div className="bg-[#1a1a1a] border-t border-white/5 p-8 mt-auto grid grid-cols-1 md:grid-cols-4 gap-4 items-center justify-items-center">

                    <DonutChart value={monthlyProgress} color="#fb7185" label="MONTHLY PROGRESS" />
                    <DonutChart value={normalizedProgress} color="#06b6d4" label="22 DAYS PROGRESS NORMALIZED" />
                    <DonutChart value={momentum} color="#eab308" label="LAST 3 DAYS PROGRESS MOMENTUM" />

                    <div className="text-right w-full h-full flex items-center justify-end pl-8">
                        <h2 className="text-2xl md:text-4xl font-bold tracking-widest text-[#d4d4d8] leading-tight">
                            MONTHLY<br />HABIT<br />TRACKER
                        </h2>
                    </div>

                </div>

            </div>
        </div>
    );
}

// Helper Donut Component for bottom section
function DonutChart({ value, color, label }: { value: number, color: string, label: string }) {
    const data = [
        { name: "Done", value: value },
        { name: "Remain", value: 100 - value }
    ];
    return (
        <div className="flex gap-4 items-center">
            <div className="w-[100px] h-[100px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={30}
                            outerRadius={45}
                            startAngle={90}
                            endAngle={450}
                            dataKey="value"
                            stroke="none"
                            isAnimationActive={false}
                        >
                            <Cell fill={color} />
                            <Cell fill="#525252" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-sm" style={{ color }}>
                    {value}%
                </div>
            </div>
            <div className="text-[10px] md:text-xs font-bold text-[#a1a1aa] whitespace-pre-line tracking-widest max-w-[100px] -rotate-90 origin-left translate-y-8 translate-x-2">
                {label}
            </div>
        </div>
    );
}
