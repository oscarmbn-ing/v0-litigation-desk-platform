"use client"

import React from "react"

import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  CheckCircle2,
} from "lucide-react"

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
}) {
  return (
    <button
      type="button"
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active
          ? "bg-indigo-950 text-white shadow-lg shadow-indigo-900/20"
          : "text-slate-500 hover:bg-slate-50 hover:text-indigo-900"
      }`}
    >
      {icon}
      <span className="hidden lg:block font-medium">{label}</span>
    </button>
  )
}

export function Sidebar() {
  return (
    <div className="w-20 lg:w-64 bg-white h-screen border-r border-slate-100 hidden md:flex flex-col fixed left-0 top-0 z-10">
      <div className="h-16 flex items-center px-6 border-b border-slate-50">
        <div className="flex items-center gap-2 text-indigo-950 font-bold text-xl">
          <div className="w-8 h-8 bg-indigo-950 rounded-lg flex items-center justify-center text-white text-sm">
            L
          </div>
          <span className="hidden lg:block">LexyDeudor</span>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        <NavItem icon={<LayoutDashboard size={20} />} label="Home" />
        <NavItem icon={<Users size={20} />} label="Clientes" active />
        <NavItem icon={<Briefcase size={20} />} label="Estudio" />
        <NavItem icon={<FileText size={20} />} label="Movimientos" />
        <NavItem icon={<CheckCircle2 size={20} />} label="Tareas" />
      </nav>
    </div>
  )
}
