"use client"

import { useState, useEffect } from "react"
import type { Client } from "@/lib/data"
import { CLIENTS_DATA } from "@/lib/data" // Import data source
import { Sidebar } from "@/components/desk/sidebar"
import { ClientList } from "@/components/desk/client-list"
import { ClientDetail } from "@/components/desk/client-detail"
import { AIAssistant } from "@/components/desk/ai-assistant"
import { TasksView } from "@/components/desk/tasks-view"
import { HomeView } from "@/components/desk/home-view"
import { Scale, Building2, Landmark, ExternalLink, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation" // Import useSearchParams

import { Suspense } from "react" // Import Suspense

function PageContent() {
  const searchParams = useSearchParams()
  const initialView = searchParams.get("view")
  const initialClientId = searchParams.get("clientId")

  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [activeTab, setActiveTab] = useState<"list" | "detail">("list")
  const [activeSection, setActiveSection] = useState<
    "home" | "clientes" | "tareas"
  >("home")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [targetTaskId, setTargetTaskId] = useState<string | null>(null)

  useEffect(() => {
    if (initialView === "clients" && initialClientId) {
      const client = CLIENTS_DATA.find(c => c.id === Number(initialClientId))
      if (client) {
        setSelectedClient(client)
        setActiveSection("clientes")
        setActiveTab("detail")
      }
    }
  }, [initialView, initialClientId])

  const handleClientClick = (client: Client) => {
    setSelectedClient(client)
    setActiveTab("detail")
    setActiveSection("clientes")
  }

  const handleBack = () => {
    setSelectedClient(null)
    setActiveTab("list")
  }

  const handleNavigateToTask = (taskId: string) => {
    setTargetTaskId(taskId)
    setActiveSection("tareas")
  }

  return (
    <div
      className="bg-slate-50 min-h-screen text-slate-800 font-sans transition-all duration-300"
      style={{ paddingLeft: sidebarCollapsed ? "4rem" : "14rem" }}
    >
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeSection={activeSection}
        onSelectSection={(section) => {
          setActiveSection(section)
          if (section !== "clientes") {
            setActiveTab("list")
          }
        }}
      />

      <header className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {activeSection === "tareas"
              ? "Misiones"
              : activeSection === "home"
                ? "Inicio"
                : activeSection === "clientes" && activeTab === "detail"
                  ? "Centro de Comando"
                  : "Radar de Clientes"}
          </h1>
          <p className="text-sm text-slate-500">
            {activeSection === "tareas"
              ? "Revision y accion sobre movimientos del expediente"
              : activeSection === "home"
                ? "Panel general"
                : activeSection === "clientes" && activeTab === "detail"
                  ? "Gestion Integral"
                  : "Resumen operativo del dia"}
          </p>
        </div>

        {activeSection !== "home" && <div className="flex items-center gap-2">
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
        </div>}
      </header>

      <main className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
        {activeSection === "home" && (
          <HomeView
            onNavigate={(section) => {
              setActiveSection(section)
              if (section === "clientes") setActiveTab("list")
            }}
          />
        )}

        {activeSection === "tareas" && (
          <TasksView
            initialTaskId={targetTaskId}
            onOpenClient={(client) => {
              setSelectedClient(client)
              setActiveSection("clientes")
              setActiveTab("detail")
            }}
          />
        )}

        {activeSection === "clientes" && activeTab === "list" && (
          <ClientList onSelectClient={handleClientClick} />
        )}

        {activeSection === "clientes" && activeTab === "detail" && selectedClient && (
          <ClientDetail
            client={selectedClient}
            onBack={handleBack}
            onNavigateToTask={handleNavigateToTask}
          />
        )}
      </main>

      <AIAssistant />
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PageContent />
    </Suspense>
  )
}
