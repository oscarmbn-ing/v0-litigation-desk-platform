"use client"

import {
    Calendar as CalendarIcon,
    Users,
    CheckCircle2,
    ArrowRight,
    ExternalLink,
    Landmark,
    FileText,
    Building2,
    Flame,
    Trophy,
    TrendingUp,
} from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { es } from "date-fns/locale"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

export function HomeView({
    onNavigate,
}: {
    onNavigate: (section: "clientes" | "tareas") => void
}) {
    const [date, setDate] = useState<Date | undefined>(new Date())

    // Mock Data for Charts - Using brand colors where possible or semantic with lower saturation
    const sentenciasData = [
        { name: "Favorables", value: 65, color: "#4F46E5" }, // Indigo 600
        { name: "Por apelar", value: 20, color: "#C026D3" }, // Fuchsia 600
        { name: "Citación a oír", value: 15, color: "#8B5CF6" }, // Violet 500
    ]

    const totalSentencias = sentenciasData.reduce((acc, curr) => acc + curr.value, 0)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full font-sans text-slate-800">
            {/* LEFT COLUMN - MAIN DASHBOARD (2/3 width) */}
            <div className="lg:col-span-2 flex flex-col gap-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Buenas tardes, José</h1>
                        <p className="text-slate-500 text-sm mt-1">Lunes, 12 de Octubre <span className="mx-2">•</span> Tienes 3 audiencias hoy</p>
                    </div>
                    {/* Gamification / Streak Badge - Simplified */}
                    <div className="bg-slate-50 text-slate-700 px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-3">
                        <div className="bg-indigo-100 p-1.5 rounded-full">
                            <Flame size={16} className="text-indigo-600 fill-indigo-600" />
                        </div>
                        <div>
                            <span className="block text-xs text-slate-500 font-medium uppercase tracking-wider">Racha</span>
                            <span className="font-bold text-slate-900 text-sm">12 días seguidos</span>
                        </div>
                    </div>
                </div>

                {/* Stats & Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Performance Card - Neutral Tone */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-violet-50 p-2 rounded-lg text-violet-600">
                                    <TrendingUp size={18} />
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm">Movimientos Revisados</h3>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-slate-900 tracking-tight">842</span>
                                <span className="text-sm font-medium text-slate-500">este mes</span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Expedientes gestionados activamente durante octubre.
                            </p>
                        </div>
                    </div>

                    {/* Judgments Chart Card - Clean */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                                <Building2 size={18} />
                            </div>
                            <h3 className="font-bold text-slate-800 text-sm">Sentencias</h3>
                        </div>
                        <div className="flex-1 flex items-center gap-4">
                            <div className="h-[120px] w-[120px] relative shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={sentenciasData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={35}
                                            outerRadius={55}
                                            paddingAngle={2}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {sentenciasData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontSize: '12px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="text-sm font-bold text-slate-700">{totalSentencias}%</span>
                                </div>
                            </div>

                            {/* Legend - Vertical */}
                            <div className="flex flex-col gap-2 flex-1">
                                {sentenciasData.map((item) => (
                                    <div key={item.name} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-slate-600 font-medium">{item.name}</span>
                                        </div>
                                        <span className="font-bold text-slate-800">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Primary Actions Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                    {/* Missions Action Card - Dark Brand Color */}
                    <div
                        className="bg-indigo-950 rounded-2xl p-6 relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
                        onClick={() => onNavigate("tareas")}
                    >
                        {/* Subtle Background */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
                                    <CheckCircle2 size={24} className="text-white" />
                                </div>
                                <span className="bg-indigo-800 text-indigo-100 text-[10px] font-bold px-2 py-1 rounded-lg border border-indigo-700">
                                    20 PENDIENTES
                                </span>
                            </div>

                            <div className="mt-auto">
                                <h2 className="text-xl font-bold text-white mb-1">Misiones</h2>
                                <p className="text-indigo-300 text-xs mb-4 leading-relaxed">
                                    Gestiona tus tareas prioritarias.
                                </p>

                                <button className="bg-white/10 hover:bg-white/20 text-white w-full py-2.5 rounded-lg font-semibold text-sm transition-colors border border-white/10">
                                    Ver Misiones
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Clients Radar Action Card - Clean White */}
                    <div
                        className="bg-white rounded-2xl p-6 border border-slate-200 group hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative"
                        onClick={() => onNavigate("clientes")}
                    >
                        <div className="flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-violet-50 p-2.5 rounded-xl group-hover:bg-violet-100 transition-colors">
                                    <Users size={24} className="text-violet-600 group-hover:text-violet-700" />
                                </div>
                            </div>

                            <div className="mt-auto">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-3xl font-bold text-slate-900 tracking-tight">2.768</span>
                                </div>
                                <h2 className="text-base font-semibold text-slate-700 mb-1">Radar de Clientes</h2>
                                <p className="text-slate-500 text-xs mb-4">
                                    Gestión de cartera.
                                </p>

                                <button className="bg-slate-50 hover:bg-slate-100 text-slate-700 w-full py-2.5 rounded-lg font-semibold text-sm transition-colors border border-slate-200/60 flex items-center justify-center gap-2 group-hover:text-indigo-700">
                                    Ir al Radar <ArrowRight size={14} className="text-slate-400 group-hover:text-indigo-500" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* RIGHT COLUMN - SIDEBAR TOOLS (1/3 width) */}
            <div className="lg:col-span-1 space-y-6">

                {/* Calendar Widget - Minimalist */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-4 pl-1">
                        <CalendarIcon size={16} className="text-slate-400" />
                        <h3 className="font-bold text-slate-700 text-sm">Agenda</h3>
                    </div>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border-0 p-0 w-full flex justify-center"
                        locale={es}
                        classNames={{
                            month: "space-y-4",
                            caption: "flex justify-center pt-1 relative items-center mb-2",
                            caption_label: "text-xs font-bold text-slate-700 capitalize",
                            nav: "space-x-1 flex items-center",
                            nav_button: "h-6 w-6 bg-transparent p-0 text-slate-400 hover:text-slate-900 rounded-md transition-colors",
                            nav_button_previous: "absolute left-1",
                            nav_button_next: "absolute right-1",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex mb-2",
                            head_cell: "text-slate-400 rounded-md w-8 font-medium text-[0.65rem] uppercase tracking-wider flex items-center justify-center",
                            row: "flex w-full mt-1 justify-between",
                            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-slate-50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                            day: "h-8 w-8 p-0 font-medium text-slate-600 aria-selected:opacity-100 hover:bg-slate-50 rounded-lg text-xs flex items-center justify-center transition-colors",
                            day_selected: "bg-indigo-950 text-white hover:bg-indigo-900 hover:text-white focus:bg-indigo-900 focus:text-white rounded-lg",
                            day_today: "bg-slate-100 text-slate-900 font-bold",
                        }}
                    />
                </div>

                {/* Quick Access Widget - List Style */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-4 pl-1">
                        <ExternalLink size={16} className="text-slate-400" />
                        <h3 className="font-bold text-slate-700 text-sm">Accesos Rápidos</h3>
                    </div>

                    <div className="space-y-2">
                        <a
                            href="https://ojv.pjud.cl/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                            <div className="bg-violet-50 p-2 rounded-lg text-violet-600 group-hover:text-violet-700 group-hover:bg-white border border-transparent group-hover:border-violet-100 transition-all">
                                <Landmark size={18} />
                            </div>
                            <div>
                                <span className="block text-xs font-semibold text-slate-700">Oficina Judicial Virtual</span>
                            </div>
                        </a>

                        <a
                            href="https://homer.sii.cl/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                            <div className="bg-violet-50 p-2 rounded-lg text-violet-600 group-hover:text-violet-700 group-hover:bg-white border border-transparent group-hover:border-violet-100 transition-all">
                                <FileText size={18} />
                            </div>
                            <div>
                                <span className="block text-xs font-semibold text-slate-700">SII</span>
                            </div>
                        </a>

                        <a
                            href="https://www.cmfchile.cl/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                            <div className="bg-violet-50 p-2 rounded-lg text-violet-600 group-hover:text-violet-700 group-hover:bg-white border border-transparent group-hover:border-violet-100 transition-all">
                                <Building2 size={18} />
                            </div>
                            <div>
                                <span className="block text-xs font-semibold text-slate-700">CMF</span>
                            </div>
                        </a>
                    </div>
                </div>

            </div>
        </div>
    )
}
