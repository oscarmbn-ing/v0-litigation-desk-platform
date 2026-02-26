"use client"

import React, { useState } from "react"

import {
  Clock,
  FileCheck,
  FileText,
  AlertCircle,
  CheckCircle2,
  Gavel,
  Eye,
  Hammer,
  FolderOpen,
  AlertTriangle,
  Mail,
  Upload,
  FileIcon,
  User,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"
import type { JudicialData, Stage, HistoryEvent } from "@/lib/data"

const iconMap: Record<string, React.ReactNode> = {
  gavel: <Gavel size={18} />,
  doc: <FileText size={18} />,
  alert: <AlertCircle size={18} />,
  check: <CheckCircle2 size={18} />,
  eye: <Eye size={18} />,
  edit: <FileText size={18} />,
  hammer: <Hammer size={18} />,
  mail: <Mail size={18} />,
  upload: <Upload size={18} />,
}

export function StageDetailPanel({
  stageId,
  judicialData,
  isActiveStage,
  stages,
  activeNotebook,
  onNotebookChange,
  inline = false,
}: {
  stageId: number
  judicialData: JudicialData
  isActiveStage: boolean
  stages: Stage[]
  activeNotebook: "principal" | "apremio" | "terceria"
  onNotebookChange: (nb: "principal" | "apremio" | "terceria") => void
  inline?: boolean
}) {
  let history: HistoryEvent[] = []
  let notebookStatus = ""

  if (activeNotebook === "principal") {
    // Obtener eventos de la etapa seleccionada
    const stageHistory = judicialData.notebooks.principal.history[stageId]
    history = stageHistory ? [...stageHistory] : []
    notebookStatus = judicialData.notebooks.principal.status
  } else if (activeNotebook === "apremio") {
    history = (judicialData.notebooks.apremio.history as HistoryEvent[]) || []
    notebookStatus = judicialData.notebooks.apremio.status
  } else if (activeNotebook === "terceria") {
    history = (judicialData.notebooks.terceria.history as HistoryEvent[]) || []
    notebookStatus = judicialData.notebooks.terceria.status
  }

  // Ordenar por fecha descendente (más reciente primero)
  history = history.sort((a, b) => {
    const dateA = a.date.split('/').reverse().join('')
    const dateB = b.date.split('/').reverse().join('')
    return dateB.localeCompare(dateA)
  })

  const stageInfo = stages.find((s) => s.id === stageId)

  const content = (
    <>
      {/* Header con título y tabs */}
      <div className={inline ? "px-6 pt-6 pb-4" : "px-6 pt-6 pb-4"}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-xl">
              Bitácora: {stageInfo?.label}
            </h3>
            <p className="text-sm text-slate-500">
              Historial de eventos
            </p>
          </div>
            
            {/* Notebook tabs */}
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => onNotebookChange("principal")}
                className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition-all ${
                  activeNotebook === "principal"
                    ? "bg-indigo-950 text-white shadow-sm hover:bg-indigo-950"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"
                }`}
              >
                C. Principal
              </button>
              <button
                type="button"
                onClick={() => onNotebookChange("apremio")}
                className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition-all ${
                  activeNotebook === "apremio"
                    ? "bg-indigo-950 text-white shadow-sm hover:bg-indigo-950"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"
                }`}
              >
                C. Apremio
              </button>
              <button
                type="button"
                onClick={() => onNotebookChange("terceria")}
                className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition-all ${
                  activeNotebook === "terceria"
                    ? "bg-indigo-950 text-white shadow-sm hover:bg-indigo-950"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"
                }`}
              >
                C. Incidente
              </button>
            </div>
          </div>
        </div>

        {/* Timeline de eventos - Cards */}
        <div className="px-6 pb-6">
          <TooltipProvider>
            <div className="space-y-3">
              {history.length > 0 ? (
                history.map((event, idx) => (
                  <div key={`${event.date}-${idx}`} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-start gap-4">
                    {/* Icono según categoría */}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        event.category === "presentacion" ? "bg-violet-50 text-indigo-950" :
                        event.category === "resolucion" ? "bg-slate-100 text-slate-600" :
                        event.category === "comunicacion" ? "bg-amber-50 text-amber-600" :
                        "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {event.category === "comunicacion" ? <Mail size={18} /> : iconMap[event.icon] || <FileText size={18} />}
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-slate-900">
                          {event.title}
                        </p>

                        {/* Tooltip del responsable - solo ícono */}
                        {event.responsible && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-700 text-white cursor-help">
                                <User size={12} />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-semibold">
                                {event.responsible.role === "abogado" ? "Abogado" : "Ejecutivo"}: {event.responsible.name}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{event.desc}</p>
                    </div>

                    {/* Fecha y link */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-slate-900">
                        {event.date}
                      </p>
                      {event.hasDocument && (
                        <button
                          type="button"
                          className="text-sm text-indigo-950 hover:underline bg-transparent border-0 cursor-pointer mt-0.5"
                        >
                          Ver documento
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  {isActiveStage && activeNotebook === "principal"
                    ? "Iniciando gestión..."
                    : "Sin registros en este cuaderno"}
                </div>
              )}
            </div>
          </TooltipProvider>
        </div>
    </>
  )

  if (inline) {
    return <div className="border-t border-slate-200 mt-6">{content}</div>
  }

  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        {content}
      </CardContent>
    </Card>
  )
}
