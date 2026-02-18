"use client"

import { Search, Filter, ChevronRight, Home, ShieldCheck } from "lucide-react"
import { CLIENTS_DATA } from "@/lib/data"
import type { Client } from "@/lib/data"
import { HealthAvatar, MiniPipeline } from "./shared"

function getProtectionStatus(client: Client): "PP en curso" | "PP exitosa" | "Sin PP" {
  if (!client.protectionData.isActive || client.protectionData.contracts.length === 0) {
    return "Sin PP"
  }

  const allContractsFinished = client.protectionData.contracts.every(
    (contract) => contract.currentStage >= 5
  )

  return allContractsFinished ? "PP exitosa" : "PP en curso"
}

function hasImmediateAction(client: Client) {
  const hasJudicialTaskToday = client.judicialData.tasks.some(
    (task) => task.status === "urgent" || task.due.toLowerCase() === "hoy"
  )

  const hasProtectionTaskToday = client.protectionData.contracts.some((contract) =>
    contract.tasks.some(
      (task) => task.status === "urgent" || task.due.toLowerCase() === "hoy"
    )
  )

  return hasJudicialTaskToday || hasProtectionTaskToday
}

export function ClientList({
  onSelectClient,
}: {
  onSelectClient: (client: Client) => void
}) {
  const immediateClients = CLIENTS_DATA.filter(hasImmediateAction)
  const followUpClients = CLIENTS_DATA.filter((client) => !hasImmediateAction(client))

  const renderClientCard = (client: Client) => {
    const ppStatus = getProtectionStatus(client)
    const statusStyles =
      ppStatus === "PP en curso"
        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
        : ppStatus === "PP exitosa"
          ? "bg-indigo-50 text-indigo-700 border-indigo-100"
          : "bg-slate-100 text-slate-500 border-slate-200"

    return (
      <button
        type="button"
        key={client.id}
        onClick={() => onSelectClient(client)}
        className="bg-white p-4 rounded-2xl border border-slate-100 hover:shadow-lg hover:border-violet-100 transition-all cursor-pointer group text-left w-full"
      >
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <div className="flex items-center gap-4 w-full md:w-1/3">
            <HealthAvatar
              initials={client.initials}
              health={client.health}
            />
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-950 transition-colors">
                {client.name}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {client.email}
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
                Proteccion Patrimonial
              </span>
              <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border text-sm font-semibold ${statusStyles}`}>
                {ppStatus === "PP exitosa" ? <ShieldCheck size={14} /> : <Home size={14} />}
                {ppStatus}
              </div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-indigo-500" />
          </div>
        </div>
      </button>
    )
  }

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
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-950/20 text-sm text-slate-800"
          />
        </div>
        <button
          type="button"
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          <Filter size={16} /> Filtros
        </button>
      </div>

      <div className="space-y-5">
        {immediateClients.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-rose-700 uppercase tracking-wide">
                Accion Inmediata
              </h3>
              <span className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-100 rounded-full px-2.5 py-1">
                {immediateClients.length}
              </span>
            </div>
            <div className="grid gap-3">
              {immediateClients.map(renderClientCard)}
            </div>
          </section>
        )}

        {followUpClients.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide">
                Seguimiento
              </h3>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-full px-2.5 py-1">
                {followUpClients.length}
              </span>
            </div>
            <div className="grid gap-3">
              {followUpClients.map(renderClientCard)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
