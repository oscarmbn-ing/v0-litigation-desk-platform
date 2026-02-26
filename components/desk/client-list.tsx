"use client"

import { useState, useMemo } from "react"
import { Search, Filter, ChevronRight, ShieldCheck, Home, PowerOff, Scale, Building2, Landmark, BookOpen, Check, PlusCircle, ChevronDown, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { CLIENTS_DATA, TIPOS_RECLAMACION, ACREEDORES, TRIBUNALES } from "@/lib/data"
import type { Client } from "@/lib/data"
import { HealthAvatar } from "./shared"

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

function getPendingTaskCounts(client: Client) {
  const normalizeDue = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase()

  const allTasks = [
    ...client.judicialData.tasks,
    ...client.protectionData.contracts.flatMap((contract) => contract.tasks),
  ]

  const pendingTasks = allTasks.filter(
    (task) => task.status === "pending" || task.status === "urgent"
  )

  const todayTasks = pendingTasks.filter(
    (task) => task.status === "urgent" || normalizeDue(task.due) === "hoy"
  )
  const otherDaysTasks = pendingTasks.filter(
    (task) => !(task.status === "urgent" || normalizeDue(task.due) === "hoy")
  )

  return {
    today: todayTasks.length,
    otherDays: otherDaysTasks.length,
  }
}

function normalize(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
}

function matchesSearch(client: Client, query: string): boolean {
  if (!query) return true
  const q = normalize(query)
  return (
    normalize(client.name).includes(q) ||
    normalize(client.email).includes(q) ||
    normalize(client.rut).includes(q) ||
    normalize(client.activeCreditor).includes(q)
  )
}

const FILTER_TYPES = [
  { id: 'tipo', label: 'Tipo de Reclamacion', options: TIPOS_RECLAMACION },
  { id: 'riesgo', label: 'Indice de Riesgo', options: ['Critico', 'Medio', 'Bajo'] },
  { id: 'acreedor', label: 'Acreedor', options: ACREEDORES },
  { id: 'tribunal', label: 'Tribunal', options: TRIBUNALES },
]

export function ClientList({
  onSelectClient,
}: {
  onSelectClient: (client: Client) => void
}) {
  const [query, setQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [openAddFilter, setOpenAddFilter] = useState(false)
  const [activeFilterTypes, setActiveFilterTypes] = useState<string[]>([])

  const [filterTipo, setFilterTipo] = useState<string[]>([])
  const [filterRiesgo, setFilterRiesgo] = useState<string[]>([])
  const [filterAcreedor, setFilterAcreedor] = useState<string[]>([])
  const [filterTribunal, setFilterTribunal] = useState<string[]>([])

  const toggleFilterType = (typeId: string) => {
    if (activeFilterTypes.includes(typeId)) {
      setActiveFilterTypes(prev => prev.filter(t => t !== typeId))
      if (typeId === 'tipo') setFilterTipo([])
      if (typeId === 'riesgo') setFilterRiesgo([])
      if (typeId === 'acreedor') setFilterAcreedor([])
      if (typeId === 'tribunal') setFilterTribunal([])
    } else {
      setActiveFilterTypes(prev => [...prev, typeId])
    }
  }

  const getFilterValues = (typeId: string) => {
    if (typeId === 'tipo') return filterTipo;
    if (typeId === 'riesgo') return filterRiesgo;
    if (typeId === 'acreedor') return filterAcreedor;
    if (typeId === 'tribunal') return filterTribunal;
    return []
  }

  const toggleFilterValue = (typeId: string, value: string) => {
    const updateArray = (prev: string[]) => {
      if (prev.includes(value)) return prev.filter(v => v !== value)
      return [...prev, value]
    }
    if (typeId === 'tipo') setFilterTipo(updateArray);
    if (typeId === 'riesgo') setFilterRiesgo(updateArray);
    if (typeId === 'acreedor') setFilterAcreedor(updateArray);
    if (typeId === 'tribunal') setFilterTribunal(updateArray);
  }

  const resetFilterValues = (typeId: string) => {
    if (typeId === 'tipo') setFilterTipo([]);
    if (typeId === 'riesgo') setFilterRiesgo([]);
    if (typeId === 'acreedor') setFilterAcreedor([]);
    if (typeId === 'tribunal') setFilterTribunal([]);
  }

  const clearFilters = () => {
    setActiveFilterTypes([])
    setFilterTipo([])
    setFilterRiesgo([])
    setFilterAcreedor([])
    setFilterTribunal([])
  }

  const filtered = useMemo(
    () => CLIENTS_DATA.filter((c) => {
      if (!matchesSearch(c, query)) return false
      if (filterTipo.length > 0 && !filterTipo.includes(c.tipoReclamacion)) return false

      if (filterRiesgo.length > 0) {
        const riskLabel = c.health === "critical" ? "Critico" : c.health === "warning" ? "Medio" : "Bajo"
        if (!filterRiesgo.includes(riskLabel)) return false
      }

      if (filterAcreedor.length > 0 && !filterAcreedor.includes(c.activeCreditor)) return false
      if (filterTribunal.length > 0 && !filterTribunal.includes(c.tribunal)) return false

      return true
    }),
    [query, filterTipo, filterRiesgo, filterAcreedor, filterTribunal]
  )

  const immediateClients = filtered.filter(hasImmediateAction)
  const followUpClients = filtered.filter((client) => !hasImmediateAction(client))

  const renderClientCard = (client: Client) => {
    const ppStatus = getProtectionStatus(client)
    const pendingTaskCounts = getPendingTaskCounts(client)
    const ppTag = ppStatus === "PP en curso"
      ? { label: "P.P. en curso", icon: <Home size={12} />, style: "bg-emerald-50 text-emerald-700 border-emerald-200" }
      : ppStatus === "PP exitosa"
        ? { label: "P.P. Exitosa", icon: <ShieldCheck size={12} />, style: "bg-indigo-50 text-indigo-700 border-indigo-200" }
        : { label: "Sin P.P.", icon: <PowerOff size={12} />, style: "bg-slate-50 text-slate-400 border-slate-200" }

    return (
      <button
        type="button"
        key={client.id}
        onClick={() => onSelectClient(client)}
        className="bg-white p-4 rounded-2xl border border-slate-100 hover:shadow-sm hover:border-slate-200 transition-all cursor-pointer group text-left w-full"
      >
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <div className="flex items-center gap-4 w-full md:w-2/3">
            <HealthAvatar
              initials={client.initials}
              health={client.health}
            />
            <div>
              <h3 className="font-bold text-slate-900 transition-colors">
                {client.name}
              </h3>
              <p className="text-xs text-slate-500">
                {client.email}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {client.cases.length} {client.cases.length === 1 ? "juicio" : "juicios"}
              </p>
              <div className="mt-1 flex items-center gap-3 flex-wrap">
                {pendingTaskCounts.today > 0 && (
                  <p className="text-xs font-medium text-rose-700">
                    {pendingTaskCounts.today} {pendingTaskCounts.today === 1 ? "tarea" : "tareas"} para hoy
                  </p>
                )}
                {pendingTaskCounts.today > 0 && pendingTaskCounts.otherDays > 0 && (
                  <span className="text-slate-300 text-xs leading-none">•</span>
                )}
                {pendingTaskCounts.otherDays > 0 && (
                  <p className="text-xs font-medium text-slate-600">
                    {pendingTaskCounts.otherDays} {pendingTaskCounts.otherDays === 1 ? "tarea" : "tareas"} proximas
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 w-full md:w-1/3 pl-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium ${ppTag.style}`}>
              {ppTag.icon}
              {ppTag.label}
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <ChevronRight className="text-slate-300 group-hover:text-slate-400 transition-colors" />
          </div>
        </div>
      </button>
    )
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Radar de Clientes</h2>
          <p className="text-base text-slate-500">Gestiona tu cartera de clientes</p>
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

      <div className="flex flex-col gap-4 shrink-0">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, email, RUT o acreedor..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-950/20 text-sm text-slate-800"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border rounded-xl flex items-center gap-2 text-sm transition-colors ${showFilters || activeFilterTypes.length > 0
              ? "border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
          >
            <Filter size={16} className={showFilters || activeFilterTypes.length > 0 ? "text-indigo-600" : "text-slate-500"} />
            Filtros {activeFilterTypes.length > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-md bg-indigo-100/80 text-xs font-bold">{activeFilterTypes.length}</span>}
          </button>
        </div>

        {showFilters && (
          <div className="flex items-center flex-wrap gap-2 -mt-1.5">
            {activeFilterTypes.map((typeId) => {
              const ft = FILTER_TYPES.find(f => f.id === typeId)!
              const values = getFilterValues(typeId)
              const displayText = values.length === 0 ? null : values.length === 1 ? values[0] : `${values.length} opciones`

              return (
                <Popover key={typeId}>
                  <PopoverTrigger asChild>
                    <button className="h-8 bg-white border border-dashed border-slate-300 hover:border-indigo-300 hover:bg-indigo-50/50 flex items-center gap-1.5 rounded-lg px-2.5 text-xs transition-colors group">
                      <span className="font-semibold text-slate-600 group-hover:text-indigo-700">{ft.label}</span>
                      {displayText ? (
                        <>
                          <div className="h-3 w-px bg-slate-300" />
                          <span className="text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.5 rounded text-[11px] truncate max-w-[150px]">{displayText}</span>
                        </>
                      ) : (
                        <ChevronDown size={14} className="text-slate-400 group-hover:text-indigo-500" />
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[240px] p-0" align="start">
                    <Command>
                      <div className="px-3 pt-3 pb-2 border-b border-slate-100">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-tight">
                            {ft.label} es
                          </span>
                          <button
                            onClick={() => toggleFilterType(typeId)}
                            className="text-slate-400 hover:text-rose-500 transition-colors"
                            title={`Eliminar filtro de ${ft.label}`}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <div className="[&_[cmdk-input-wrapper]]:border-none [&_[cmdk-input-wrapper]]:px-2 [&_[cmdk-input-wrapper]]:bg-slate-100/80 [&_[cmdk-input-wrapper]]:rounded-md [&_[cmdk-input-wrapper]_svg]:h-3.5 [&_[cmdk-input-wrapper]_svg]:w-3.5 [&_[cmdk-input-wrapper]_svg]:opacity-40 [&_[cmdk-input-wrapper]_svg]:mr-1.5 [&_[cmdk-input-wrapper]_svg]:mt-0.5">
                          <CommandInput placeholder="Buscar valores" className="h-7 py-0.5 text-xs bg-transparent border-none focus:ring-0" />
                        </div>
                      </div>
                      <CommandList>
                        <CommandEmpty className="py-4 text-xs">No hay opciones.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem onSelect={() => resetFilterValues(typeId)} className="flex items-center gap-2 py-2 text-xs">
                            {values.length === 0 ? <Check size={14} className="text-indigo-600 shrink-0" /> : <div className="w-4 shrink-0" />}
                            Todos
                          </CommandItem>
                          {ft.options.map((opt) => (
                            <CommandItem key={opt} onSelect={() => toggleFilterValue(typeId, opt)} className="flex items-center gap-2 py-2 text-xs">
                              {values.includes(opt) ? <Check size={14} className="text-indigo-600 shrink-0" /> : <div className="w-4 shrink-0" />}
                              <span className="truncate">{opt}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )
            })}

            {activeFilterTypes.length < FILTER_TYPES.length && (
              <Popover open={openAddFilter} onOpenChange={setOpenAddFilter}>
                <PopoverTrigger asChild>
                  <button className={`h-8 flex items-center gap-1.5 rounded-lg px-2.5 text-xs transition-colors group ${activeFilterTypes.length === 0
                    ? "bg-white border border-dashed border-slate-300 hover:border-indigo-300 hover:bg-indigo-50/50 font-semibold text-slate-600 group-hover:text-indigo-700"
                    : "text-slate-500 hover:text-indigo-600 font-medium"
                    }`}>
                    <PlusCircle size={14} className={activeFilterTypes.length === 0 ? "text-slate-400 group-hover:text-indigo-500" : ""} />
                    {activeFilterTypes.length === 0 ? "Añadir filtro" : "Añadir filtro"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-0" align="start">
                  <Command className="[&_[cmdk-input-wrapper]_svg]:h-4 [&_[cmdk-input-wrapper]_svg]:w-4 [&_[cmdk-input-wrapper]_svg]:opacity-40">
                    <CommandInput placeholder="Buscar filtro..." className="h-8.5 text-xs" />
                    <CommandList>
                      <CommandEmpty className="py-4 text-xs">No se encontraron filtros.</CommandEmpty>
                      <CommandGroup>
                        {FILTER_TYPES.filter(ft => !activeFilterTypes.includes(ft.id)).map((ft) => (
                          <CommandItem
                            key={ft.id}
                            onSelect={() => {
                              toggleFilterType(ft.id)
                              setOpenAddFilter(false)
                            }}
                            className="flex items-center gap-2 py-2 pl-3 text-xs"
                          >
                            {ft.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}

            {activeFilterTypes.length > 0 && (
              <button
                className="h-8 text-xs text-slate-400 hover:text-slate-600 px-2 ml-auto transition-colors underline"
                onClick={clearFilters}
              >
                Limpiar todos
              </button>
            )}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          {query && activeFilterTypes.length > 0
            ? `No se encontraron clientes para "${query}" con los filtros actuales`
            : activeFilterTypes.length > 0
              ? "No hay resultados para estos filtros"
              : `No se encontraron clientes para "${query}"`}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          {immediateClients.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-rose-700 tracking-wide pl-1">
                  Para hoy
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
                <h3 className="text-sm font-bold text-slate-600 tracking-wide pl-1">
                  Sin tareas para hoy
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
      )}
    </div>
  )
}
