"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Scale,
  ShieldCheck,
  ShieldAlert,
  FolderOpen,
  ChevronDown,
  CheckCircle2,
  MessageCircle,
  Car,
  Home,
  Coins,
  ScrollText,
  Check,
  Clock3,
  X,
  Siren,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import type { Client, ContractData } from "@/lib/data"
import { JUDICIAL_STAGES, PROTECTION_STAGES } from "@/lib/data"
import { JourneyMap } from "./journey-map"
import { StageDetailPanel } from "./stage-detail-panel"
import { ProtectionStageDetailPanel } from "./protection-stage-detail-panel"
import { DossierWidget, ProtectionWidget, NotesWidget } from "./widgets"

function getContractIcon(type: string) {
  if (type.includes("Vehiculo"))
    return <Car size={16} className="text-emerald-600" />
  if (type.includes("Inmueble"))
    return <Home size={16} className="text-emerald-600" />
  if (type.includes("Acciones"))
    return <Coins size={16} className="text-emerald-600" />
  return <ScrollText size={16} className="text-emerald-600" />
}

const DESK_OPERATOR_NAME = "Jose Herrera"

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
}

function isTaskOwnedByDeskOperator(assignee: string) {
  return normalizeText(assignee) === normalizeText(DESK_OPERATOR_NAME)
}

export function ClientDetail({
  client,
  onBack,
  onNavigateToTask,
}: {
  client: Client
  onBack: () => void
  onNavigateToTask?: (taskId: string) => void
}) {
  const [contextView, setContextView] = useState<"judicial" | "protection">(
    "judicial"
  )
  const [viewingStageId, setViewingStageId] = useState<number | null>(
    client.judicialData.currentStage
  )
  const [activeNotebook, setActiveNotebook] = useState<
    "principal" | "apremio" | "terceria"
  >("principal")
  const [showCaseSelector, setShowCaseSelector] = useState(false)
  const [activeCaseId, setActiveCaseId] = useState(client.activeCaseId)
  const [showContractSelector, setShowContractSelector] = useState(false)
  const [showBitacoraModal, setShowBitacoraModal] = useState(false)
  const [showSummaryModal, setShowSummaryModal] = useState(false)
  const [bitacoraModalTab, setBitacoraModalTab] = useState<
    "litigios" | "renegociacion" | "patrimonial"
  >("litigios")
  const [expandedCaseIds, setExpandedCaseIds] = useState<string[]>([])
  const [openCaseDetails, setOpenCaseDetails] = useState<Record<string, boolean>>(
    Object.fromEntries(client.cases.map((c) => [c.id, true])) as Record<
      string,
      boolean
    >
  )
  const [openCaseBitacora, setOpenCaseBitacora] = useState<Record<string, boolean>>(
    Object.fromEntries(client.cases.map((c) => [c.id, false])) as Record<
      string,
      boolean
    >
  )
  const [activeContractId, setActiveContractId] = useState<string | null>(
    client.protectionData.contracts.length > 0
      ? client.protectionData.contracts[0].id
      : null
  )
  const [emailTo, setEmailTo] = useState(client.email)
  const [emailIntro, setEmailIntro] = useState(
    "Te compartimos un resumen breve con los ultimos movimientos de tu caso."
  )
  const [emailClosing, setEmailClosing] = useState(
    "Quedamos atentos a tus comentarios."
  )
  const [selectedSummaryIds, setSelectedSummaryIds] = useState<string[]>([])
  const [summaryScopeFilter, setSummaryScopeFilter] = useState<
    "all" | "judicial" | "protection"
  >("all")

  const activeCase = useMemo(
    () => client.cases.find((c) => c.id === activeCaseId) ?? client.cases[0],
    [activeCaseId, client.cases]
  )

  const getJudicialDataForCase = (caseId: string) => {
    const base = client.judicialData
    if (caseId === client.activeCaseId) return base

    const selectedCase = client.cases.find((c) => c.id === caseId)
    return {
      ...base,
      currentStage: 2,
      nextAction: "Presentar excepciones dilatorias",
      deadline: "5 dias",
      description: `Cliente demandado por ${selectedCase?.creditor ?? "acreedor"}. Defensa en etapa inicial para dilatar y negociar.`,
      caseNotes: `Expediente ${caseId}. Se inicia estrategia de defensa y monitoreo de escritos.`,
      tasks: base.tasks.slice(0, 1),
      notebooks: {
        ...base.notebooks,
        principal: {
          ...base.notebooks.principal,
          status: "Redaccion",
        },
        apremio: {
          ...base.notebooks.apremio,
          status: "No iniciado",
          isActive: false,
          history: [],
        },
        terceria: {
          ...base.notebooks.terceria,
          status: "No iniciada",
          isActive: false,
          history: [],
        },
      },
    }
  }

  const activeJudicialData = useMemo(
    () => getJudicialDataForCase(activeCaseId),
    [activeCaseId, client.activeCaseId, client.cases, client.judicialData]
  )

  const handleContextChange = (context: "judicial" | "protection") => {
    setContextView(context)
    if (context === "judicial") {
      setViewingStageId(activeJudicialData.currentStage)
    } else {
      const currentContract = client.protectionData.contracts.find(
        (c) => c.id === activeContractId
      )
      setViewingStageId(currentContract?.currentStage ?? 1)
    }
  }

  const handleContractChange = (contractId: string) => {
    setActiveContractId(contractId)
    setShowContractSelector(false)
    const newContract = client.protectionData.contracts.find(
      (c) => c.id === contractId
    )
    if (newContract) {
      setViewingStageId(newContract.currentStage)
    }
  }

  const handleCaseChange = (caseId: string) => {
    setActiveCaseId(caseId)
    setShowCaseSelector(false)
    setActiveNotebook("principal")
    if (contextView === "judicial") {
      setViewingStageId(getJudicialDataForCase(caseId).currentStage)
    }
  }

  const toggleCaseExpanded = (caseId: string) => {
    setExpandedCaseIds((prev) =>
      prev.includes(caseId)
        ? prev.filter((id) => id !== caseId)
        : [...prev, caseId]
    )
  }

  const getCaseTypeLabel = (caseId: string) =>
    caseId === client.activeCaseId ? "Juicio Ejecutivo" : "Juicio Ordinario"

  const parseDate = (date: string) => {
    const [day, month, year] = date.split("/").map((v) => Number(v))
    return new Date(year, month - 1, day).getTime()
  }

  const getTimelineRows = (caseId: string) => {
    const caseData = getJudicialDataForCase(caseId)

    const principalRows = Object.values(caseData.notebooks.principal.history)
      .flat()
      .map((event) => ({ event, notebook: "principal" as const }))

    const apremioRows = (Array.isArray(caseData.notebooks.apremio.history)
      ? caseData.notebooks.apremio.history
      : []
    ).map((event) => ({ event, notebook: "apremio" as const }))

    const incidenteRows = (Array.isArray(caseData.notebooks.terceria.history)
      ? caseData.notebooks.terceria.history
      : []
    ).map((event) => ({ event, notebook: "incidente" as const }))

    return [...principalRows, ...apremioRows, ...incidenteRows]
      .sort((a, b) => parseDate(a.event.date) - parseDate(b.event.date))
      .map(({ event, notebook }) => {
        const cuaderno =
          notebook === "apremio"
            ? "Apremio"
            : notebook === "incidente"
              ? "Incidente"
              : event.type === "comunicacion"
                ? "Receptor"
                : "Principal"

        const tipo =
          event.type === "resolucion"
            ? "Resolución"
            : event.type === "presentacion"
              ? "Presentación"
              : "Tarea interna"

        const raw = `${event.title} ${event.desc}`.toLowerCase()
        const estado = raw.includes("frustrado") || raw.includes("imposible")
          ? "imposible"
          : event.hasDocument
            ? "ejecutado"
            : "pendiente"

        return {
          date: event.date,
          task: event.title,
          cuaderno,
          tipo,
          responsible: event.responsible?.name ?? "Automática",
          estado,
          hasDocument: Boolean(event.hasDocument),
        }
      })
  }

  let currentData: (typeof client.judicialData | ContractData) | null = null
  if (contextView === "judicial") {
    currentData = activeJudicialData
  } else {
    currentData =
      client.protectionData.contracts.find(
        (c) => c.id === activeContractId
      ) ?? null
  }

  const currentStages =
    contextView === "judicial" ? JUDICIAL_STAGES : PROTECTION_STAGES
  const currentTheme = contextView === "judicial" ? "indigo" : "emerald"

  const summaryMovements = useMemo(() => {
    const parse = (date: string) => {
      const [day, month, year] = date.split("/").map(Number)
      return new Date(year, month - 1, day).getTime()
    }

    const judicialRows = [
      ...Object.entries(activeJudicialData.notebooks.principal.history).flatMap(
        ([stage, events], groupIdx) =>
          events.map((event, idx) => ({
            id: `j-p-${stage}-${idx}-${event.date}-${groupIdx}`,
            title: event.title,
            desc: event.desc,
            date: event.date,
            source: "Principal",
            scope: "judicial" as const,
          }))
      ),
      ...(Array.isArray(activeJudicialData.notebooks.apremio.history)
        ? activeJudicialData.notebooks.apremio.history
        : []
      ).map((event, idx) => ({
        id: `j-a-${idx}-${event.date}`,
        title: event.title,
        desc: event.desc,
        date: event.date,
        source: "Apremio",
        scope: "judicial" as const,
      })),
      ...(Array.isArray(activeJudicialData.notebooks.terceria.history)
        ? activeJudicialData.notebooks.terceria.history
        : []
      ).map((event, idx) => ({
        id: `j-i-${idx}-${event.date}`,
        title: event.title,
        desc: event.desc,
        date: event.date,
        source: "Incidente",
        scope: "judicial" as const,
      })),
    ]

    const protectionRows = client.protectionData.contracts.flatMap((contract) =>
      Object.entries(contract.history).flatMap(([stage, events], groupIdx) =>
        events.map((event, idx) => ({
          id: `p-${contract.id}-${stage}-${idx}-${event.date}-${groupIdx}`,
          title: event.title,
          desc: event.desc,
          date: event.date,
          source: "Contrato",
          scope: "protection" as const,
        }))
      )
    )

    const allRows = [...judicialRows, ...protectionRows]
      .sort((a, b) => parse(b.date) - parse(a.date))
      .slice(0, 30)

    const uniqueRows = allRows.filter((row, index, arr) => {
      const key = `${row.scope}|${row.source}|${row.date}|${row.title.trim().toLowerCase()}|${row.desc
        .trim()
        .toLowerCase()}`
      return (
        index ===
        arr.findIndex((candidate) => {
          const candidateKey = `${candidate.scope}|${candidate.source}|${candidate.date}|${candidate.title
            .trim()
            .toLowerCase()}|${candidate.desc.trim().toLowerCase()}`
          return candidateKey === key
        })
      )
    })

    return uniqueRows
  }, [activeJudicialData, client.protectionData.contracts])

  const filteredSummaryMovements = useMemo(() => {
    if (summaryScopeFilter === "all") return summaryMovements
    return summaryMovements.filter((movement) => movement.scope === summaryScopeFilter)
  }, [summaryMovements, summaryScopeFilter])

  useEffect(() => {
    if (!showSummaryModal) return
    setSummaryScopeFilter("all")
    setEmailTo(client.email)
    setEmailIntro("Te compartimos un resumen breve con los ultimos movimientos de tu caso.")
    setEmailClosing("Quedamos atentos a tus comentarios.")
    setSelectedSummaryIds(summaryMovements.slice(0, 4).map((m) => m.id))
  }, [showSummaryModal, client.email, client.name, contextView, summaryMovements])

  useEffect(() => {
    if (!showBitacoraModal) return
    setExpandedCaseIds([])
    setOpenCaseDetails(Object.fromEntries(client.cases.map((c) => [c.id, false])))
    setOpenCaseBitacora(Object.fromEntries(client.cases.map((c) => [c.id, false])))
  }, [showBitacoraModal])

  const selectedSummaryMovements = summaryMovements.filter((movement) =>
    selectedSummaryIds.includes(movement.id)
  )

  const buildClientSummary = (movement: {
    title: string
    desc: string
    source: string
  }) => {
    const title = movement.title.toLowerCase()
    const desc = movement.desc.toLowerCase()

    if (title.includes("correo") || title.includes("comunic")) {
      return "Informamos y coordinamos comunicacion con las partes involucradas para mantener tu caso al dia."
    }
    if (title.includes("resolucion") || title.includes("apercib")) {
      return "Revisamos una resolucion del tribunal y activamos las gestiones necesarias para cumplir dentro de plazo."
    }
    if (title.includes("presentacion") || title.includes("escrito")) {
      return "Preparamos y presentamos un escrito en tu defensa para sostener la estrategia definida."
    }
    if (title.includes("embargo") || desc.includes("embargo")) {
      return "Gestionamos una incidencia de embargo y dejamos registro de la accion para definir el siguiente paso."
    }

    return "Realizamos una gestion relevante del caso y dejamos respaldo para continuar con la siguiente accion."
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-sm text-slate-500 hover:text-indigo-950 flex items-center gap-1 bg-transparent border-0 cursor-pointer"
      >
        &larr; Volver al radar
      </button>

      {/* Header + Context Switch */}
      <Card className="rounded-3xl shadow-sm border border-slate-200 mb-6 relative z-10 overflow-visible">
        <div
          className={`absolute top-0 left-0 w-full h-1 rounded-t-3xl ${contextView === "judicial"
            ? "bg-gradient-to-r from-indigo-950 via-violet-900 to-indigo-950"
            : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"
            }`}
        />
        <CardContent className="p-8 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {client.name}
                </h2>
                <a
                  href={`https://wa.me/56912345678`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-500 hover:text-emerald-600 transition-colors"
                >
                  <MessageCircle size={24} fill="currentColor" className="text-white" strokeWidth={0} />
                  <MessageCircle size={24} className="absolute -mt-6" />
                </a>
              </div>

              {/* Dynamic selector */}
              <div className="flex items-center gap-2 mt-1 relative">
                {contextView === "judicial" && (
                  <>
                    <button
                      type="button"
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${client.cases.length > 1
                        ? "cursor-pointer hover:bg-slate-50 border-violet-200 bg-white shadow-sm"
                        : "border-transparent bg-slate-50 text-slate-500"
                        }`}
                      onClick={() =>
                        client.cases.length > 1 &&
                        setShowCaseSelector(!showCaseSelector)
                      }
                    >
                      <FolderOpen size={16} className="text-indigo-950" />
                      <span className="text-sm font-mono font-bold text-slate-800">
                        {activeCaseId}
                      </span>
                      <span className="text-sm text-slate-400">|</span>
                      <span className="text-sm text-slate-600 font-medium">
                        {activeCase?.creditor ?? client.activeCreditor}
                      </span>
                      {client.cases.length > 1 && (
                        <ChevronDown
                          size={14}
                          className={`text-slate-400 transition-transform ${showCaseSelector ? "rotate-180" : ""}`}
                        />
                      )}
                    </button>
                    {showCaseSelector && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                        <div className="px-4 py-2 border-b border-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Cambiar Expediente
                        </div>
                        {client.cases.map((c) => (
                          <button
                            type="button"
                            key={c.id}
                            className={`w-full text-left px-4 py-3 text-sm cursor-pointer transition-colors ${c.id === activeCaseId
                              ? "bg-indigo-50 text-indigo-900 font-semibold"
                              : "hover:bg-slate-50 text-slate-700"
                              }`}
                            onClick={() => handleCaseChange(c.id)}
                          >
                            {c.id} - {c.creditor}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {contextView === "protection" && currentData && (
                  <>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-all text-sm font-medium shadow-sm"
                      onClick={() =>
                        setShowContractSelector(!showContractSelector)
                      }
                    >
                      {contextView === "protection" && <CheckCircle2 size={14} className="text-emerald-500" />}
                      <span className="font-semibold text-slate-800">
                        {(currentData as ContractData).type}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span>{(currentData as ContractData).detail}</span>

                      <ChevronDown
                        size={14}
                        className={`text-slate-400 ml-1 transition-transform ${showContractSelector ? "rotate-180" : ""}`}
                      />
                    </button>

                    {showContractSelector && (
                      <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-emerald-100 py-2 z-50">
                        <div className="px-4 py-2 border-b border-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Seleccionar Contrato Activo
                        </div>
                        {client.protectionData.contracts.map((contract) => (
                          <button
                            type="button"
                            key={contract.id}
                            onClick={() => handleContractChange(contract.id)}
                            className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-emerald-50 transition-colors ${contract.id === activeContractId ? "bg-emerald-50" : ""}`}
                          >
                            <div className="p-2 bg-white border border-slate-100 rounded-lg shrink-0">
                              {getContractIcon(contract.type)}
                            </div>
                            <div>
                              <p
                                className={`font-bold ${contract.id === activeContractId ? "text-emerald-700" : "text-slate-700"}`}
                              >
                                {contract.type}
                              </p>
                              <p className="text-xs text-slate-500">
                                {contract.detail}
                              </p>
                            </div>
                            {contract.id === activeContractId && (
                              <CheckCircle2
                                size={16}
                                className="ml-auto text-emerald-600"
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Context switch */}
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => handleContextChange("judicial")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${contextView === "judicial"
                  ? "bg-indigo-950 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"
                  }`}
              >
                Litigios
              </button>
              <button
                type="button"
                onClick={() => handleContextChange("protection")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${contextView === "protection"
                  ? "bg-white text-slate-900 border border-slate-200 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"
                  }`}
              >
                P. Patrimonial
              </button>
            </div>
          </div>

          {/* Journey Map or Inactive State */}
          {contextView === "protection" && !client.protectionData.isActive ? (
            <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 text-center">
              <ShieldAlert className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-slate-500 font-medium">
                Este servicio no esta activo para este cliente.
              </p>
              <button
                type="button"
                className="mt-2 text-indigo-950 text-sm font-bold hover:underline bg-transparent border-0 cursor-pointer"
              >
                Activar servicio
              </button>
            </div>
          ) : (
            <>
              <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100 transition-all">
                <JourneyMap
                  stages={currentStages}
                  currentStage={currentData?.currentStage || 1}
                  selectedStageId={viewingStageId}
                  onSelectStage={setViewingStageId}
                  themeColor={currentTheme}
                  stageDates={currentData?.stageDates}
                />

                <div className="mt-6 pt-4 border-t border-slate-200">
                  {contextView === "judicial" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-slate-600">
                      <p>
                        <span className="font-bold text-slate-900">Tribunal: </span>
                        1° Juzgado Civil de Santiago
                      </p>
                      <p className="md:text-right">
                        <span className="font-bold text-slate-900">Tipo reclamación: </span>
                        Dilatoria a secas
                      </p>
                      <p>
                        <span className="font-bold text-slate-900">Acreedor: </span>
                        {activeCase?.creditor ?? client.activeCreditor}
                      </p>
                      <p className="md:text-right">
                        <span className="font-bold text-slate-900">Índice de riesgo: </span>
                        {client.health === "critical" ? "Crítico" :
                          client.health === "warning" ? "Precaución" :
                            "Estable"}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-slate-600">
                      <p>
                        <span className="font-bold text-slate-900">Registro: </span>
                        {(currentData as ContractData)?.type?.toLowerCase().includes("vehiculo")
                          ? "Registro de Vehículos Motorizados"
                          : "Conservador de Bienes Raíces de Santiago"}
                      </p>
                      <p className="md:text-right">
                        <span className="font-bold text-slate-900">Índice de riesgo: </span>
                        {client.health === "critical" ? "Crítico" :
                          client.health === "warning" ? "Precaución" :
                            "Estable"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {viewingStageId && contextView === "judicial" ? (
                <div className="mt-6 animate-in slide-in-from-top-4 duration-500 fade-in">
                  <div className="flex justify-center mb-2">
                    <ChevronDown className="text-slate-300 animate-bounce" />
                  </div>
                  <StageDetailPanel
                    stageId={viewingStageId}
                    judicialData={activeJudicialData}
                    isActiveStage={
                      viewingStageId === activeJudicialData.currentStage
                    }
                    stages={currentStages}
                    activeNotebook={activeNotebook}
                    onNotebookChange={setActiveNotebook}
                  />
                </div>
              ) : null}

              {viewingStageId &&
                contextView === "protection" &&
                currentData && (
                  <div className="mt-6 animate-in slide-in-from-top-4 duration-500 fade-in">
                    <div className="flex justify-center mb-2">
                      <ChevronDown className="text-slate-300 animate-bounce" />
                    </div>
                    <ProtectionStageDetailPanel
                      stageId={viewingStageId}
                      contractData={currentData as ContractData}
                      isActiveStage={
                        viewingStageId === (currentData as ContractData).currentStage
                      }
                      stages={currentStages}
                    />
                  </div>
                )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Misiones activas - Full width */}
      <Card className="rounded-2xl shadow-sm border border-slate-200 mb-6">
        <CardContent className="p-6">
          <div className="mb-1">
            <h3 className="text-lg font-bold text-slate-900">Misiones activas</h3>
            <p className="text-sm text-slate-500">Tareas pendientes</p>
          </div>

          {currentData && "tasks" in currentData && currentData.tasks.length > 0 ? (
            <div className="mt-4 space-y-3">
              {currentData.tasks
                .sort((a, b) => {
                  const aIsOwner = isTaskOwnedByDeskOperator(a.assignee)
                  const bIsOwner = isTaskOwnedByDeskOperator(b.assignee)
                  if (aIsOwner && !bIsOwner) return -1
                  if (!aIsOwner && bIsOwner) return 1

                  if (a.status === "urgent" && b.status !== "urgent") return -1
                  if (a.status !== "urgent" && b.status === "urgent") return 1

                  return 0
                })
                .map((task) => {
                  const isMovement = task.title === "Movimiento detectado"
                  const isOwner = isTaskOwnedByDeskOperator(task.assignee)
                  return (
                    <div
                      key={task.id}
                      className={cn(
                        "flex items-center justify-between py-3 border-b last:border-0",
                        isMovement
                          ? "bg-indigo-50/50 -mx-3 px-3 rounded-lg border-indigo-100"
                          : "border-slate-100"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-lg",
                            isMovement ? "bg-indigo-100" : "bg-slate-100"
                          )}
                        >
                          {isMovement ? (
                            <Siren size={16} className="text-indigo-600" />
                          ) : (
                            <ScrollText size={16} className="text-slate-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-slate-900">
                            {task.title}
                          </h4>
                          <p className="text-xs text-slate-500">
                            {task.assignee}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-xs font-bold ${task.status === "urgent"
                            ? "text-rose-600"
                            : "text-slate-600"
                            }`}
                        >
                          {task.status === "urgent" ? "Hoy" : task.due}
                        </span>
                        {isOwner ? (
                          <div
                            className="text-xs text-indigo-950 hover:underline cursor-pointer mt-0.5 font-medium"
                            onClick={() => onNavigateToTask?.(String(task.id))}
                          >
                            Ir a movimiento
                          </div>
                        ) : (
                          <p className="text-xs text-slate-300 cursor-not-allowed mt-0.5">
                            Ir a movimiento
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic mt-4">
              Sin tareas activas para este item.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Info Grid - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-0">
        {/* Left column: Estrategias y tácticas */}
        <div>
          {contextView === "judicial" && currentData ? (
            <DossierWidget
              description={(currentData as typeof client.judicialData).description}
              strategy={(currentData as typeof client.judicialData).strategy}
              tactics={(currentData as typeof client.judicialData).tactics}
              debtAmount={(currentData as typeof client.judicialData).debtAmount}
              client={client}
            />
          ) : currentData ? (
            <ProtectionWidget contractData={currentData as ContractData} />
          ) : null}
        </div>

        {/* Right column: Notas + Herramientas */}
        <div className="space-y-6">
          <NotesWidget
            clientNotes={client.clientNotes}
            caseNotes={
              contextView === "judicial"
                ? (currentData as typeof client.judicialData)?.caseNotes ?? ""
                : (currentData as ContractData)?.contractNotes ?? ""
            }
          />

          {/* Herramientas */}
          <Card className="rounded-2xl shadow-sm border border-slate-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Herramientas</h3>
              <div className="space-y-3">
                <Button
                  className="w-full bg-indigo-950 hover:bg-indigo-900 text-white font-semibold py-2.5 rounded-lg"
                  onClick={() => setShowBitacoraModal(true)}
                >
                  Historial completo
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-violet-200 text-indigo-950 hover:bg-violet-50 font-semibold py-2.5 rounded-lg"
                  onClick={() => setShowSummaryModal(true)}
                >
                  Enviar resumen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showBitacoraModal} onOpenChange={setShowBitacoraModal}>
        <DialogContent className="max-w-[860px] w-[90vw] p-0 gap-0 border-slate-200 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-8 py-5 border-b border-slate-200 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-base">
                {client.initials}
              </div>
              <DialogTitle className="text-xl md:text-2xl leading-none font-bold text-slate-900">
                {client.name}
              </DialogTitle>
            </div>
          </div>

          <div className="px-8 py-3 bg-white border-b border-slate-200">
            <div className="inline-flex items-center gap-1 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setBitacoraModalTab("litigios")}
                className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${bitacoraModalTab === "litigios"
                  ? "bg-indigo-950 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
                  }`}
              >
                Litigios
              </button>
              <button
                type="button"
                onClick={() => setBitacoraModalTab("renegociacion")}
                className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${bitacoraModalTab === "renegociacion"
                  ? "bg-indigo-950 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
                  }`}
              >
                Renegociación
              </button>
              <button
                type="button"
                onClick={() => setBitacoraModalTab("patrimonial")}
                className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${bitacoraModalTab === "patrimonial"
                  ? "bg-indigo-950 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
                  }`}
              >
                P. Patrimonial
              </button>
            </div>
          </div>

          <div className="max-h-[74vh] overflow-y-auto bg-slate-50 px-6 py-5 md:px-7 md:py-6 space-y-4">
            {bitacoraModalTab === "litigios" ? (
              client.cases.map((caseItem) => {
                const isCaseExpanded = expandedCaseIds.includes(caseItem.id)
                const caseData = getJudicialDataForCase(caseItem.id)
                const timelineRows = getTimelineRows(caseItem.id)
                const stageLabel =
                  JUDICIAL_STAGES.find((s) => s.id === caseData.currentStage)?.label ??
                  "Sin etapa"
                return (
                  <div
                    key={caseItem.id}
                    className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleCaseExpanded(caseItem.id)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 md:gap-4 min-w-0">
                        <span
                          className={`w-3 h-3 md:w-4 md:h-4 rounded-full shrink-0 ${caseItem.id === activeCaseId ? "bg-rose-500" : "bg-emerald-500"
                            }`}
                        />
                        <span className="text-base md:text-lg leading-none font-semibold text-slate-900 truncate">
                          {caseItem.id}
                        </span>
                        <span className="text-slate-300 text-base md:text-lg">|</span>
                        <span className="text-base md:text-lg leading-none text-slate-600 truncate">
                          {getCaseTypeLabel(caseItem.id)}
                        </span>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`text-slate-500 transition-transform ${isCaseExpanded ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {isCaseExpanded && (
                      <div className="px-3 pb-3 border-t border-slate-200 space-y-3">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 mt-3">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenCaseDetails((prev) => ({
                                ...prev,
                                [caseItem.id]: !prev[caseItem.id],
                              }))
                            }
                            className="w-full px-3 py-2 flex items-center justify-between text-base md:text-lg font-semibold text-slate-900"
                          >
                            Datos del caso
                            <ChevronDown
                              size={20}
                              className={`transition-transform ${openCaseDetails[caseItem.id] ? "rotate-180" : ""
                                }`}
                            />
                          </button>
                          {openCaseDetails[caseItem.id] && (
                            <div className="px-4 pb-4">
                              <div className="rounded-xl border border-slate-200 bg-white p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <p className="text-xs md:text-sm text-slate-500">Tribunal:</p>
                                  <p className="text-sm md:text-base font-semibold text-slate-900">
                                    1° Juzgado Civil de Santiago
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs md:text-sm text-slate-500">Acreedor:</p>
                                  <p className="text-sm md:text-base font-semibold text-slate-900">
                                    {caseItem.creditor}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs md:text-sm text-slate-500">Tipo reclamación:</p>
                                  <p className="text-sm md:text-base font-semibold text-slate-900">
                                    Dilatoria a secas
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs md:text-sm text-slate-500">Abogado/a:</p>
                                  <p className="text-sm md:text-base font-semibold text-slate-900">
                                    José Herrera
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs md:text-sm text-slate-500">Ejecutivo/a:</p>
                                  <p className="text-sm md:text-base font-semibold text-slate-900">
                                    Andrea Solís
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs md:text-sm text-slate-500">Etapa:</p>
                                  <p className="text-sm md:text-base font-semibold text-slate-900">
                                    {stageLabel}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-slate-50">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenCaseBitacora((prev) => ({
                                ...prev,
                                [caseItem.id]: !prev[caseItem.id],
                              }))
                            }
                            className="w-full px-3 py-2 flex items-center justify-between text-base md:text-lg font-semibold text-slate-900"
                          >
                            Bitácora
                            <ChevronDown
                              size={20}
                              className={`transition-transform ${openCaseBitacora[caseItem.id] ? "rotate-180" : ""
                                }`}
                            />
                          </button>
                          {openCaseBitacora[caseItem.id] && (
                            <div className="px-4 pb-4">
                              <div className="rounded-xl border border-slate-200 bg-white p-3">
                                {timelineRows.length > 0 ? (
                                  <div className="rounded-lg border border-slate-200 overflow-hidden">
                                    <table className="w-full table-fixed text-xs md:text-sm">
                                      <thead className="bg-slate-100">
                                        <tr className="text-left text-slate-500 border-b border-slate-200">
                                          <th className="px-2 py-2 font-semibold w-[110px]">Fecha</th>
                                          <th className="px-2 py-2 font-semibold">Tarea / movimiento</th>
                                          <th className="px-2 py-2 font-semibold w-[105px]">Cuaderno</th>
                                          <th className="px-2 py-2 font-semibold w-[100px]">Tipo</th>
                                          <th className="px-2 py-2 font-semibold w-[110px]">Responsable</th>
                                          <th className="px-2 py-2 font-semibold w-[64px] text-center">Estado</th>
                                          <th className="px-2 py-2 font-semibold w-[52px] text-center">Doc</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {timelineRows.map((row, rowIdx, rows) => (
                                          <tr
                                            key={`${caseItem.id}-${row.date}-${row.task}-${rowIdx}`}
                                            className="border-b border-slate-100 hover:bg-slate-50 last:border-0"
                                          >
                                            <td className="px-2 py-1.5 text-slate-700">
                                              <div className="relative pl-5">
                                                <span className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-sky-500" />
                                                {rowIdx < rows.length - 1 && (
                                                  <span className="absolute left-[4px] top-4 h-7 w-px bg-slate-200" />
                                                )}
                                                {row.date}
                                              </div>
                                            </td>
                                            <td className="px-2 py-1.5 text-slate-900 font-medium leading-tight break-words">
                                              {row.task}
                                            </td>
                                            <td className="px-2 py-1.5 text-slate-600 leading-tight">{row.cuaderno}</td>
                                            <td className="px-2 py-1.5 text-slate-600 leading-tight">{row.tipo}</td>
                                            <td className="px-2 py-1.5 text-slate-600 leading-tight break-words">
                                              {row.responsible}
                                            </td>
                                            <td className="px-2 py-1.5 text-center">
                                              {row.estado === "ejecutado" && (
                                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200">
                                                  <Check size={14} />
                                                </span>
                                              )}
                                              {row.estado === "pendiente" && (
                                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-amber-100 text-amber-700 ring-1 ring-amber-200">
                                                  <Clock3 size={14} />
                                                </span>
                                              )}
                                              {row.estado === "imposible" && (
                                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-rose-100 text-rose-700 ring-1 ring-rose-200">
                                                  <X size={14} />
                                                </span>
                                              )}
                                            </td>
                                            <td className="px-2 py-1.5 text-center">
                                              {row.hasDocument ? (
                                                <button
                                                  type="button"
                                                  className="text-indigo-950 hover:underline font-semibold"
                                                >
                                                  Ver
                                                </button>
                                              ) : (
                                                <span className="text-slate-300">--</span>
                                              )}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-5 text-center text-sm md:text-xl text-slate-400 italic">
                                    Sin eventos disponibles para este juicio.
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <p className="text-sm md:text-xl text-slate-400 italic">
                  Esta sección estará disponible próximamente.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSummaryModal} onOpenChange={setShowSummaryModal}>
        <DialogContent className="max-w-[860px] w-[88vw] p-0 gap-0 border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-white">
            <DialogTitle className="text-xl font-bold text-slate-900">
              Enviar resumen al cliente
            </DialogTitle>
            <p className="text-sm text-slate-500 mt-1">
              Selecciona los movimientos a informar y previsualiza el correo antes de enviarlo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 h-[70vh]">
            <div className="p-4 border-r border-slate-200 bg-slate-50 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold uppercase tracking-wide text-slate-600">
                  Movimientos disponibles
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="text-xs text-indigo-950 hover:underline"
                    onClick={() =>
                      setSelectedSummaryIds((prev) => {
                        const next = new Set(prev)
                        filteredSummaryMovements.forEach((movement) => next.add(movement.id))
                        return Array.from(next)
                      })
                    }
                  >
                    Seleccionar todos
                  </button>
                  <button
                    type="button"
                    className="text-xs text-slate-500 hover:underline"
                    onClick={() => setSelectedSummaryIds([])}
                  >
                    Limpiar
                  </button>
                </div>
              </div>
              <div className="mb-3 inline-flex rounded-lg border border-slate-200 bg-white p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setSummaryScopeFilter("all")}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${summaryScopeFilter === "all"
                    ? "bg-indigo-950 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setSummaryScopeFilter("judicial")}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${summaryScopeFilter === "judicial"
                    ? "bg-indigo-950 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  Litigios
                </button>
                <button
                  type="button"
                  onClick={() => setSummaryScopeFilter("protection")}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${summaryScopeFilter === "protection"
                    ? "bg-indigo-950 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  P. Patrimonial
                </button>
              </div>

              <div className="space-y-2 flex-1 min-h-0 overflow-y-auto pr-1">
                {filteredSummaryMovements.map((movement) => {
                  const checked = selectedSummaryIds.includes(movement.id)
                  const isProtectionMovement = movement.scope === "protection"
                  return (
                    <label
                      key={movement.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${isProtectionMovement
                        ? checked
                          ? "bg-emerald-50/60 border-emerald-200"
                          : "bg-emerald-50/35 border-emerald-100 hover:border-emerald-200"
                        : checked
                          ? "bg-indigo-50/60 border-indigo-200"
                          : "bg-indigo-50/35 border-indigo-100 hover:border-indigo-200"
                        }`}
                    >
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSummaryIds((prev) => [...prev, movement.id])
                          } else {
                            setSelectedSummaryIds((prev) =>
                              prev.filter((id) => id !== movement.id)
                            )
                          }
                        }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 leading-tight">
                          {movement.title}
                        </p>
                        <p className="text-xs text-slate-600 mt-1 leading-snug">
                          {movement.desc}
                        </p>
                        <p
                          className={`text-xs mt-1 ${isProtectionMovement ? "text-emerald-700/70" : "text-indigo-700/70"
                            }`}
                        >
                          {movement.date} · {movement.source}
                        </p>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>

            <div className="p-4 bg-white flex flex-col min-h-0">
              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 block mb-1">
                    Para
                  </label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex-1 min-h-0 overflow-y-auto">
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                  <div className="px-4 py-4 bg-gradient-to-r from-indigo-50 via-white to-slate-50 border-b border-slate-200">
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                      LexyDeudor
                    </p>
                    <h4 className="text-lg font-bold text-slate-900 mt-1">
                      Hola {client.name.split(" ")[0]},
                    </h4>
                    <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                      {emailIntro}
                    </p>
                  </div>

                  <div className="p-4 space-y-3">
                    {selectedSummaryMovements.length > 0 ? (
                      selectedSummaryMovements.map((movement) => {
                        const isProtectionMovement = movement.scope === "protection"
                        return (
                          <div
                            key={movement.id}
                            className={`rounded-lg border p-3 ${isProtectionMovement
                              ? "border-emerald-200 bg-emerald-50/45"
                              : "border-indigo-200 bg-indigo-50/45"
                              }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-slate-900 leading-tight">
                                {movement.title}
                              </p>
                              <span
                                className={`text-[11px] font-semibold rounded-full px-2 py-0.5 shrink-0 border ${isProtectionMovement
                                  ? "text-emerald-700 bg-emerald-100/80 border-emerald-200"
                                  : "text-indigo-700 bg-indigo-100/80 border-indigo-200"
                                  }`}
                              >
                                {movement.source}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              Fecha: {movement.date}
                            </p>
                            <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                              <span className="font-semibold text-slate-800">Que hicimos: </span>
                              {buildClientSummary(movement)}
                            </p>
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-sm text-slate-400 italic">
                        No hay movimientos seleccionados.
                      </p>
                    )}
                  </div>

                  <div className="px-4 pb-4 border-t border-slate-200 bg-white">
                    <p className="text-sm text-slate-700 mt-3">{emailClosing}</p>
                    <p className="text-sm text-slate-700 mt-2">
                      Saludos, <br /> Equipo LexyDeudor
                    </p>
                    <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                      Este correo es informativo y resume gestiones realizadas por tu equipo legal.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
                  onClick={() => setShowSummaryModal(false)}
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  className="px-3 py-2 rounded-lg bg-indigo-950 text-white text-sm font-semibold hover:bg-indigo-900"
                >
                  Enviar correo
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
