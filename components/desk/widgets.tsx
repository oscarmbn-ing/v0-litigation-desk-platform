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
}: {
  description: string
  strategy: string
  tactics: string[]
}) {
  const [isEditing, setIsEditing] = useState(false)

  // Committed state
  const [description, setDescription] = useState(initialDescription)
  const [strategies, setStrategies] = useState<string[]>(
    initialStrategy ? [initialStrategy] : []
  )
  const [tactics, setTactics] = useState<string[]>(initialTactics)

  // Draft state
  const [draftDescription, setDraftDescription] = useState(initialDescription)
  const [draftStrategies, setDraftStrategies] = useState<string[]>(
    initialStrategy ? [initialStrategy] : []
  )
  const [draftTactics, setDraftTactics] = useState<string[]>(initialTactics)

  const handleStartEditing = () => {
    setDraftDescription(description)
    setDraftStrategies([...strategies])
    setDraftTactics([...tactics])
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = () => {
    setDescription(draftDescription)
    setStrategies(draftStrategies)
    setTactics(draftTactics)
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

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col relative">
      <div className="mb-1 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Estrategias y tácticas</h3>
          <p className="text-sm text-slate-500">Información general</p>
        </div>
        <div className="flex gap-1">
          {isEditing ? (
            <>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50" onClick={handleCancel} title="Cancelar">
                <X size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={handleSave} title="Guardar">
                <Check size={16} />
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50" onClick={handleStartEditing} title="Editar">
              <Pencil size={16} />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-5 mt-4 flex-1">
        <div>
          <span className="text-sm font-bold text-slate-900 mb-2 block">
            Contexto:
          </span>
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
          <span className="text-sm font-bold text-slate-900 mb-2 block">
            Estrategia:
          </span>
          {isEditing ? (
            <div className="flex flex-wrap gap-2">
              {draftStrategies.map((strat) => (
                <div key={strat} className="bg-amber-50 text-amber-900 px-3 py-1.5 rounded-lg font-medium text-sm border border-amber-100 flex items-center gap-2 group">
                  <Lightbulb size={14} className="shrink-0" />
                  {strat}
                  <button
                    type="button"
                    onClick={() => handleRemoveStrategy(strat)}
                    className="text-amber-900/50 hover:text-amber-900 transition-colors ml-1"
                  >
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
                    <DropdownMenuItem
                      key={opt}
                      onClick={() => handleAddStrategy(opt)}
                      className="cursor-pointer text-sm"
                      disabled={draftStrategies.includes(opt)}
                    >
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
          <span className="text-sm font-bold text-slate-900 mb-2 block">
            Tácticas:
          </span>
          {isEditing ? (
            <div className="flex flex-wrap gap-2">
              {draftTactics.map((tactic) => (
                <span
                  key={tactic}
                  className="text-sm font-medium px-3 py-1.5 bg-violet-100 text-indigo-950 rounded-lg flex items-center gap-1.5 group"
                >
                  {tactic}
                  <button
                    type="button"
                    onClick={() => handleRemoveTactic(tactic)}
                    className="text-indigo-950/50 hover:text-indigo-950 transition-colors"
                  >
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
                    <DropdownMenuItem
                      key={opt}
                      onClick={() => handleAddTactic(opt)}
                      className="cursor-pointer text-sm"
                      disabled={draftTactics.includes(opt)}
                    >
                      {opt}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tactics.map((tactic) => (
                <span
                  key={tactic}
                  className="text-sm font-medium px-4 py-2 bg-violet-100 text-indigo-950 rounded-xl"
                >
                  {tactic}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        className="mt-6 w-full bg-indigo-950 hover:bg-indigo-900 text-white font-semibold py-2.5 rounded-xl transition-colors"
      >
        Ver ficha
      </button>
    </div>
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
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
        <ShieldCheck size={18} className="text-emerald-600" />
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Ficha del Contrato
        </h4>
      </div>
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase mb-1 block">
            Identificación del contrato
          </span>
          <div className="bg-slate-50 text-slate-700 px-3 py-2 rounded-lg font-medium text-sm border border-slate-100">
            {contractIdentification}
          </div>
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase mb-1 block">
            Equipo
          </span>
          <div className="bg-slate-50 text-slate-700 px-3 py-2 rounded-lg text-sm border border-slate-100 space-y-1.5">
            <div className="flex items-center gap-2">
              <Briefcase size={14} className="text-slate-400" />
              <span>Camilo Cortés - Abogado</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} className="text-slate-400" />
              <span>Andrea Solís - Ejecutiva</span>
            </div>
          </div>
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase mb-1 block">
            Registro
          </span>
          <div className="bg-slate-50 text-slate-700 px-3 py-2 rounded-lg font-medium text-sm border border-slate-100">
            {contractRegistry}
          </div>
        </div>
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
                ? "bg-white text-slate-900 border border-slate-200 shadow-sm"
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
