"use client"

import { Search, Filter, ChevronRight } from "lucide-react"
import { CLIENTS_DATA } from "@/lib/data"
import type { Client } from "@/lib/data"
import { HealthAvatar, MiniPipeline } from "./shared"

export function ClientList({
  onSelectClient,
}: {
  onSelectClient: (client: Client) => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm text-slate-800"
          />
        </div>
        <button
          type="button"
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          <Filter size={16} /> Filtros
        </button>
      </div>

      <div className="grid gap-3">
        {CLIENTS_DATA.map((client) => (
          <button
            type="button"
            key={client.id}
            onClick={() => onSelectClient(client)}
            className="bg-white p-4 rounded-2xl border border-slate-100 hover:shadow-lg hover:border-indigo-100 transition-all cursor-pointer group text-left w-full"
          >
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <div className="flex items-center gap-4 w-full md:w-1/3">
                <HealthAvatar
                  initials={client.initials}
                  health={client.health}
                />
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                    {client.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {client.activeCaseId} &bull; {client.activeCreditor}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center w-full md:w-1/3 border-l-0 md:border-l border-r-0 md:border-r border-slate-100 px-4 py-2 md:py-0">
                <span className="text-xs text-slate-400 mb-2 uppercase tracking-wide font-medium">
                  Progreso Judicial
                </span>
                <MiniPipeline
                  currentStage={client.judicialData.currentStage}
                />
              </div>
              <div className="flex items-center justify-between w-full md:w-1/3 pl-2">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-slate-400 font-bold mb-1">
                    Proxima Accion
                  </span>
                  <span className="text-sm font-medium text-slate-800">
                    {client.judicialData.nextAction}
                  </span>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-indigo-500" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
