"use client"

import { useState, useEffect } from "react"
import {
  Target,
  Lightbulb,
  ShieldCheck,
  Briefcase,
  Users,
  X,
  Plus,
  ChevronDown,
  Pencil,
  Check,
  Undo2,
  Eye,
  EyeOff,
  Mail,
  Loader2,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import type { ContractData } from "@/lib/data"

export function DossierWidget({
  description: initialDescription,
  strategy: initialStrategy,
  tactics: initialTactics,
  debtAmount: initialDebtAmount,
  client,
}: {
  description: string
  strategy: string
  tactics: string[]
  debtAmount?: number
  client: import("@/lib/data").Client
}) {
  const [activeTab, setActiveTab] = useState<"caso" | "cliente">("caso")
  const [isEditing, setIsEditing] = useState(false)
  const [claveVisible, setClaveVisible] = useState(false)
  const [claveVerificada, setClaveVerificada] = useState(false)
  const [claveVerificando, setClaveVerificando] = useState(false)

  const handleVerificarClave = () => {
    if (claveVerificando || claveVerificada) return
    setClaveVerificando(true)
    setTimeout(() => {
      setClaveVerificando(false)
      setClaveVerificada(true)
    }, 2500)
  }

  // Committed state — Caso
  const [description, setDescription] = useState(initialDescription)
  const [debtAmount, setDebtAmount] = useState<number | undefined>(initialDebtAmount)
  const [strategies, setStrategies] = useState<string[]>(
    initialStrategy ? [initialStrategy] : []
  )
  const [tactics, setTactics] = useState<string[]>(initialTactics)

  // Committed state — Cliente
  const [rut, setRut] = useState(client.rut)
  const [email, setEmail] = useState(client.email)
  const [claveUnica, setClaveUnica] = useState(client.claveUnica)

  // Draft state — Caso
  const [draftDescription, setDraftDescription] = useState(initialDescription)
  const [draftDebtAmount, setDraftDebtAmount] = useState<number | undefined>(initialDebtAmount)
  const [draftStrategies, setDraftStrategies] = useState<string[]>(
    initialStrategy ? [initialStrategy] : []
  )
  const [draftTactics, setDraftTactics] = useState<string[]>(initialTactics)

  // Draft state — Cliente
  const [draftRut, setDraftRut] = useState(client.rut)
  const [draftEmail, setDraftEmail] = useState(client.email)
  const [draftClaveUnica, setDraftClaveUnica] = useState(client.claveUnica)

  const handleStartEditing = () => {
    // Caso
    setDraftDescription(description)
    setDraftDebtAmount(debtAmount)
    setDraftStrategies([...strategies])
    setDraftTactics([...tactics])
    // Cliente
    setDraftRut(rut)
    setDraftEmail(email)
    setDraftClaveUnica(claveUnica)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = () => {
    // Caso
    setDescription(draftDescription)
    setDebtAmount(draftDebtAmount)
    setStrategies(draftStrategies)
    setTactics(draftTactics)
    // Cliente
    setRut(draftRut)
    setEmail(draftEmail)
    setClaveUnica(draftClaveUnica)
    setIsEditing(false)
  }

  const handleAddStrategy = (strategy: string) => {
    if (!draftStrategies.includes(strategy)) {
      setDraftStrategies([...draftStrategies, strategy])
    }
  }

  const handleRemoveStrategy = (strategy: string) => {
    setDraftStrategies(draftStrategies.filter((s) => s !== strategy))
  }

  const handleAddTactic = (tactic: string) => {
    if (!draftTactics.includes(tactic)) {
      setDraftTactics([...draftTactics, tactic])
    }
  }

  const handleRemoveTactic = (tactic: string) => {
    setDraftTactics(draftTactics.filter((t) => t !== tactic))
  }

  const STRATEGIES = ["Defensa en Juicio", "Prescripción"]
  const TACTICS_OPTIONS = [
    "Monitoreo",
    "Dilatación + PP",
    "Excepción Prescripción",
    "Abandono",
    "Acción Prescripción",
  ]

  const acreedores = client.cases.map((c) => c.creditor).join(" ; ")
  const { cuotasPagadas, cuotasTotal, alDia } = client.comercialStatus

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col relative">
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {activeTab === "caso" ? "Datos del Caso" : "Datos del Cliente"}
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-slate-500">
              Información General
            </p>
            {isEditing ? (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-6 w-6 text-rose-600" onClick={handleCancel} title="Cancelar">
                  <X size={14} />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-emerald-600" onClick={handleSave} title="Guardar">
                  <Check size={14} />
                </Button>
              </div>
            ) : (
              <button type="button" onClick={handleStartEditing} className="text-slate-400 hover:text-indigo-600 transition-colors" title="Editar">
                <Pencil size={12} />
              </button>
            )}
          </div>
        </div>
        {/* Pill tabs */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => { setActiveTab("caso"); setIsEditing(false) }}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === "caso"
              ? "bg-indigo-950 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-700"}`}
          >
            Caso
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("cliente"); setIsEditing(false) }}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === "cliente"
              ? "bg-indigo-950 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-700"}`}
          >
            Cliente
          </button>
        </div>
      </div>

      {/* Tab: Caso */}
      {
        activeTab === "caso" && (
          <div className="space-y-5 flex-1">
            <div>
              <span className="text-sm font-bold text-slate-900 mb-2 block">Contexto:</span>
              {isEditing ? (
                <Textarea
                  value={draftDescription}
                  onChange={(e) => setDraftDescription(e.target.value)}
                  className="text-sm text-slate-600 bg-white border-slate-200 min-h-[80px] resize-none focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 hover:border-indigo-300 transition-colors"
                />
              ) : (
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 min-h-[80px]">
                  {description}
                </p>
              )}
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 mb-2 block">Monto de la deuda:</span>
              {isEditing ? (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">$</span>
                  <input
                    type="number"
                    value={draftDebtAmount ?? ""}
                    onChange={(e) => setDraftDebtAmount(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="0"
                    className="w-full pl-7 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-indigo-300 transition-colors bg-white text-slate-700"
                  />
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5">
                  <span className="text-sm font-semibold text-slate-800">
                    {debtAmount != null
                      ? `$ ${debtAmount.toLocaleString("es-CL")}`
                      : <span className="text-slate-400 font-normal">Sin definir</span>}
                  </span>
                </div>
              )}
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 mb-2 block">Estrategia:</span>
              {isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {draftStrategies.map((strat) => (
                    <div key={strat} className="bg-amber-50 text-amber-900 px-3 py-1.5 rounded-lg font-medium text-sm border border-amber-100 flex items-center gap-2 group">
                      <Lightbulb size={14} className="shrink-0" />
                      {strat}
                      <button type="button" onClick={() => handleRemoveStrategy(strat)} className="text-amber-900/50 hover:text-amber-900 transition-colors ml-1">
                        <X size={12} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-[29px] w-[29px] p-0 rounded-lg border-dashed border-slate-300 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800 text-slate-400">
                        <Plus size={14} strokeWidth={3} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {STRATEGIES.map((opt) => (
                        <DropdownMenuItem key={opt} onClick={() => handleAddStrategy(opt)} className="cursor-pointer text-sm" disabled={draftStrategies.includes(opt)}>
                          {opt}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {strategies.map((strat) => (
                    <div key={strat} className="bg-amber-50 text-amber-900 px-4 py-2 rounded-xl font-medium text-sm border border-amber-100 flex items-center gap-2">
                      <Lightbulb size={16} className="shrink-0" />
                      {strat}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 mb-2 block">Tácticas:</span>
              {isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {draftTactics.map((tactic) => (
                    <span key={tactic} className="text-sm font-medium px-3 py-1.5 bg-violet-100 text-indigo-950 rounded-lg flex items-center gap-1.5 group">
                      {tactic}
                      <button type="button" onClick={() => handleRemoveTactic(tactic)} className="text-indigo-950/50 hover:text-indigo-950 transition-colors">
                        <X size={12} strokeWidth={3} />
                      </button>
                    </span>
                  ))}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-[29px] w-[29px] p-0 rounded-lg border-dashed border-slate-300 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 text-slate-400">
                        <Plus size={14} strokeWidth={3} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {TACTICS_OPTIONS.map((opt) => (
                        <DropdownMenuItem key={opt} onClick={() => handleAddTactic(opt)} className="cursor-pointer text-sm" disabled={draftTactics.includes(opt)}>
                          {opt}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tactics.map((tactic) => (
                    <span key={tactic} className="text-sm font-medium px-4 py-2 bg-violet-100 text-indigo-950 rounded-xl">
                      {tactic}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      }

      {/* Tab: Cliente */}
      {
        activeTab === "cliente" && (
          <div className="flex-1 space-y-5">

            {/* RUT */}
            <div>
              <span className="text-sm font-bold text-slate-900 mb-2 block">RUT:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={draftRut}
                  onChange={(e) => setDraftRut(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-indigo-300 transition-colors bg-white text-slate-700"
                />
              ) : (
                <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5">
                  <span className="text-sm font-semibold text-slate-700">{rut}</span>
                </div>
              )}
            </div>

            {/* Clave Única */}
            <div>
              <span className="text-sm font-bold text-slate-900 mb-2 block">Clave Única:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={draftClaveUnica}
                  onChange={(e) => setDraftClaveUnica(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-indigo-300 transition-colors bg-white text-slate-700"
                />
              ) : (
                <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-700">
                    {claveVisible ? claveUnica : "•".repeat(claveUnica.length)}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setClaveVisible(!claveVisible)}
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                      title={claveVisible ? "Ocultar" : "Mostrar"}
                    >
                      {claveVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      type="button"
                      onClick={handleVerificarClave}
                      title={claveVerificada ? "Verificada" : claveVerificando ? "Verificando..." : "Probar clave única"}
                      disabled={claveVerificando}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all border ${claveVerificada
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : claveVerificando
                          ? "bg-white border-slate-300 text-slate-400"
                          : "bg-white border-slate-300 text-slate-400 hover:border-emerald-400 hover:text-emerald-500"
                        }`}
                    >
                      {claveVerificando
                        ? <Loader2 size={12} strokeWidth={3} className="animate-spin" />
                        : <Check size={12} strokeWidth={3} />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <span className="text-sm font-bold text-slate-900 mb-2 block">Email:</span>
              {isEditing ? (
                <input
                  type="email"
                  value={draftEmail}
                  onChange={(e) => setDraftEmail(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-indigo-300 transition-colors bg-white text-slate-700"
                />
              ) : (
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5">
                  <Mail size={14} className="text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-700">{email}</span>
                </div>
              )}
            </div>

            {/* Acreedores */}
            <div>
              <span className="text-sm font-bold text-slate-900 mb-2 block">Acreedores contratados:</span>
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5">
                <span className="text-sm text-slate-700">{acreedores}</span>
              </div>
            </div>

            {/* Situación comercial */}
            <div>
              <span className="text-sm font-bold text-slate-900 mb-2 block">Situación comercial:</span>
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700">
                    {cuotasPagadas} de {cuotasTotal} cuotas pagadas
                  </p>
                  <div className="mt-1.5 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${alDia ? "bg-emerald-500" : "bg-rose-500"}`}
                      style={{ width: `${Math.round((cuotasPagadas / cuotasTotal) * 100)}%` }}
                    />
                  </div>
                </div>
                <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg ${alDia
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "bg-rose-50 text-rose-700 border border-rose-100"}`}>
                  {alDia ? "Al día" : "En mora"}
                </span>
              </div>
            </div>
          </div>
        )
      }

      {/* Ver ficha - siempre visible */}
      <button
        type="button"
        className="mt-6 w-full bg-indigo-950 hover:bg-indigo-900 text-white font-semibold py-2.5 rounded-xl transition-colors"
      >
        Ver ficha
      </button>
    </div >
  )
}

export function ProtectionWidget({
  contractData,
}: {
  contractData: ContractData
}) {
  const isVehicle = contractData.type.toLowerCase().includes("vehiculo")
  const contractIdentification = isVehicle
    ? `Patente ${contractData.detail}, Registro Nacional`
    : "Parcela Lampa N° 23, comuna de Lampa, RM"
  const contractRegistry = isVehicle
    ? "Registro de Vehículos Motorizados"
    : "Conservador de Bienes Raíces de Santiago"

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Información del contrato
          </h3>
          <p className="text-sm text-slate-500">
            Ficha del contrato
          </p>
        </div>
      </div>
      <div className="space-y-5">
        <div>
          <span className="text-sm font-bold text-slate-900 mb-2 block">
            Identificación del contrato:
          </span>
          <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5">
            <span className="text-sm font-semibold text-slate-800">
              {contractIdentification}
            </span>
          </div>
        </div>
        <div>
          <span className="text-sm font-bold text-slate-900 mb-2 block">
            Equipo:
          </span>
          <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Briefcase size={14} className="text-slate-400 shrink-0" />
              <span>Camilo Cortés - Abogado</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Users size={14} className="text-slate-400 shrink-0" />
              <span>Andrea Solís - Ejecutiva</span>
            </div>
          </div>
        </div>
        <div>
          <span className="text-sm font-bold text-slate-900 mb-2 block">
            Registro:
          </span>
          <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5">
            <span className="text-sm font-semibold text-slate-800">
              {contractRegistry}
            </span>
          </div>
        </div>

        {contractData.documents && contractData.documents.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-900">Documentos:</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${contractData.documents.every(d => d.received)
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-amber-50 text-amber-700 border border-amber-100"
                }`}>
                {contractData.documents.filter(d => d.received).length}/{contractData.documents.length} recibidos
              </span>
            </div>
            <div className="space-y-2">
              {contractData.documents.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border bg-slate-50 border-slate-100 text-sm text-slate-700"
                >
                  <span className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${doc.received
                    ? "bg-emerald-500 text-white"
                    : "bg-rose-400 text-white"
                    }`}>
                    {doc.received
                      ? <Check size={10} strokeWidth={3} />
                      : <X size={10} strokeWidth={3} />}
                  </span>
                  <span>{doc.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function NotesWidget({
  clientNotes: initialClientNotes,
  caseNotes: initialCaseNotes,
}: {
  clientNotes: string
  caseNotes: string
}) {
  const [activeTab, setActiveTab] = useState<"case" | "client">("case")
  const [isEditing, setIsEditing] = useState(false)

  // Committed state
  const [clientNotes, setClientNotes] = useState(initialClientNotes)
  const [caseNotes, setCaseNotes] = useState(initialCaseNotes)

  // Draft state
  const [draftClientNotes, setDraftClientNotes] = useState(initialClientNotes)
  const [draftCaseNotes, setDraftCaseNotes] = useState(initialCaseNotes)

  const handleStartEditing = () => {
    setDraftClientNotes(clientNotes)
    setDraftCaseNotes(caseNotes)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = () => {
    setClientNotes(draftClientNotes)
    setCaseNotes(draftCaseNotes)
    setIsEditing(false)
  }

  // Helper to get current draft note
  const currentDraftNote = activeTab === "case" ? draftCaseNotes : draftClientNotes

  const handleDraftChange = (val: string) => {
    if (activeTab === "case") {
      setDraftCaseNotes(val)
    } else {
      setDraftClientNotes(val)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Notas</h3>
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-500">Información adicional</p>
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-rose-600" onClick={handleCancel} title="Cancelar">
                    <X size={14} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-emerald-600" onClick={handleSave} title="Guardar">
                    <Check size={14} />
                  </Button>
                </div>
              ) : (
                <button type="button" onClick={handleStartEditing} className="text-slate-400 hover:text-indigo-600 transition-colors">
                  <Pencil size={12} />
                </button>
              )}
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab("case")}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === "case"
                ? "bg-indigo-950 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
                }`}
            >
              Caso
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("client")}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === "client"
                ? "bg-indigo-950 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
                }`}
            >
              Cliente
            </button>
          </div>
        </div>
      </div>
      <div className="p-6 pt-2 flex-1">
        <div className="h-full">
          {isEditing ? (
            <Textarea
              value={currentDraftNote}
              onChange={(e) => handleDraftChange(e.target.value)}
              className="text-sm text-slate-700 leading-relaxed bg-white border-slate-200 min-h-[140px] resize-none focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 hover:border-indigo-300 transition-colors h-full"
              placeholder={`Escribe aquí las notas del ${activeTab === 'case' ? 'caso' : 'cliente'}...`}
            />
          ) : (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 h-full overflow-auto">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {activeTab === "case" ? caseNotes : clientNotes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
