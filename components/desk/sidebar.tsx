"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

import {
  LayoutDashboard,
  Users,
  CheckCircle2,
  LogOut,
} from "lucide-react"

const NAV_ITEMS = [
  { id: "home", label: "Home", href: "/", icon: LayoutDashboard },
  { id: "clientes", label: "Clientes", href: "/clientes", icon: Users },
  { id: "tareas", label: "Misiones", href: "/tareas", icon: CheckCircle2 },
] as const

function NavItem({
  icon,
  label,
  href,
  active = false,
  collapsed = false,
}: {
  icon: React.ReactNode
  label: string
  href: string
  active?: boolean
  collapsed?: boolean
}) {
  return (
    <Link
      href={href}
      className={`relative w-full flex items-center py-2 rounded-lg overflow-hidden transition-colors duration-500 ease-out ${active
          ? "text-indigo-900"
          : "text-slate-400 hover:text-slate-600"
        }`}
      title={collapsed ? label : undefined}
    >
      {active && (
        <motion.div
          layoutId="nav-pill"
          className="absolute inset-0 rounded-lg bg-indigo-950/[0.06]"
          transition={{ type: "spring", stiffness: 250, damping: 28, mass: 0.8 }}
        />
      )}
      <div className="relative z-10 w-10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <span className={`relative z-10 text-sm font-medium whitespace-nowrap transition-opacity duration-300 ${collapsed ? "opacity-0" : "opacity-100"}`}>
        {label}
      </span>
    </Link>
  )
}

function UserMenu({ collapsed }: { collapsed: boolean }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  return (
    <div ref={menuRef} className="relative p-3 border-t border-slate-100">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center py-2 rounded-lg overflow-hidden transition-colors duration-200 hover:bg-slate-50 cursor-pointer"
        title={collapsed ? "Jose Herrera" : undefined}
      >
        <div className="w-10 flex items-center justify-center shrink-0">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold">
            J
          </div>
        </div>
        <div className={`flex flex-col items-start whitespace-nowrap transition-opacity duration-300 ${collapsed ? "opacity-0" : "opacity-100"}`}>
          <span className="text-sm font-medium text-slate-700">Jose Herrera</span>
          <span className="text-xs text-slate-400">Abogado</span>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 left-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                // TODO: cerrar sesion
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-colors duration-200 cursor-pointer"
            >
              <LogOut size={16} />
              <span>Cerrar sesion</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  const pathname = usePathname()

  const getActiveSection = () => {
    if (pathname.startsWith("/clientes")) return "clientes"
    if (pathname.startsWith("/tareas")) return "tareas"
    return "home"
  }

  const activeSection = getActiveSection()

  return (
    <div
      className={`${collapsed ? "w-16" : "w-56"
        } bg-white h-screen border-r border-slate-100 hidden md:flex flex-col fixed left-0 top-0 z-10 transition-all duration-300`}
    >
      <button
        type="button"
        onClick={() => onToggle()}
        className="h-16 w-full flex items-center border-b border-slate-50 bg-transparent cursor-pointer overflow-hidden shrink-0 relative"
        style={{ paddingLeft: 18 }}
        title={collapsed ? "Expandir menu" : "Colapsar menu"}
      >
        <img
          src="/Recurso 8.svg"
          alt="Lexy Deudor"
          className={`h-7 w-auto shrink-0 transition-opacity duration-300 ${collapsed ? "opacity-0" : "opacity-100"}`}
        />
        <img
          src="/Asset 19.svg"
          alt="Lexy"
          className="h-7 w-auto shrink-0 absolute"
          style={{ left: 18 }}
        />
      </button>
      <div className="h-px mx-3 bg-slate-100" />

      <nav className="p-3 space-y-1 flex-1">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            icon={<item.icon size={20} />}
            label={item.label}
            href={item.href}
            collapsed={collapsed}
            active={activeSection === item.id}
          />
        ))}
      </nav>

      <UserMenu collapsed={collapsed} />
    </div>
  )
}
