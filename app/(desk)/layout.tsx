"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/desk/sidebar"
import { AIAssistant } from "@/components/desk/ai-assistant"
import { Scale, Building2, Landmark, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

function getHeaderContent(pathname: string) {
  if (pathname.startsWith("/tareas")) {
    return { title: "Misiones", subtitle: "Revision y accion sobre movimientos del expediente", showHeader: true, showLinks: true }
  }
  if (pathname.match(/^\/clientes\/\d+/)) {
    return { title: "", subtitle: "", showHeader: false, showLinks: false }
  }
  if (pathname.startsWith("/clientes")) {
    return { title: "", subtitle: "", showHeader: false, showLinks: false }
  }
  return { title: "", subtitle: "", showHeader: false, showLinks: false }
}

export default function DeskLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const pathname = usePathname()
  const { title, subtitle, showHeader, showLinks } = getHeaderContent(pathname)

  return (
    <div
      className="bg-slate-50 min-h-screen text-slate-800 font-sans transition-all duration-300"
      style={{ paddingLeft: sidebarCollapsed ? "4rem" : "14rem" }}
    >
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {showHeader && (
        <header className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{title}</h1>
            <p className="text-sm text-slate-500">{subtitle}</p>
          </div>

          {showLinks && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-slate-600 hover:text-indigo-900 hover:bg-indigo-50"
                onClick={() => window.open("https://oficinajudicialvirtual.pjud.cl/home/index.php#", "_blank")}
                title="Oficina Judicial Virtual"
              >
                <Scale className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">OJV</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-slate-600 hover:text-emerald-900 hover:bg-emerald-50"
                onClick={() => window.open("https://homer.sii.cl/", "_blank")}
                title="Servicio de Impuestos Internos"
              >
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">SII</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-slate-600 hover:text-rose-900 hover:bg-rose-50"
                onClick={() => window.open("https://www.cmfchile.cl/", "_blank")}
                title="Comisión para el Mercado Financiero"
              >
                <Landmark className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">CMF</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-slate-600 hover:text-amber-900 hover:bg-amber-50"
                onClick={() => window.open("https://www.boletinconcursal.cl/boletin/procedimientos", "_blank")}
                title="Boletín Concursal"
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">BCL</span>
              </Button>
            </div>
          )}
        </header>
      )}

      <main className={`px-6 md:px-10 lg:px-16 max-w-7xl mx-auto ${showHeader ? "pt-4 md:pt-6 lg:pt-8 pb-4" : pathname === "/" ? "flex items-center min-h-screen py-6" : "pt-4 md:pt-6 lg:pt-8 pb-4 h-screen overflow-hidden"}`}>
        {children}
      </main>

      <AIAssistant />
    </div>
  )
}
