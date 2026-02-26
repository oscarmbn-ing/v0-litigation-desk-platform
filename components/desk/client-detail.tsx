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
  Building2,
  Landmark,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Search,
  HelpCircle,
  Mail,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  const [showCcField, setShowCcField] = useState(false)
  const [ccInput, setCcInput] = useState("")
  const [ccList, setCcList] = useState<string[]>([])
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
  const [summarySearchQuery, setSummarySearchQuery] = useState("")
  const [isSummarySearchOpen, setIsSummarySearchOpen] = useState(false)

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
    let result = summaryMovements
    if (summaryScopeFilter !== "all") {
      result = result.filter((movement) => movement.scope === summaryScopeFilter)
    }
    if (summarySearchQuery) {
      const query = summarySearchQuery.toLowerCase()
      result = result.filter(
        (movement) =>
          (movement.title?.toLowerCase() || "").includes(query) ||
          (movement.desc?.toLowerCase() || "").includes(query) ||
          (movement.source?.toLowerCase() || "").includes(query) ||
          (movement.date?.toLowerCase() || "").includes(query)
      )
    }
    return result
  }, [summaryMovements, summaryScopeFilter, summarySearchQuery])

  useEffect(() => {
    if (!showSummaryModal) return
    setSummaryScopeFilter("all")
    setSummarySearchQuery("")
    setIsSummarySearchOpen(false)
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
    <div className="flex flex-col h-full">
      <div className="flex items-end justify-between shrink-0 mb-2">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-0.5 text-sm text-slate-400 hover:text-indigo-950 transition-colors mb-1 bg-transparent border-0 cursor-pointer -ml-1"
          >
            <ChevronLeft size={16} />
            Volver al radar
          </button>
          <h2 className="text-2xl font-bold text-slate-900">Centro de Comando</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-slate-600 hover:text-indigo-900 hover:bg-indigo-50" onClick={() => window.open("https://oficinajudicialvirtual.pjud.cl/home/index.php#", "_blank")} title="Oficina Judicial Virtual">
            <Scale className="h-4 w-4" /><span className="hidden sm:inline font-medium">OJV</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-slate-600 hover:text-emerald-900 hover:bg-emerald-50" onClick={() => window.open("https://homer.sii.cl/", "_blank")} title="Servicio de Impuestos Internos">
            <Building2 className="h-4 w-4" /><span className="hidden sm:inline font-medium">SII</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-slate-600 hover:text-rose-900 hover:bg-rose-50" onClick={() => window.open("https://www.cmfchile.cl/", "_blank")} title="Comisión para el Mercado Financiero">
            <Landmark className="h-4 w-4" /><span className="hidden sm:inline font-medium">CMF</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-slate-600 hover:text-amber-900 hover:bg-amber-50" onClick={() => window.open("https://www.boletinconcursal.cl/boletin/procedimientos", "_blank")} title="Boletín Concursal">
            <BookOpen className="h-4 w-4" /><span className="hidden sm:inline font-medium">BCL</span>
          </Button>
        </div>
      </div>

      <div className="h-px bg-slate-200 mb-4" />

      <div className="flex-1 overflow-y-auto pr-1">
      {/* Header + Context Switch */}
      <Card className="rounded-3xl shadow-sm border border-slate-200 mb-6 relative z-10 overflow-visible">
        <CardContent className="p-8 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5">
                <div className="w-4 flex justify-center shrink-0">
                  <User size={14} className="text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {client.name}
                </h2>
                <a
                  href={`https://wa.me/56912345678`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-500 hover:text-emerald-600 transition-colors"
                >
                  <MessageCircle size={20} fill="currentColor" className="text-white" strokeWidth={0} />
                  <MessageCircle size={20} className="absolute -mt-5" />
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-4 flex justify-center shrink-0">
                  <Mail size={13} className="text-slate-400" />
                </div>
                <span className="text-base text-slate-500">{client.email}</span>
              </div>

              {/* Dynamic selector */}
              <div className="flex items-center gap-2.5 relative">
                {contextView === "judicial" && (
                  <>
                    <div className="w-4 flex justify-center shrink-0">
                      <FolderOpen size={13} className="text-slate-400" />
                    </div>
                    <span className="text-base text-slate-500">Expediente:</span>
                    <div className="relative">
                      <button
                        type="button"
                        className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border transition-all text-base ${client.cases.length > 1
                          ? "cursor-pointer hover:bg-slate-50 border-slate-200 bg-transparent"
                          : "border-transparent text-slate-500"
                          }`}
                        onClick={() =>
                          client.cases.length > 1 &&
                          setShowCaseSelector(!showCaseSelector)
                        }
                      >
                        <span className="font-bold text-slate-800">
                          {activeCaseId}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-600 font-medium">
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
                        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
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
                    </div>
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

          {/* Propiedades del caso/contrato */}
          <div className="mb-6 pt-6 border-t border-slate-100">
            {contextView === "judicial" ? (
              <div className="flex flex-col gap-2 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span><span className="font-bold text-slate-900">Tribunal:</span> 1° Juzgado Civil de Santiago</span>
                  <span><span className="font-bold text-slate-900">Tipo reclamación:</span> Dilatoria a secas</span>
                </div>
                <div className="flex items-center justify-between">
                  <span><span className="font-bold text-slate-900">Acreedor:</span> {activeCase?.creditor ?? client.activeCreditor}</span>
                  <span className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Índice de riesgo:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                      client.health === "critical"
                        ? "bg-rose-50 text-rose-700"
                        : client.health === "warning"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                    }`}>
                      {client.health === "critical" ? "Crítico" :
                        client.health === "warning" ? "Medio" :
                          "Bajo"}
                    </span>
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span><span className="font-bold text-slate-900">Registro:</span> {(currentData as ContractData)?.type?.toLowerCase().includes("vehiculo")
                    ? "Registro de Vehículos Motorizados"
                    : "Conservador de Bienes Raíces de Santiago"}</span>
                  <span className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Índice de riesgo:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                      client.health === "critical"
                        ? "bg-rose-50 text-rose-700"
                        : client.health === "warning"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                    }`}>
                      {client.health === "critical" ? "Crítico" :
                        client.health === "warning" ? "Medio" :
                          "Bajo"}
                    </span>
                  </span>
                </div>
              </div>
            )}
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

                {/* Bitácora/Stage Detail Panel */}
                {viewingStageId && contextView === "judicial" ? (
                  <StageDetailPanel
                    stageId={viewingStageId}
                    judicialData={activeJudicialData}
                    isActiveStage={
                      viewingStageId === activeJudicialData.currentStage
                    }
                    stages={currentStages}
                    activeNotebook={activeNotebook}
                    onNotebookChange={setActiveNotebook}
                    inline
                  />
                ) : null}

                {viewingStageId &&
                  contextView === "protection" &&
                  currentData && (
                    <ProtectionStageDetailPanel
                      stageId={viewingStageId}
                      contractData={currentData as ContractData}
                      isActiveStage={
                        viewingStageId === (currentData as ContractData).currentStage
                      }
                      stages={currentStages}
                      inline
                    />
                  )}
              </div>
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
                        "flex items-center justify-between p-4 rounded-xl border shadow-sm transition-all",
                        isOwner
                          ? isMovement
                            ? "bg-indigo-50/50 border-indigo-200 hover:shadow-md hover:border-indigo-300 cursor-pointer"
                            : "bg-white border-slate-200 hover:shadow-md hover:border-slate-300 cursor-pointer"
                          : "bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-lg",
                            isMovement ? "bg-indigo-100" : isOwner ? "bg-slate-100" : "bg-slate-200"
                          )}
                        >
                          {isMovement ? (
                            <Siren size={16} className="text-indigo-600" />
                          ) : (
                            <ScrollText size={16} className={isOwner ? "text-slate-600" : "text-slate-400"} />
                          )}
                        </div>
                        <div>
                          <h4 className={cn("font-semibold text-sm", isOwner ? "text-slate-900" : "text-slate-500")}>
                            {task.title}
                          </h4>
                          <p className={cn("text-xs", isOwner ? "text-slate-500" : "text-slate-400")}>
                            {task.assignee}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-xs font-bold ${task.status === "urgent"
                            ? "text-rose-600"
                            : isOwner ? "text-slate-600" : "text-slate-400"
                            }`}
                        >
                          {task.status === "urgent" ? "Hoy" : task.due}
                        </span>
                        {isOwner ? (
                          <div
                            className="flex items-center gap-0.5 text-xs text-indigo-950 hover:underline cursor-pointer mt-0.5 font-medium"
                            onClick={() => onNavigateToTask?.(String(task.id))}
                          >
                            Ir a misión
                            <ChevronRight size={12} />
                          </div>
                        ) : (
                          <p className="flex items-center gap-0.5 text-xs text-slate-400 cursor-not-allowed mt-0.5">
                            Ir a misión
                            <ChevronRight size={12} />
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
        <DialogContent className="max-w-[1200px] w-[96vw] max-h-[90vh] p-0 gap-0 border-slate-200 rounded-2xl overflow-hidden my-auto flex flex-col h-[85vh]" hideClose>
          {/* Barra de título tipo ventana de aplicación */}
          <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <Mail size={16} />
              </div>
              <DialogTitle className="text-base font-semibold text-slate-900 leading-none">
                Enviar resumen al cliente
              </DialogTitle>
              <button
                type="button"
                className="w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:text-slate-500 hover:bg-slate-100 transition-colors"
                title="Selecciona los movimientos a informar y previsualiza el correo"
              >
                <HelpCircle size={12} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowSummaryModal(false)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
              title="Cerrar"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Layout tipo editor: Sidebar izquierda + Canvas derecha */}
          <div className="flex flex-1 min-h-0">
            {/* Sidebar - Movimientos disponibles */}
            <div className="w-[360px] flex flex-col bg-slate-50 border-r border-slate-200">
              {/* Header: título + filtros + buscador */}
              <div className="px-4 py-3 border-b border-slate-200">
                {/* Título y seleccionados */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Movimientos
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {selectedSummaryIds.length} seleccionados
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {/* Filtros o Buscador */}
                  <div className="flex items-center gap-1 flex-1 min-w-0 h-[26px]">
                    {isSummarySearchOpen ? (
                      <div className="flex items-center w-full gap-1 h-full">
                        <button
                          type="button"
                          onClick={() => {
                            setIsSummarySearchOpen(false)
                            setSummarySearchQuery("")
                          }}
                          className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors shrink-0 flex items-center justify-center"
                          title="Cerrar búsqueda"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <input
                          type="text"
                          value={summarySearchQuery}
                          onChange={(e) => setSummarySearchQuery(e.target.value)}
                          placeholder="Buscar movimientos..."
                          className="flex-1 text-[11px] px-3 py-1 rounded-full bg-white border border-slate-200 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all min-w-0"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 w-full h-full">
                        <button
                          type="button"
                          onClick={() => setIsSummarySearchOpen(true)}
                          className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors shrink-0 flex items-center justify-center h-full"
                          title="Buscar"
                        >
                          <Search size={14} />
                        </button>
                        <div className="flex gap-1 flex-1 overflow-x-auto no-scrollbar items-center min-w-0">
                          <button
                            type="button"
                            onClick={() => setSummaryScopeFilter("all")}
                            className={`px-2 py-1 text-[11px] font-medium rounded transition-colors whitespace-nowrap ${summaryScopeFilter === "all"
                              ? "bg-indigo-950 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              }`}
                          >
                            Todos
                          </button>
                          <button
                            type="button"
                            onClick={() => setSummaryScopeFilter("judicial")}
                            className={`px-2 py-1 text-[11px] font-medium rounded transition-colors whitespace-nowrap ${summaryScopeFilter === "judicial"
                              ? "bg-indigo-950 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              }`}
                          >
                            Litigios
                          </button>
                          <button
                            type="button"
                            onClick={() => setSummaryScopeFilter("protection")}
                            className={`px-2 py-1 text-[11px] font-medium rounded transition-colors whitespace-nowrap ${summaryScopeFilter === "protection"
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              }`}
                          >
                            P. Patrimonial
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Menú de tres puntos con acciones */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="p-1 rounded hover:bg-slate-200 text-slate-500 transition-colors"
                      >
                        <MoreVertical size={14} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        onClick={() =>
                          setSelectedSummaryIds((prev) => {
                            const next = new Set(prev)
                            filteredSummaryMovements.forEach((movement) => next.add(movement.id))
                            return Array.from(next)
                          })
                        }
                      >
                        Seleccionar todos
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSelectedSummaryIds([])}
                      >
                        Limpiar selección
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Lista de movimientos */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredSummaryMovements.map((movement) => {
                  const checked = selectedSummaryIds.includes(movement.id)
                  const isProtectionMovement = movement.scope === "protection"
                  return (
                    <label
                      key={movement.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isProtectionMovement
                        ? checked
                          ? "bg-emerald-50 border-emerald-300 shadow-sm"
                          : "bg-white border-slate-200 hover:border-emerald-300"
                        : checked
                          ? "bg-indigo-50 border-indigo-300 shadow-sm"
                          : "bg-white border-slate-200 hover:border-indigo-300"
                        }`}
                    >
                      <input
                        type="checkbox"
                        className="mt-0.5 shrink-0"
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
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-slate-900 leading-tight">
                          {movement.title}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">
                          {movement.desc}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded ${isProtectionMovement
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-indigo-100 text-indigo-700"
                            }`}>
                            {movement.source}
                          </span>
                          <span className="text-[9px] text-slate-400">
                            {movement.date}
                          </span>
                        </div>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Canvas derecho - Preview del email */}
            <div className="flex-1 flex flex-col bg-white min-w-0">
              {/* Toolbar - Barra blanca con Para y email */}
              <div className="px-6 py-2 border-b border-slate-200 flex items-center bg-white shrink-0 gap-3">
                {/* Para - lado izquierdo, color mas claro */}
                <span className="text-sm text-slate-400 font-medium shrink-0">Para:</span>

                {/* Email principal - como pila sin opcion de eliminar */}
                <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-700 text-sm rounded-md">
                  {emailTo}
                </span>

                <div className="flex-1" />

                {/* Boton CC - sutil */}
                {!showCcField && (
                  <button
                    type="button"
                    onClick={() => setShowCcField(true)}
                    className="px-2 py-1 text-[11px] text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                  >
                    + Cc
                  </button>
                )}
              </div>

              {/* Barra CC - aparece cuando se presiona el boton */}
              {showCcField && (
                <div className="px-6 py-2 border-b border-slate-200 flex items-center bg-white shrink-0 gap-3">
                  {/* CC: label */}
                  <span className="text-sm text-slate-400 font-medium shrink-0">Cc:</span>

                  {/* Tags de correos CC + input */}
                  <div className="flex-1 flex items-center flex-wrap gap-2">
                    {ccList.map((email, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md"
                      >
                        {email}
                        <button
                          type="button"
                          onClick={() => setCcList(ccList.filter((_, i) => i !== index))}
                          className="text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <input
                      type="email"
                      value={ccInput}
                      onChange={(e) => setCcInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && ccInput.trim()) {
                          e.preventDefault()
                          setCcList([...ccList, ccInput.trim()])
                          setCcInput("")
                        }
                      }}
                      className="flex-1 min-w-[120px] text-sm text-slate-700 bg-transparent border-none outline-none placeholder:text-slate-300"
                      placeholder={ccList.length === 0 ? "Agregar correos..." : "+ Agregar..."}
                    />
                  </div>

                  {/* Boton para cerrar CC */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowCcField(false)
                      setCcList([])
                      setCcInput("")
                    }}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                    title="Eliminar Cc"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Preview del email */}
              <div className="flex-1 overflow-y-auto bg-[#f3f5f7]">
                <div className="w-full max-w-full bg-[#f3f5f7] min-h-full">
                  {/* Header del email - con imagen de fondo */}
                  <div 
                    className="px-6 md:px-10 pt-4 pb-11 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: 'url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lexy-Fondo-6-wCXLOiPrUGqn433vZNABCUfMMbiEfA.jpg")' }}
                  >
                    <div className="max-w-[600px] mx-auto">
                      {/* Logo Lexy Deudor alineado derecha */}
                      <div className="flex justify-end mb-2">
                        <img 
                          src="https://lexy.cl/wp-content/uploads/2025/06/LOGODEUDOR-1.svg" 
                          alt="Lexy Deudor" 
                          width="150"
                          className="block max-w-full h-auto -mt-7 -mb-7"
                        />
                      </div>
                      
                      {/* Saludo */}
                      <h1 
                        className="mb-2 leading-tight"
                        style={{ 
                          fontSize: '22px',
                          fontWeight: 500, 
                          color: '#271d8e',
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                          lineHeight: 1.3,
                          margin: '0 0 8px'
                        }}
                      >
                        ¡Hola {client.name.split(" ")[0]}!
                      </h1>
                      
                      {/* Título principal */}
                      <h2 
                        className="mb-3 leading-none max-w-[90%]"
                        style={{ 
                          fontSize: '34px',
                          fontWeight: 700, 
                          color: '#0b013c',
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                          lineHeight: 1,
                          letterSpacing: '-1.5px',
                          margin: '0 0 12px'
                        }}
                      >
                        Manos a la obra.
                      </h2>
                      
                      {/* Subtítulo */}
                      <p 
                        style={{ 
                          fontSize: '18px',
                          fontWeight: 600,
                          color: '#344054',
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                          lineHeight: 1.5,
                          margin: 0,
                          maxWidth: '600px'
                        }}
                      >
                        {emailIntro}
                      </p>
                    </div>
                  </div>

                  {/* Contenido - tarjetas de movimientos estilo Lexy */}
                  <div className="bg-white w-full">
                    <div className="max-w-[600px] mx-auto px-6 md:px-10 py-10 space-y-6">
                    {selectedSummaryMovements.length > 0 ? (
                      selectedSummaryMovements.map((movement) => {
                        const isProtectionMovement = movement.scope === "protection"
                        return (
                          <div
                            key={movement.id}
                            className="rounded-2xl border p-6"
                            style={{
                              background: 'linear-gradient(135deg, #f2f4ff 0%, #ffffff 100%)',
                              borderColor: '#e0e4f5'
                            }}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-[#271d8e] mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                  {movement.title}
                                </h3>
                                <p className="text-sm text-[#475467] leading-relaxed mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                  <strong style={{ color: '#271d8e' }}>{movement.source}</strong> · {movement.date}
                                </p>
                                <p className="text-sm text-[#344054] leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                  {buildClientSummary(movement)}
                                </p>
                              </div>
                              <div className="text-4xl shrink-0">
                                {isProtectionMovement ? '🛡️' : '⚖️'}
                              </div>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-sm text-[#475467] italic" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Selecciona movimientos de la barra lateral para incluirlos en el resumen.
                        </p>
                      </div>
                    )}
                    </div>
                  </div>

                  {/* Footer del email - con imagen de fondo */}
                  <div 
                    className="w-full bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: 'url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lexy-Fondo-6-wCXLOiPrUGqn433vZNABCUfMMbiEfA.jpg")' }}
                  >
                    <div className="max-w-[600px] mx-auto px-6 md:px-10 py-10 text-center">
                      <p className="text-sm font-semibold text-[#271d8e] mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Lexy Deudor | Hacemos fácil lo legal
                      </p>
                      <p className="text-sm font-semibold text-[#271d8e] mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        <a href="https://lexy.cl/" className="text-[#271d8e] no-underline">www.lexy.cl</a>
                      </p>
                      <p className="text-[11px] text-[#667085] leading-relaxed max-w-md mx-auto" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Este correo y su contenido son confidenciales y están destinados únicamente para el destinatario. Si lo recibió por error, por favor notifíquelo al remitente y elimínelo de su sistema.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
            {/* Cancelar - alineado a la izquierda */}
            <button
              type="button"
              className="px-5 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              onClick={() => setShowSummaryModal(false)}
            >
              Cancelar
            </button>

            {/* Grupo derecha: WhatsApp + Divider + Enviar correo */}
            <div className="flex items-center gap-3">
              {/* WhatsApp */}
              <button
                type="button"
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                title="Enviar por WhatsApp"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </button>

              {/* Divider */}
              <div className="w-px h-6 bg-slate-300" />

              {/* Enviar correo */}
              <button
                type="button"
                className="px-5 py-2 rounded-lg bg-indigo-950 text-white text-sm font-medium hover:bg-indigo-900 transition-colors shadow-sm"
              >
                Enviar correo
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
