"use client"

import React from "react"
import {
  FileText,
  CheckCircle2,
  Eye,
  Mail,
  Upload,
  User,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"
import type { ContractData, HistoryEvent, Stage } from "@/lib/data"

const iconMap: Record<string, React.ReactNode> = {
  doc: <FileText size={18} />,
  check: <CheckCircle2 size={18} />,
  eye: <Eye size={18} />,
  mail: <Mail size={18} />,
  upload: <Upload size={18} />,
}

export function ProtectionStageDetailPanel({
  stageId,
  contractData,
  isActiveStage,
  stages,
  inline = false,
}: {
  stageId: number
  contractData: ContractData
  isActiveStage: boolean
  stages: Stage[]
  inline?: boolean
}) {
  const stageHistory = contractData.history[stageId]
  let history: HistoryEvent[] = stageHistory ? [...stageHistory] : []

  history = history.sort((a, b) => {
    const dateA = a.date.split("/").reverse().join("")
    const dateB = b.date.split("/").reverse().join("")
    return dateB.localeCompare(dateA)
  })

  const stageInfo = stages.find((s) => s.id === stageId)

  const content = (
    <>
      <div className={inline ? "px-6 pt-6 pb-4" : "px-6 pt-6 pb-4"}>
        <div className="flex flex-col gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-xl">
              Bitácora: {stageInfo?.label}
            </h3>
            <p className="text-sm text-slate-500">Historial de eventos</p>
          </div>
        </div>
      </div>

        <div className="px-6 pb-6">
          <TooltipProvider>
            <div className="space-y-3">
              {history.length > 0 ? (
                history.map((event, idx) => (
                  <div
                    key={`${event.date}-${idx}`}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-start gap-4"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        event.type === "presentacion"
                          ? "bg-emerald-50 text-emerald-700"
                          : event.type === "resolucion"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-cyan-50 text-cyan-700"
                      }`}
                    >
                      {iconMap[event.icon] || <FileText size={18} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-slate-900">
                          {event.title}
                        </p>

                        {event.responsible && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-700 text-white cursor-help">
                                <User size={12} />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-semibold">
                                {event.responsible.role === "abogado"
                                  ? "Abogado"
                                  : event.responsible.role === "ejecutivo"
                                    ? "Ejecutivo"
                                    : "Sistema"}
                                : {event.responsible.name}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{event.desc}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-slate-900">
                        {event.date}
                      </p>
                      {event.hasDocument && (
                        <button
                          type="button"
                          className="text-sm text-emerald-700 hover:underline bg-transparent border-0 cursor-pointer mt-0.5"
                        >
                          Ver documento
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  {isActiveStage
                    ? "Iniciando gestión..."
                    : "Sin registros en esta etapa"}
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
