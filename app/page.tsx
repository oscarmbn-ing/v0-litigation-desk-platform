"use client"

import { useState } from "react"
import type { Client } from "@/lib/data"
import { Sidebar } from "@/components/desk/sidebar"
import { ClientList } from "@/components/desk/client-list"
import { ClientDetail } from "@/components/desk/client-detail"

export default function Page() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [activeTab, setActiveTab] = useState<"list" | "detail">("list")

  const handleClientClick = (client: Client) => {
    setSelectedClient(client)
    setActiveTab("detail")
  }

  const handleBack = () => {
    setSelectedClient(null)
    setActiveTab("list")
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans pl-0 md:pl-20 lg:pl-64">
      <Sidebar />

      <header className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {activeTab === "list" ? "Radar de Clientes" : "Centro de Comando"}
          </h1>
          <p className="text-sm text-slate-500">
            {activeTab === "list"
              ? "Resumen operativo del dia"
              : "Gestion Integral"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-900">Jose Herrera</p>
            <p className="text-xs text-slate-500">Abogado Tramitador</p>
          </div>
          <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jose"
              alt="Avatar de Jose Herrera"
              className="w-full h-full"
            />
          </div>
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        {activeTab === "list" && (
          <ClientList onSelectClient={handleClientClick} />
        )}

        {activeTab === "detail" && selectedClient && (
          <ClientDetail client={selectedClient} onBack={handleBack} />
        )}
      </main>
    </div>
  )
}
