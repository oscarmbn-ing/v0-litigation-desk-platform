"use client"

import { useState } from "react"
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
} from "lucide-react"
import type { Client, ContractData } from "@/lib/data"
import { JUDICIAL_STAGES, PROTECTION_STAGES } from "@/lib/data"
import { JourneyMap } from "./journey-map"
import { StageDetailPanel } from "./stage-detail-panel"
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

export function ClientDetail({
  client,
  onBack,
}: {
  client: Client
  onBack: () => void
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
  const [showContractSelector, setShowContractSelector] = useState(false)
  const [activeContractId, setActiveContractId] = useState<string | null>(
    client.protectionData.contracts.length > 0
      ? client.protectionData.contracts[0].id
      : null
  )

  const handleContextChange = (context: "judicial" | "protection") => {
    setContextView(context)
    if (context === "judicial") {
      setViewingStageId(client.judicialData.currentStage)
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

  let currentData: (typeof client.judicialData | ContractData) | null = null
  if (contextView === "judicial") {
    currentData = client.judicialData
  } else {
    currentData =
      client.protectionData.contracts.find(
        (c) => c.id === activeContractId
      ) ?? null
  }

  const currentStages =
    contextView === "judicial" ? JUDICIAL_STAGES : PROTECTION_STAGES
  const currentTheme = contextView === "judicial" ? "indigo" : "emerald"

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-sm text-slate-500 hover:text-indigo-700 flex items-center gap-1 bg-transparent border-0 cursor-pointer"
      >
        &larr; Volver al radar
      </button>

      {/* Header + Context Switch */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 mb-6 relative z-10">
        <div
          className={`absolute top-0 left-0 w-full h-1 rounded-t-3xl ${
            contextView === "judicial"
              ? "bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-600"
              : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"
          }`}
        />

        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {client.name}
            </h2>

            {/* Dynamic selector */}
            <div className="flex items-center gap-2 mt-2 relative">
              {contextView === "judicial" && (
                <>
                  <button
                    type="button"
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                      client.cases.length > 1
                        ? "cursor-pointer hover:bg-slate-50 border-indigo-200 bg-white shadow-sm"
                        : "border-transparent bg-slate-50 text-slate-500"
                    }`}
                    onClick={() =>
                      client.cases.length > 1 &&
                      setShowCaseSelector(!showCaseSelector)
                    }
                  >
                    <FolderOpen size={16} className="text-indigo-600" />
                    <span className="text-sm font-mono font-bold text-slate-800">
                      {client.activeCaseId}
                    </span>
                    <span className="text-sm text-slate-400">|</span>
                    <span className="text-sm text-slate-600 font-medium">
                      {client.activeCreditor}
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
                          className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm text-slate-700 cursor-pointer"
                          onClick={() => setShowCaseSelector(false)}
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
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer hover:bg-emerald-50 border-emerald-200 bg-white shadow-sm"
                    onClick={() =>
                      setShowContractSelector(!showContractSelector)
                    }
                  >
                    {getContractIcon((currentData as ContractData).type)}
                    <span className="text-sm font-bold text-emerald-800">
                      {(currentData as ContractData).type}
                    </span>
                    <span className="text-sm text-slate-400">|</span>
                    <span className="text-sm text-slate-600 font-medium">
                      {(currentData as ContractData).detail}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-emerald-500 transition-transform ${showContractSelector ? "rotate-180" : ""}`}
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
          <div className="bg-slate-100 p-1 rounded-xl flex">
            <button
              type="button"
              onClick={() => handleContextChange("judicial")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                contextView === "judicial"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Scale size={16} /> Defensa Judicial
            </button>
            <button
              type="button"
              onClick={() => handleContextChange("protection")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                contextView === "protection"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <ShieldCheck size={16} /> Proteccion Patrimonial
            </button>
          </div>
        </div>

        {/* Journey Map or Inactive State */}
        {contextView === "protection" && !client.protectionData.isActive ? (
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 text-center">
            <ShieldAlert className="mx-auto text-slate-300 mb-2" size={32} />
            <p className="text-slate-500 font-medium">
              Este servicio no esta activo para este cliente.
            </p>
            <button
              type="button"
              className="mt-2 text-indigo-600 text-sm font-bold hover:underline bg-transparent border-0 cursor-pointer"
            >
              Activar servicio
            </button>
          </div>
        ) : (
          <>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 transition-all">
              <JourneyMap
                stages={currentStages}
                currentStage={currentData?.currentStage || 1}
                selectedStageId={viewingStageId}
                onSelectStage={setViewingStageId}
                themeColor={currentTheme}
              />
            </div>

            {viewingStageId && contextView === "judicial" ? (
              <StageDetailPanel
                stageId={viewingStageId}
                judicialData={client.judicialData}
                isActiveStage={
                  viewingStageId === client.judicialData.currentStage
                }
                stages={currentStages}
                activeNotebook={activeNotebook}
                onNotebookChange={setActiveNotebook}
              />
            ) : null}

            {viewingStageId && contextView === "protection" && (
              <div className="bg-white rounded-2xl border border-emerald-100 shadow-lg shadow-emerald-900/5 p-6 mt-4">
                <h3 className="font-bold text-slate-900 mb-4">
                  Bitacora del Contrato
                </h3>
                <div className="text-center py-4 text-slate-400 italic bg-slate-50 rounded-lg">
                  Ver detalle en historial de contratos.
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-0">
        <div className="lg:col-span-1 space-y-6">
          {/* Mood card */}
          <div className="bg-indigo-950 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase text-indigo-300">
                Animo
              </span>
              <span className="text-xl" aria-hidden="true">
                {client.mood === "ansioso" ? "\uD83D\uDE1F" : "\uD83D\uDE0C"}
              </span>
            </div>
            <p className="font-bold text-lg capitalize">{client.mood}</p>
            <button
              type="button"
              className="mt-4 w-full bg-white/10 hover:bg-white/20 border border-white/20 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-all text-white cursor-pointer"
            >
              <MessageCircle size={14} /> Contener
            </button>
          </div>

          {/* Tasks */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2
                className={
                  contextView === "judicial"
                    ? "text-indigo-600"
                    : "text-emerald-600"
                }
                size={20}
              />
              Misiones (
              {contextView === "judicial" ? "Judicial" : "Proteccion"})
            </h3>
            {currentData && "tasks" in currentData && currentData.tasks.length > 0 ? (
              currentData.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm text-slate-900">
                      {task.title}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        task.status === "urgent"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {task.due}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">
                    {task.assignee}
                  </p>
                  <button
                    type="button"
                    className="text-xs text-indigo-600 font-medium hover:underline bg-transparent border-0 cursor-pointer"
                  >
                    Completar
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 italic">
                Sin tareas activas para este item.
              </p>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {contextView === "judicial" && currentData ? (
            <DossierWidget
              description={(currentData as typeof client.judicialData).description}
              strategy={(currentData as typeof client.judicialData).strategy}
              tactics={(currentData as typeof client.judicialData).tactics}
            />
          ) : currentData ? (
            <ProtectionWidget contractData={currentData as ContractData} />
          ) : null}

          <NotesWidget
            clientNotes={client.clientNotes}
            caseNotes={
              contextView === "judicial"
                ? (currentData as typeof client.judicialData)?.caseNotes ?? ""
                : (currentData as ContractData)?.contractNotes ?? ""
            }
          />
        </div>
      </div>
    </div>
  )
}
