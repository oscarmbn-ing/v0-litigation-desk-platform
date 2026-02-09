"use client"

import React from "react"

import {
  Clock,
  FileCheck,
  FileText,
  AlertCircle,
  CheckCircle2,
  Gavel,
  Eye,
  Hammer,
  Book,
  FolderOpen,
  AlertTriangle,
} from "lucide-react"
import type { JudicialData, Stage, HistoryEvent } from "@/lib/data"

const iconMap: Record<string, React.ReactNode> = {
  gavel: <Gavel size={16} />,
  doc: <FileText size={16} />,
  alert: <AlertCircle size={16} />,
  check: <CheckCircle2 size={16} />,
  eye: <Eye size={16} />,
  edit: <FileText size={16} />,
  hammer: <Hammer size={16} />,
}

export function StageDetailPanel({
  stageId,
  judicialData,
  isActiveStage,
  stages,
  activeNotebook,
  onNotebookChange,
}: {
  stageId: number
  judicialData: JudicialData
  isActiveStage: boolean
  stages: Stage[]
  activeNotebook: "principal" | "apremio" | "terceria"
  onNotebookChange: (nb: "principal" | "apremio" | "terceria") => void
}) {
  let history: HistoryEvent[] = []
  let notebookStatus = ""

  if (activeNotebook === "principal") {
    history = judicialData.notebooks.principal.history[stageId] || []
    notebookStatus = judicialData.notebooks.principal.status
  } else if (activeNotebook === "apremio") {
    history = (judicialData.notebooks.apremio.history as HistoryEvent[]) || []
    notebookStatus = judicialData.notebooks.apremio.status
  } else if (activeNotebook === "terceria") {
    history = (judicialData.notebooks.terceria.history as HistoryEvent[]) || []
    notebookStatus = judicialData.notebooks.terceria.status
  }

  const stageInfo = stages.find((s) => s.id === stageId)

  return (
    <div className="bg-white rounded-2xl border border-indigo-100 shadow-lg shadow-indigo-900/5 mt-4 relative overflow-hidden flex flex-col">
      {/* Notebook tabs */}
      <div className="bg-slate-50 border-b border-indigo-50 px-6 pt-4 flex gap-1">
        <button
          type="button"
          onClick={() => onNotebookChange("principal")}
          className={`px-4 py-2 rounded-t-lg text-sm font-bold flex items-center gap-2 transition-all ${
            activeNotebook === "principal"
              ? "bg-white text-indigo-700 border-t border-x border-indigo-100 shadow-sm relative top-[1px]"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          }`}
        >
          <Book size={16} /> C. Principal
        </button>
        <button
          type="button"
          onClick={() => onNotebookChange("apremio")}
          className={`px-4 py-2 rounded-t-lg text-sm font-bold flex items-center gap-2 transition-all ${
            activeNotebook === "apremio"
              ? "bg-white text-rose-700 border-t border-x border-rose-100 shadow-sm relative top-[1px]"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          }`}
        >
          <Hammer size={16} /> C. Apremio
          {judicialData.notebooks.apremio.isActive && (
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>
        <button
          type="button"
          onClick={() => onNotebookChange("terceria")}
          className={`px-4 py-2 rounded-t-lg text-sm font-bold flex items-center gap-2 transition-all ${
            activeNotebook === "terceria"
              ? "bg-white text-amber-700 border-t border-x border-amber-100 shadow-sm relative top-[1px]"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          }`}
        >
          <FolderOpen size={16} /> Incidentes/Terc.
        </button>
      </div>

      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                activeNotebook === "apremio"
                  ? "bg-rose-100 text-rose-700"
                  : "bg-indigo-100 text-indigo-700"
              }`}
            >
              {activeNotebook === "apremio" ? (
                <AlertTriangle size={20} />
              ) : isActiveStage ? (
                <Clock size={20} />
              ) : (
                <FileCheck size={20} />
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                {activeNotebook === "principal"
                  ? `Bitacora: ${stageInfo?.label}`
                  : `Cuaderno de ${activeNotebook.charAt(0).toUpperCase() + activeNotebook.slice(1)}`}
              </h3>
              <p className="text-sm text-slate-500">
                {activeNotebook === "principal"
                  ? isActiveStage
                    ? "Etapa en curso - Gestion activa"
                    : "Etapa finalizada - Historial"
                  : `Estado actual: ${notebookStatus}`}
              </p>
            </div>
          </div>
          {activeNotebook !== "principal" && (
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                activeNotebook === "apremio"
                  ? "bg-rose-100 text-rose-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {notebookStatus.toUpperCase()}
            </span>
          )}
        </div>

        {/* Timeline */}
        <div className="space-y-0 relative z-10">
          {history.length > 0 ? (
            history.map((event, idx) => (
              <div key={`${event.date}-${idx}`} className="flex gap-4 relative group">
                {idx !== history.length - 1 && (
                  <div className="absolute left-[19px] top-8 bottom-0 w-0.5 bg-slate-200 group-hover:bg-indigo-200 transition-colors" />
                )}
                <div
                  className={`w-10 h-10 rounded-full bg-white border-2 flex items-center justify-center shrink-0 z-10 transition-all ${
                    activeNotebook === "apremio"
                      ? "border-rose-100 text-rose-400 group-hover:border-rose-300 group-hover:text-rose-600"
                      : "border-slate-200 text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-600"
                  }`}
                >
                  {iconMap[event.icon] || <FileText size={16} />}
                </div>
                <div className="pb-6 w-full">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-slate-800">
                      {event.title}
                    </p>
                    <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                      {event.date}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{event.desc}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
              {isActiveStage && activeNotebook === "principal"
                ? "Iniciando gestion..."
                : "Sin registros en este cuaderno."}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
