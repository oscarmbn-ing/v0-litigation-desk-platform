"use client"

import { useState } from "react"
import {
  Target,
  Lightbulb,
  ShieldCheck,
  ScrollText,
  Building,
  StickyNote,
  Briefcase,
  Users,
  MessageCircle,
} from "lucide-react"
import type { ContractData } from "@/lib/data"

export function DossierWidget({
  description,
  strategy,
  tactics,
}: {
  description: string
  strategy: string
  tactics: string[]
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
        <Target size={18} className="text-indigo-600" />
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Estrategia & Tacticas
        </h4>
      </div>
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase mb-1 block">
            Contexto
          </span>
          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
            {description}
          </p>
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase mb-1 block">
            Estrategia
          </span>
          <div className="bg-amber-50 text-amber-900 px-3 py-2 rounded-lg font-medium text-sm border border-amber-100 flex items-center gap-2">
            <Lightbulb size={16} />
            {strategy}
          </div>
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase mb-2 block">
            Tacticas
          </span>
          <div className="flex flex-wrap gap-2">
            {tactics.map((tactic) => (
              <span
                key={tactic}
                className="text-xs font-medium px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100"
              >
                {tactic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProtectionWidget({
  contractData,
}: {
  contractData: ContractData
}) {
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
            Estrategia Aplicada
          </span>
          <div className="bg-emerald-50 text-emerald-900 px-3 py-2 rounded-lg font-medium text-sm border border-emerald-100 flex items-center gap-2">
            <ScrollText size={16} />
            {contractData.strategy}
          </div>
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase mb-2 block">
            Activos Involucrados
          </span>
          <div className="space-y-2">
            {contractData.assetsInvolved?.map((asset) => (
              <div
                key={asset}
                className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded"
              >
                <Building size={14} className="text-slate-400" />
                {asset}
              </div>
            ))}
          </div>
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase mb-1 block">
            Notas del Activo
          </span>
          <div className="flex items-start gap-2 text-sm text-slate-500 italic bg-slate-50 p-2 rounded border border-dashed border-slate-200">
            <StickyNote size={14} className="shrink-0 mt-0.5" />
            {contractData.contractNotes || "Sin notas adicionales."}
          </div>
        </div>
      </div>
    </div>
  )
}

export function NotesWidget({
  clientNotes,
  caseNotes,
}: {
  clientNotes: string
  caseNotes: string
}) {
  const [activeTab, setActiveTab] = useState<"case" | "client">("case")

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="flex border-b border-slate-100">
        <button
          type="button"
          onClick={() => setActiveTab("case")}
          className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            activeTab === "case"
              ? "bg-white text-indigo-700 border-b-2 border-indigo-600"
              : "bg-slate-50 text-slate-500 hover:text-slate-700"
          }`}
        >
          <Briefcase size={16} /> Notas Proceso
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("client")}
          className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            activeTab === "client"
              ? "bg-white text-emerald-600 border-b-2 border-emerald-500"
              : "bg-slate-50 text-slate-500 hover:text-slate-700"
          }`}
        >
          <Users size={16} /> Notas Cliente
        </button>
      </div>
      <div className="p-5 flex-1 bg-gradient-to-b from-white to-slate-50/50">
        <div className="flex items-start gap-3">
          {activeTab === "case" ? (
            <StickyNote
              className="text-indigo-400 shrink-0 mt-1"
              size={18}
            />
          ) : (
            <MessageCircle
              className="text-emerald-400 shrink-0 mt-1"
              size={18}
            />
          )}
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {activeTab === "case" ? caseNotes : clientNotes}
          </p>
        </div>
      </div>
    </div>
  )
}
