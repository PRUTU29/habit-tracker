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
import { Loader2, Heart, Plus, LogOut, Info, ChevronLeft, ChevronRight, Trash2, Check } from "lucide-react";

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

    const daysArray = useMemo(() => {
        return Array.from({ length: daysInMonth }).map((_, i) => addDays(startDayOfMonth, i));
    }, [daysInMonth, startDayOfMonth]);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.replace("/login");
            } else {
                setUser(session.user);
            }
        };
        checkUser();
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
            setLogs([...logs, { id: tempId, habit_id: habitId, completed_date: dateStr }]);

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
        <div className="min-h-screen bg-[#383838] text-neutral-200 font-sans p-4 md:p-8 flex flex-col items-center">

            {/* Sign Out Header */}
            <div className="w-full max-w-[1400px] flex justify-between items-center mb-6">
                <div className="flex items-center gap-4 text-sm font-medium text-neutral-400">
                    <span>{user?.user_metadata?.full_name || user?.email}</span>
                </div>
                <button onClick={handleSignOut} className="text-neutral-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
                    <LogOut size={16} /> Sign Out
                </button>
            </div>

            <div className="w-full max-w-[1400px] bg-[#424242] shadow-2xl rounded-xl overflow-hidden flex flex-col">

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
                            <span>Day 1</span>
                            <span>Day {Math.ceil(daysInMonth / 2)}</span>
                            <span>Day {daysInMonth}</span>
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
                                    <div key={i} className="w-[24px] flex flex-col items-center justify-end leading-tight">
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
                                <div key={habit.id} className="flex items-center mb-1 text-[11px] md:text-xs font-bold font-mono">

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
                                                <button
                                                    key={cIdx}
                                                    disabled={isFuture}
                                                    onClick={() => handleToggleLog(habit.id, day)}
                                                    className={`w-[24px] h-[24px] border border-gray-300 border-dotted m-[1px] flex items-center justify-center transition-all ${isChecked ? 'bg-opacity-100 text-black border-none' : 'bg-transparent text-transparent hover:border-solid hover:border-gray-500'
                                                        } ${isFuture ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                                                    style={{ backgroundColor: isChecked ? habit.color : 'transparent' }}
                                                >
                                                    {isChecked ? <Check size={14} className="text-black/70" /> : null}
                                                </button>
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
                            <div className="w-[300px] pr-4 normal-case text-gray-500 font-normal leading-tight text-xs">
                                In the lines above, in a short but sufficiently descriptive way, write the habits you want to follow.
                                Also input what are your monthly goals for.
                            </div>

                            <div className="flex h-12 items-end">
                                {chartData.map((d, i) => (
                                    <div key={i} className="w-[24px] flex flex-col items-center justify-end m-[1px]">
                                        {d.count > 0 && (
                                            <div
                                                className="w-[14px] bg-[#2dd4bf] mb-1"
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
                <div className="bg-[#424242] p-8 mt-auto grid grid-cols-1 md:grid-cols-4 gap-4 items-center justify-items-center">

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
