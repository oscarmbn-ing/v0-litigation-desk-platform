"use client"

import React from "react"

import {
  LayoutDashboard,
  Users,
  CheckCircle2,
} from "lucide-react"

function LexyLogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="10"
        y="14"
        width="34"
        height="68"
        rx="5"
        transform="rotate(-45 10 14)"
        fill="#13004C"
      />
      <rect
        x="48"
        y="-2"
        width="34"
        height="68"
        rx="5"
        transform="rotate(45 48 -2)"
        fill="#4A2DDA"
      />
      <path d="M9 58 L43 39 L58 54 L24 73 Z" fill="#8D84E8" />
      <path d="M24 73 L58 54 L46 68 L24 83 Z" fill="#3F27BF" />
      <rect
        x="52"
        y="52"
        width="34"
        height="68"
        rx="5"
        transform="rotate(-45 52 52)"
        fill="#13004C"
      />
    </svg>
  )
}

function NavItem({
  icon,
  label,
  active = false,
  collapsed = false,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  collapsed?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${collapsed ? "justify-center" : ""
        } ${active
          ? "bg-indigo-950 text-white shadow-lg shadow-indigo-900/20"
          : "text-slate-500 hover:bg-slate-50 hover:text-indigo-900"
        }`}
      title={collapsed ? label : undefined}
    >
      {icon}
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </button>
  )
}

export function Sidebar({
  collapsed,
  onToggle,
  activeSection,
  onSelectSection,
}: {
  collapsed: boolean
  onToggle: () => void
  activeSection: "home" | "clientes" | "tareas"
  onSelectSection: (section: "home" | "clientes" | "tareas") => void
}) {
  return (
    <div
      className={`${collapsed ? "w-16" : "w-56"
        } bg-white h-screen border-r border-slate-100 hidden md:flex flex-col fixed left-0 top-0 z-10 transition-all duration-300`}
    >
      <div className="h-16 flex items-center px-3 border-b border-slate-50">
        <button
          type="button"
          onClick={() => onToggle()}
          className="flex items-center gap-2 bg-transparent border-0 cursor-pointer w-full"
          title={collapsed ? "Expandir menu" : "Colapsar menu"}
        >
          {collapsed ? (
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <LexyLogoMark size={32} />
            </div>
          ) : (
            <>
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <LexyLogoMark size={32} />
              </div>
              <div className="text-[22px] leading-none font-bold tracking-tight">
                <span className="text-[#211F66]">lexy</span>
                <span className="bg-gradient-to-r from-[#4A2DDA] to-[#8B1CF6] bg-clip-text text-transparent">deudor</span>
              </div>
            </>
          )}
        </button>
      </div>

      <nav className="p-3 space-y-1 flex-1">
        <NavItem
          icon={<LayoutDashboard size={20} />}
          label="Home"
          collapsed={collapsed}
          active={activeSection === "home"}
          onClick={() => onSelectSection("home")}
        />
        <NavItem
          icon={<Users size={20} />}
          label="Clientes"
          collapsed={collapsed}
          active={activeSection === "clientes"}
          onClick={() => onSelectSection("clientes")}
        />

        <NavItem
          icon={<CheckCircle2 size={20} />}
          label="Tareas"
          collapsed={collapsed}
          active={activeSection === "tareas"}
          onClick={() => onSelectSection("tareas")}
        />
      </nav>
    </div>
  )
}
