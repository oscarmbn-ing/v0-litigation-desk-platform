"use client"

import { useMemo, useState, useEffect } from "react"
import type { Client } from "@/lib/data"
import { CLIENTS_DATA } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ChevronsUpDown,
  Check,
  Filter,
  Inbox,
  Network,
  Search,
  Sparkles,
  EyeOff,
  Eye,
  FileText,
  AlertTriangle,
  ArrowRight,
  X,
  Plus,
  Edit2,
  Trash2,
  Bell,
  Lock,
  Unlock,
  ChevronUp,
  User,
  ExternalLink,
  Scale,
  Building2,
  Landmark,
  BookOpen,
  Gavel,
} from "lucide-react"

/* ─── Types ─── */

const ALTERNATIVE_MOVEMENTS: MovementDetail[] = [
  {
    date: "12/12/2025",
    movementType: "resolucion",
    name: "Apercibimiento",
    summary: "Tribunal apercibe para acreditar patrocinio y poder en la causa dentro de tercer día.",
    court: "1° Juzgado Civil de Santiago",
    creditor: "Banco de Chile",
    claimType: "Dilatoria a secas",
    timeline: []
  },
  {
    date: "12/12/2025",
    movementType: "resolucion",
    name: "Certificación",
    summary: "Secretario certifica que no se han presentado escritos dentro de plazo.",
    court: "1° Juzgado Civil de Santiago",
    creditor: "Banco de Chile",
    claimType: "Ejecutivo",
    timeline: []
  },
  {
    date: "12/12/2025",
    movementType: "actuacion",
    name: "Receptor judicial",
    summary: "Receptor estampa búsqueda positiva en domicilio del demandado.",
    court: "1° Juzgado Civil de Santiago",
    creditor: "Banco de Chile",
    claimType: "Ejecutivo",
    timeline: []
  },
  {
    date: "12/12/2025",
    movementType: "resolucion",
    name: "Liquidación",
    summary: "Téngase por aprobada la liquidación del crédito.",
    court: "1° Juzgado Civil de Santiago",
    creditor: "Banco de Chile",
    claimType: "Ejecutivo",
    timeline: []
  }
]

type TaskCategory = "judicial" | "extrajudicial" | "cx"
type TaskSubtype = "movimiento" | "redaccion" | "revision" | "cotizacion" | "gestion" | "comunicacion"
type TaskStatus = "pendiente" | "en_curso" | "ejecutada" | "urgent"

type TabFilter = "todos" | "movimiento" | "gestion" | "cx"
type GroupBy = "none" | "cliente" | "rol"
type FilterCategory = "all" | TaskCategory
type FilterSubtype = "all" | TaskSubtype

type Recommendation = {
  id: string
  text: string
  dueDate: string
  accepted?: boolean
  reason?: string
  type?: string
  assignee?: string
}

type TimelineEvent = {
  date: string
  title: string
  notebook: string
  risk?: "Bajo" | "Medio" | "Alto" | "Crítico"
}

type MovementDetail = {
  date: string
  movementType: "resolucion" | "actuacion"
  name: string
  summary: string
  court?: string
  creditor?: string
  claimType?: string
  timeline: TimelineEvent[]
}

type NotebookData = {
  name: string
  movements: MovementDetail[]
}

type CaseData = {
  caseId: string
  riskIndex: "Bajo" | "Medio" | "Alto" | "Crítico"
  notebooks: NotebookData[]
}

type DeskTask = {
  id: string
  category: TaskCategory
  subtype: TaskSubtype
  title: string
  clientName: string
  caseIds: string[]
  dueLabel: string
  status: TaskStatus
  movementData?: CaseData[]
  recommendations?: Record<string, Recommendation[]>
}

/* ─── Data ─── */

const initialTasks: DeskTask[] = [
  {
    id: "103",
    category: "judicial",
    subtype: "movimiento",
    title: "Movimiento detectado",
    clientName: "Esteban Morales Cerda",
    caseIds: ["C-455-2025", "C-880-2025"],
    dueLabel: "Hoy",
    status: "urgent",
    movementData: [
      {
        caseId: "C-455-2025",
        riskIndex: "Crítico",
        notebooks: [
          {
            name: "Principal",
            movements: [
              {
                date: "12/12/2025",
                movementType: "resolucion",
                name: "Apercibimiento",
                summary: "Tribunal apercibe para acreditar patrocinio y poder en la causa dentro de tercer día.",
                court: "1° Juzgado Civil de Santiago",
                creditor: "Banco de Chile",
                claimType: "Dilatoria a secas",
                timeline: [
                  { date: "12/12/2025", title: "Apercibimiento", notebook: "Principal" },
                  { date: "15/11/2025", title: "Presentación: PyP FEA", notebook: "Principal", risk: "Bajo" },
                  { date: "10/11/2025", title: "Ingreso demanda", notebook: "Principal", risk: "Bajo" },
                  { date: "01/11/2025", title: "Distribución causa", notebook: "Principal", risk: "Bajo" },
                ]
              }
            ]
          },
          {
            name: "Apremio",
            movements: [
              {
                date: "12/12/2025",
                movementType: "actuacion",
                name: "Certificación de búsquedas",
                summary: "Receptor certifica búsquedas negativas para notificación por el 44.",
                court: "1° Juzgado Civil de Santiago",
                creditor: "Banco de Chile",
                claimType: "Dilatoria a secas",
                timeline: [
                  { date: "12/12/2025", title: "Cert. Búsquedas", notebook: "Apremio" },
                  { date: "30/11/2025", title: "Solicitud de notif.", notebook: "Apremio" },
                ]
              }
            ]
          }
        ]
      },
      {
        caseId: "C-880-2025",
        riskIndex: "Crítico",
        notebooks: [
          {
            name: "Principal",
            movements: [
              {
                date: "14/12/2025",
                movementType: "resolucion",
                name: "Citación a oír sentencia",
                summary: "Tribunal cita a las partes a oír sentencia definitiva.",
                court: "3° Juzgado de Letras",
                creditor: "Promotora CMR",
                claimType: "Sumario",
                timeline: [
                  { date: "14/12/2025", title: "Citación Sentencia", notebook: "Principal", risk: "Crítico" },
                  { date: "01/12/2025", title: "Término probatorio", notebook: "Principal", risk: "Medio" },
                ]
              },
              {
                date: "10/12/2025",
                movementType: "actuacion",
                name: "Notificación por cédula",
                summary: "Se practica notificación por cédula al demandado en domicilio registrado.",
                court: "3° Juzgado de Letras",
                creditor: "Promotora CMR",
                claimType: "Sumario",
                timeline: [
                  { date: "10/12/2025", title: "Notif. por cédula", notebook: "Principal", risk: "Bajo" },
                  { date: "01/12/2025", title: "Término probatorio", notebook: "Principal", risk: "Medio" },
                ]
              }
            ]
          }
        ]
      }
    ],
    recommendations: {
      "C-455-2025-Principal-0": [
        { id: "r-1", text: "Presentar PyP FEA", dueDate: "2025-12-13", assignee: "Jose H. - Abogado/a" },
        { id: "r-2", text: "Subsanar observaciones del tribunal", dueDate: "2025-12-14", assignee: "Andrea S. - Ejecutivo/a" },
      ],
      "C-455-2025-Apremio-0": [
        { id: "r-3", text: "Solicitar notificación por el art. 44", dueDate: "2025-12-15" },
      ],
      "C-880-2025-Principal-0": [
        { id: "r-4", text: "Preparar alegatos de clausura", dueDate: "2025-12-16" },
      ],
      "C-880-2025-Principal-1": [
        { id: "r-5", text: "Verificar notificación válida", dueDate: "2025-12-17" },
      ],
    },
  },
  {
    id: "t-2",
    category: "cx",
    subtype: "comunicacion",
    title: "Enviar resumen",
    clientName: "Esteban Morales Cerda",
    caseIds: ["C-455-2025"],
    dueLabel: "Hoy",
    status: "pendiente",
  },
  {
    id: "t-3",
    category: "judicial",
    subtype: "gestion",
    title: "Excepciones dilatorias",
    clientName: "Cristina Aguilera Escobar",
    caseIds: ["C-8938-2022"],
    dueLabel: "Hoy",
    status: "pendiente",
  },
  {
    id: "t-4",
    category: "judicial",
    subtype: "movimiento",
    title: "Movimiento detectado",
    clientName: "Camilo Carrasco Oliva",
    caseIds: ["C-8543-2020"],
    dueLabel: "Hoy",
    status: "pendiente",
    movementData: [
      {
        caseId: "C-8543-2020",
        riskIndex: "Crítico",
        notebooks: [
          {
            name: "Principal",
            movements: [
              {
                date: "10/02/2026",
                movementType: "resolucion",
                name: "Resolucion de mero tramite",
                summary: "Tribunal provee escrito y da traslado.",
                court: "15° Juzgado Civil",
                creditor: "Scotiabank",
                claimType: "Ejecutivo",
                timeline: [
                  { date: "10/02/2026", title: "Mero tramite", notebook: "Principal", risk: "Bajo" },
                  { date: "05/02/2026", title: "Presentacion contestacion", notebook: "Principal", risk: "Bajo" },
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "t-5",
    category: "judicial",
    subtype: "movimiento",
    title: "Movimiento detectado",
    clientName: "Camilo Carrasco Oliva",
    caseIds: ["C-8543-2020"],
    dueLabel: "Hoy",
    status: "en_curso",
  },
  {
    id: "t-6",
    category: "judicial",
    subtype: "redaccion",
    title: "Presentar PyP FEA",
    clientName: "Emilio Vasquez Toro",
    caseIds: ["C-8374-2022"],
    dueLabel: "Hoy",
    status: "pendiente",
  },
  {
    id: "t-7",
    category: "judicial",
    subtype: "redaccion",
    title: "Presentar PyP FEA",
    clientName: "Emilio Vasquez Toro",
    caseIds: ["C-8374-2022"],
    dueLabel: "Manana",
    status: "pendiente",
  },
  {
    id: "t-8",
    category: "cx",
    subtype: "comunicacion",
    title: "Contactar cliente",
    clientName: "Esteban Morales Cerda",
    caseIds: ["C-455-2025"],
    dueLabel: "Manana",
    status: "pendiente",
  },
  {
    id: "t-9",
    category: "judicial",
    subtype: "redaccion",
    title: "Redactar Tengase Presente",
    clientName: "Maria Fernanda Gonzalez",
    caseIds: ["C-498-2025"],
    dueLabel: "En 3 dias",
    status: "pendiente",
  },
  {
    id: "t-10",
    category: "extrajudicial",
    subtype: "cotizacion",
    title: "Cotizar receptor",
    clientName: "Claudia Sepulveda Rios",
    caseIds: ["C-620-2025"],
    dueLabel: "En 4 dias",
    status: "pendiente",
  },
]

const categoryLabel: Record<TaskCategory, string> = {
  judicial: "Judicial",
  extrajudicial: "Extrajudicial",
  cx: "CX",
}

const subtypeLabel: Record<TaskSubtype, string> = {
  movimiento: "Movimiento",
  redaccion: "Redacción",
  revision: "Revisión",
  cotizacion: "Cotización",
  gestion: "Gestión",
  comunicacion: "Comunicación",
}

/* ─── Helpers ─── */

function isToday(label: string) {
  const v = label.toLowerCase()
  return v.includes("hoy") || v.includes("ayer")
}

function dueRank(label: string) {
  const v = label.toLowerCase()
  if (v.includes("ayer")) return 0
  if (v.includes("hoy")) return 1
  if (v.includes("manana")) return 2
  if (v.includes("2 dias") || v.includes("48")) return 3
  if (v.includes("3 dias")) return 4
  if (v.includes("4 dias")) return 5
  if (v.includes("semana")) return 6
  return 7
}

function getInternalMovementCount(task: DeskTask) {
  if (task.subtype !== "movimiento" || !task.movementData) return 0
  return task.movementData.reduce((acc, flow) => {
    return acc + flow.notebooks.reduce((nAcc, nb) => nAcc + nb.movements.length, 0)
  }, 0)
}

/* ─── Component ─── */

export function TasksView({
  onOpenClient,
  initialTaskId,
}: {
  onOpenClient: (client: Client) => void
  initialTaskId?: string | null
}) {
  const [tasks, setTasks] = useState<DeskTask[]>(initialTasks)
  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState<TabFilter>("todos")
  const [groupBy, setGroupBy] = useState<GroupBy>("none")
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all")
  const [filterSubtype, setFilterSubtype] = useState<FilterSubtype>("all")
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  useEffect(() => {
    if (initialTaskId) {
      setSelectedTaskId(initialTaskId)
    }
  }, [initialTaskId])
  const [showProgress, setShowProgress] = useState(true)

  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId],
  )

  /* ── Filtering pipeline ── */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tasks
      .filter((t) => {
        if (t.status === "ejecutada") return false
        if (activeTab === "movimiento") return t.subtype === "movimiento"
        if (activeTab === "gestion")
          return t.category !== "cx" && t.subtype !== "movimiento"
        if (activeTab === "cx") return t.category === "cx"
        return true
      })
      .filter((t) => filterCategory === "all" || t.category === filterCategory)
      .filter((t) => filterSubtype === "all" || t.subtype === filterSubtype)
      .filter((t) => {
        if (!q) return true
        return `${t.title} ${t.clientName} ${t.caseIds.join(" ")} ${categoryLabel[t.category]}`
          .toLowerCase()
          .includes(q)
      })
      .sort((a, b) => dueRank(a.dueLabel) - dueRank(b.dueLabel))
  }, [tasks, query, activeTab, filterCategory, filterSubtype])

  const todayTasks = useMemo(() => filtered.filter((t) => isToday(t.dueLabel)), [filtered])
  const upcomingTasks = useMemo(() => filtered.filter((t) => !isToday(t.dueLabel)), [filtered])

  /* ── Progress ── */
  const totalCount = tasks.filter((t) => t.status !== "ejecutada").length
  const doneCount = tasks.filter((t) => t.status === "ejecutada").length
  const allCount = totalCount + doneCount
  const progressPct = allCount > 0 ? Math.round((doneCount / allCount) * 100) : 0

  /* ── Motivational text ── */
  const motivationText =
    progressPct === 100
      ? "Excelente trabajo!"
      : progressPct >= 50
        ? "Vas por buen camino!"
        : "¡A completar esas misiones!"

  const handleUpdateTask = (updated: DeskTask) => {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
  }

  const handleClose = () => setSelectedTaskId(null)

  /* ── Recommendation helpers (Legacy support if needed) ── */
  const openClientFromTask = (task: DeskTask) => {
    const client = CLIENTS_DATA.find((c) => c.name === task.clientName)
    if (client) onOpenClient(client)
  }

  /* ── Render task section (Hoy / Próximas) ── */
  function renderSection(label: string, list: DeskTask[]) {
    if (list.length === 0) return null

    return (
      <div>
        <h3 className="mb-3 text-base font-bold text-slate-800">{label}</h3>
        <div className="space-y-2">
          {list.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              movementCount={getInternalMovementCount(t)}
              onExecute={() => setSelectedTaskId(t.id)}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* ─── Header ─── */}
      <div className="flex items-end justify-between shrink-0 mb-1">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Misiones</h2>
          <p className="text-base text-slate-500">Revisa y ejecuta tus tareas</p>
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

      {/* ─── Progress ─── */}
      {showProgress && (
        <div className="relative bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shrink-0">
          <button
            onClick={() => setShowProgress(false)}
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            title="Ocultar progreso"
          >
            <EyeOff className="h-4 w-4" />
          </button>
          <div className="flex items-baseline justify-between pr-7">
            <p className="text-sm font-bold text-slate-800">Progreso diario</p>
            <p className="text-2xl font-bold text-[#262262] tabular-nums leading-none">
              {progressPct}
              <span className="ml-0.5 text-sm font-semibold text-slate-400">%</span>
            </p>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#262262] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-500 tabular-nums">
              {doneCount} de {allCount} misiones
            </span>
            <span className="font-semibold text-slate-600">{motivationText}</span>
          </div>
        </div>
      )}

      {/* ─── Search + Filter + Group ─── */}
      <div className="flex gap-4 shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por cliente, rut, causa, etc..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-950/20 text-sm text-slate-800"
          />
        </div>

        {/* Filter dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={`px-4 py-2 border rounded-xl flex items-center gap-2 text-sm transition-colors ${
                filterCategory !== "all" || filterSubtype !== "all"
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Filter size={16} className={filterCategory !== "all" || filterSubtype !== "all" ? "text-indigo-600" : "text-slate-500"} />
              Filtros
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 bg-white">
            <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400">
              Categoría
            </DropdownMenuLabel>
            {(["all", "judicial", "extrajudicial", "cx"] as FilterCategory[]).map(
              (cat) => (
                <DropdownMenuItem
                  key={cat}
                  className={`cursor-pointer ${filterCategory === cat ? "font-semibold text-[#262262]" : ""}`}
                  onClick={() => setFilterCategory(cat)}
                >
                  {cat === "all" ? "Todas" : categoryLabel[cat]}
                </DropdownMenuItem>
              ),
            )}
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400">
              Tipo de tarea
            </DropdownMenuLabel>
            {(["all", "movimiento", "redaccion", "revision", "gestion", "cotizacion", "comunicacion"] as FilterSubtype[]).map(
              (sub) => (
                <DropdownMenuItem
                  key={sub}
                  className={`cursor-pointer ${filterSubtype === sub ? "font-semibold text-[#262262]" : ""}`}
                  onClick={() => setFilterSubtype(sub)}
                >
                  {sub === "all" ? "Todos" : subtypeLabel[sub]}
                </DropdownMenuItem>
              ),
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Group dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={`px-4 py-2 border rounded-xl flex items-center gap-2 text-sm transition-colors ${
                groupBy !== "none"
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Network size={16} className={groupBy !== "none" ? "text-indigo-600" : "text-slate-500"} />
              Agrupar
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white">
            <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400">
              Agrupar por
            </DropdownMenuLabel>
            {([
              { key: "none", label: "Sin agrupar" },
              { key: "cliente", label: "Cliente" },
              { key: "rol", label: "Rol de la causa" },
            ] as Array<{ key: GroupBy; label: string }>).map((opt) => (
              <DropdownMenuItem
                key={opt.key}
                className={`cursor-pointer ${groupBy === opt.key ? "font-semibold text-[#262262]" : ""}`}
                onClick={() => setGroupBy(opt.key)}
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {!showProgress && (
          <button
            type="button"
            onClick={() => setShowProgress(true)}
            className="px-4 py-2 border rounded-xl flex items-center gap-2 text-sm transition-colors bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            title="Mostrar progreso"
          >
            <Eye size={16} className="text-slate-500" />
            Progreso
          </button>
        )}
      </div>

      {/* ─── Tabs ─── */}
      <div className="flex gap-2 shrink-0">
        {(
          [
            { key: "todos", label: "Todos" },
            { key: "movimiento", label: "Movimiento" },
            { key: "gestion", label: "Gestión" },
            { key: "cx", label: "CX" },
          ] as Array<{ key: TabFilter; label: string }>
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-xl border px-5 py-2 text-sm font-medium transition-all ${activeTab === tab.key
              ? "border-slate-300 bg-white text-slate-800 shadow-sm"
              : "border-slate-200 bg-white text-slate-400 hover:text-slate-600"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Task sections ─── */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : groupBy === "cliente" ? (
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 pb-4">
          {Object.entries(
            filtered.reduce((acc, t) => {
              if (!acc[t.clientName]) acc[t.clientName] = []
              acc[t.clientName].push(t)
              return acc
            }, {} as Record<string, DeskTask[]>)
          ).map(([client, clientTasks]) => (
            <div key={client}>{renderSection(client, clientTasks)}</div>
          ))}
        </div>
      ) : groupBy === "rol" ? (
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 pb-4">
          {Object.entries(
            filtered.reduce((acc, t) => {
              t.caseIds.forEach(id => {
                if (!acc[id]) acc[id] = []
                acc[id].push(t)
              })
              return acc
            }, {} as Record<string, DeskTask[]>)
          ).map(([rol, rolTasks]) => (
            <div key={rol}>{renderSection(`Causa: ${rol}`, rolTasks)}</div>
          ))}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 pb-4">
          {renderSection("Hoy", todayTasks)}
          {renderSection("Próximas", upcomingTasks)}
        </div>
      )}

      {/* ─── Detail dialog ─── */}
      <Dialog open={Boolean(selectedTask)} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent
          className="max-w-5xl w-[88vw] p-0 gap-0 overflow-hidden bg-[#f8f9fc]"
        >
          {selectedTask && (
            selectedTask.subtype === 'movimiento' && selectedTask.movementData ? (
              <TaskProcessModal
                task={selectedTask}
                onClose={handleClose}
                onUpdate={handleUpdateTask}
                onOpenClient={onOpenClient}
              />
            ) : (
              // Placeholder for other tasks for now, using a simple view or the old one logic
              <ClassicTaskModal task={selectedTask} onClose={handleClose} openClientFromTask={openClientFromTask} />
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ─── Task card ─── */

function TaskCard({
  task,
  movementCount,
  onExecute,
}: {
  task: DeskTask
  movementCount: number
  onExecute: () => void
}) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:shadow-sm hover:border-slate-300 transition-all text-left w-full">
      <div className="flex items-start justify-between gap-4">
        {/* Left content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-900 transition-colors">
              {task.title}
            </h4>
            {task.subtype === "movimiento" && movementCount > 0 && (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-md bg-[#262262] px-1.5 text-[11px] font-bold text-white">
                {movementCount}
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-4 text-xs">
            <p className="font-medium text-slate-500 flex items-center gap-1.5">
              <User size={12} className="text-slate-400" />
              {task.clientName}
            </p>
            {task.caseIds.length > 0 && (
              <p className="font-medium text-slate-500 flex items-center gap-1.5">
                <Gavel size={12} className="text-slate-400" />
                {task.caseIds.map((c, i) => (
                  <span key={c} className="font-mono text-slate-400 font-normal">
                    {c}{i < task.caseIds.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>

        {/* Right: label + button */}
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span
            className={`rounded border px-2.5 py-1 text-xs font-medium ${task.category === "judicial"
              ? "border-violet-200 bg-violet-50 text-violet-700"
              : task.category === "extrajudicial"
                ? "border-purple-200 bg-purple-50 text-purple-700"
                : "border-teal-200 bg-teal-50 text-teal-700"
              }`}
          >
            {categoryLabel[task.category]}
          </span>
          <button
            type="button"
            onClick={onExecute}
            className="rounded-xl bg-[#262262] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#1d1a4d]"
          >
            Ejecutar
          </button>
        </div>
      </div>
    </div>
  )
}

function TaskProcessModal({ task, onClose, onUpdate, onOpenClient }: { task: DeskTask, onClose: () => void, onUpdate: (t: DeskTask) => void, onOpenClient: (c: Client) => void }) {
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0)
  const [currentNotebookIndex, setCurrentNotebookIndex] = useState(0)
  const [currentMovementIndex, setCurrentMovementIndex] = useState(0)
  const [reviewedKeys, setReviewedKeys] = useState<Set<string>>(new Set())
  const [editRec, setEditRec] = useState<Recommendation | null>(null)
  const [isEditingRec, setIsEditingRec] = useState(false)
  const [tempReason, setTempReason] = useState("")
  const [isSummaryMode, setIsSummaryMode] = useState(false)
  const [correctedMovs, setCorrectedMovs] = useState<Record<string, MovementDetail>>({})
  const [showCorrectionModal, setShowCorrectionModal] = useState(false)
  const [pendingCorrection, setPendingCorrection] = useState("")
  const [correctionExplanation, setCorrectionExplanation] = useState("")
  const [recComboOpen, setRecComboOpen] = useState(false)
  const [recQuery, setRecQuery] = useState("")

  const movementData = task.movementData || []
  const currentCase = movementData[currentCaseIndex]
  const currentNotebook = currentCase?.notebooks[currentNotebookIndex]
  const currentMovements = currentNotebook?.movements || []
  let activeMovement = currentMovements[currentMovementIndex]

  const recKey = currentCase && currentNotebook && activeMovement ? `${currentCase.caseId}-${currentNotebook.name}-${currentMovementIndex}` : ""

  // Override with corrected movement if exists
  if (correctedMovs[recKey]) {
    activeMovement = { ...activeMovement, ...correctedMovs[recKey] }
  }

  const currentRecs = (task.recommendations || {})[recKey] || []

  // Helper: check if all recs for a specific movement are accepted (or none exist)
  const isMovementDone = (caseId: string, nbName: string, movIdx: number) => {
    const recs = (task.recommendations || {})[`${caseId}-${nbName}-${movIdx}`] || []
    return recs.length === 0 || recs.every((r) => r.accepted)
  }

  // Helper: check if all movements in a notebook are done
  const isNotebookDone = (caseId: string, nb: NotebookData) => {
    return nb.movements.length > 0 && nb.movements.every((_, movIdx) => isMovementDone(caseId, nb.name, movIdx))
  }

  // Helper: check if all notebooks in a case are done
  const isCaseDone = (c: CaseData) => {
    return c.notebooks.length > 0 && c.notebooks.every((nb) => isNotebookDone(c.caseId, nb))
  }

  // All movements across all cases done?
  const allDone = movementData.length > 0 && movementData.every((c) => isCaseDone(c))

  const isLastStep =
    currentCaseIndex === movementData.length - 1 &&
    currentCase &&
    currentNotebookIndex === currentCase.notebooks.length - 1 &&
    currentMovementIndex === currentMovements.length - 1

  const recOptions = [
    "Presentar excepciones dilatorias",
    "Presentar lista de testigos",
    "Presentar curso progresivo",
    "Presentar PyP FEA",
    "Solicitar abandono del procedimiento",
    "Téngase presente",
    "Solicitar entorpecimiento",
    "Contestar demanda",
    "Objetar documentos",
    "Coordinar ratificación",
    "Contactar cliente",
    "Cotizar notificación",
    "Contactar archivero",
  ]

  // Auto-assign responsable based on rec type:
  // tasks starting with "Presentar", "Solicitar", "Contestar", "Objetar", or "Téngase" → Abogado
  // contact/coordination tasks → Ejecutivo
  const CONTACT_KEYWORDS = ["Contactar", "Coordinar", "Cotizar"]
  const LAWYER_KEYWORDS = ["Presentar", "Solicitar", "Contestar", "Objetar", "Téngase"]
  const getAssigneeForRec = (text: string): string => {
    if (CONTACT_KEYWORDS.some((k) => text.startsWith(k))) return "Andrea S. - Ejecutivo/a"
    if (LAWYER_KEYWORDS.some((k) => text.startsWith(k))) return "Jose H. - Abogado/a"
    return ""
  }

  /* ── Navigation ── */
  const handleNext = () => {
    if (currentCase && currentNotebook) {
      const key = `${currentCase.caseId}-${currentNotebook.name}-${currentMovementIndex}`
      setReviewedKeys((prev) => new Set(prev).add(key))
    }
    if (currentMovementIndex < currentMovements.length - 1) {
      setCurrentMovementIndex((prev) => prev + 1)
    } else if (currentNotebookIndex < currentCase.notebooks.length - 1) {
      setCurrentNotebookIndex((prev) => prev + 1)
      setCurrentMovementIndex(0)
    } else if (currentCaseIndex < movementData.length - 1) {
      setCurrentCaseIndex((prev) => prev + 1)
      setCurrentNotebookIndex(0)
      setCurrentMovementIndex(0)
    } else {
      setIsSummaryMode(true)
    }
  }

  const handleCompleteTask = () => {
    onUpdate({ ...task, status: "ejecutada" })
    onClose()
  }

  const updateRecs = (newRecs: Recommendation[]) => {
    onUpdate({ ...task, recommendations: { ...(task.recommendations || {}), [recKey]: newRecs } })
  }

  /* ── Recommendation handlers ── */
  const handleAddRec = () => {
    const newRec: Recommendation = {
      id: `new-${Date.now()}`,
      text: "",
      dueDate: new Date().toISOString().split("T")[0],
      type: "General",
      assignee: "",
    }
    updateRecs([...currentRecs, newRec])
  }

  const handleEditRecClick = (rec: Recommendation) => {
    if (editRec?.id === rec.id) {
      // Toggle off
      setEditRec(null)
      setTempReason("")
      setIsEditingRec(false)
    } else {
      setEditRec({ ...rec })
      setTempReason(rec.reason || "")
      setIsEditingRec(true)
    }
  }

  const handleSaveRec = () => {
    if (!editRec) return
    const derivedAssignee = getAssigneeForRec(editRec.text)
    updateRecs(currentRecs.map((r) => r.id === editRec.id
      ? { ...editRec, reason: tempReason, assignee: derivedAssignee || editRec.assignee }
      : r
    ))
    setIsEditingRec(false)
    setEditRec(null)
    setTempReason("")
  }

  const handleDeleteRec = (id: string) => {
    updateRecs(currentRecs.filter((r) => r.id !== id))
  }

  const handleToggleAcceptRec = (rec: Recommendation) => {
    updateRecs(currentRecs.map((r) => r.id === rec.id ? { ...r, accepted: !r.accepted } : r))
  }

  const handleDateChange = (id: string, newDate: string) => {
    updateRecs(currentRecs.map((r) => r.id === id ? { ...r, dueDate: newDate } : r))
  }

  const handleCorrectMovement = (movName: string) => {
    const selected = ALTERNATIVE_MOVEMENTS.find(m => m.name === movName)
    if (selected) {
      setCorrectedMovs(prev => ({ ...prev, [recKey]: selected }))

      // Update recommendations based on new movement type
      let newRecs: Recommendation[] = []
      if (selected.name === "Certificación") {
        newRecs = [{ id: `auto-${Date.now()}`, text: "Solicitar cumplimiento incidental", dueDate: new Date().toISOString().split('T')[0], type: "Sugerencia" }]
      } else if (selected.name === "Liquidación") {
        newRecs = [{ id: `auto-${Date.now()}`, text: "Objetar liquidación", dueDate: new Date().toISOString().split('T')[0], type: "Sugerencia" }]
      } else if (selected.name === "Receptor judicial") {
        newRecs = [{ id: `auto-${Date.now()}`, text: "Téngase presente búsqueda", dueDate: new Date().toISOString().split('T')[0], type: "Sugerencia" }]
      }

      updateRecs(newRecs)
    }
  }

  /* ── Summary Mode ── */
  if (isSummaryMode) {
    return (
      <div className="flex flex-col h-[85vh]">
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
          <DialogTitle className="text-lg font-bold text-slate-800">Resumen de Acciones</DialogTitle>
        </div>
        <div className="flex-1 p-8 overflow-y-auto bg-[#f8f9fc]">
          <div className="mx-auto max-w-2xl space-y-8">
            <div className="space-y-2 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Revisión completada</h3>
              <p className="text-slate-500">Has revisado {reviewedKeys.size} cuadernos en total.</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                <h4 className="font-bold text-slate-700">Recomendaciones generadas</h4>
              </div>
              <div className="divide-y divide-slate-100">
                {Object.entries(task.recommendations || {}).flatMap(([key, recs]) =>
                  recs.map((rec) => (
                    <div key={rec.id} className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("h-2 w-2 rounded-full", rec.accepted ? "bg-green-500" : "bg-slate-300")} />
                        <div>
                          <p className="font-medium text-slate-800">{rec.text}</p>
                          <p className="text-xs text-slate-500">{key} &bull; {rec.dueDate}</p>
                        </div>
                      </div>
                      {rec.accepted && <Badge variant="outline" className="border-green-200 bg-green-50 text-green-600">Aceptada</Badge>}
                    </div>
                  ))
                )}
                {(!task.recommendations || Object.values(task.recommendations).flat().length === 0) && (
                  <div className="px-6 py-8 text-center text-slate-400">No hay recomendaciones</div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
          <Button variant="ghost" onClick={() => setIsSummaryMode(false)}>Volver a revisar</Button>
          <Button className="min-w-[140px] bg-[#262262] hover:bg-[#1d1a4d]" onClick={handleCompleteTask}>Ejecutar Tarea</Button>
        </div>
      </div>
    )
  }

  if (!currentCase || !activeMovement) return null

  return (
    <div className="flex flex-col h-[85vh]">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <DialogTitle className="text-base font-bold text-slate-800">{task.title}</DialogTitle>
            <span className="text-sm font-medium text-slate-500">{task.clientName}</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mr-6"
          onClick={() => {
            const client = CLIENTS_DATA.find(c => c.name === task.clientName)
            if (client) {
              window.open(`/?view=clients&clientId=${client.id}`, '_blank')
            }
          }}
        >
          Abrir Radar <User className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* ── Case Selector + Notebook Tabs (single row) ── */}
      <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-0 h-[52px]">
        {/* Causa dropdown */}
        <Select
          value={currentCaseIndex.toString()}
          onValueChange={(v) => { setCurrentCaseIndex(parseInt(v)); setCurrentNotebookIndex(0); setCurrentMovementIndex(0) }}
        >
          <SelectTrigger className="h-8 w-auto min-w-[180px] border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-700 shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {movementData.map((c, idx) => {
              const totalMovements = c.notebooks.reduce((sum, nb) => sum + nb.movements.length, 0)
              const caseDone = isCaseDone(c)
              return (
                <SelectItem key={c.caseId} value={idx.toString()}>
                  Causa: {c.caseId} ({totalMovements}) {caseDone ? " ✓" : ""}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>

        {/* Notebook tabs inline */}
        <div className="flex h-full items-center gap-5 overflow-x-auto">
          {currentCase.notebooks.map((nb, idx) => {
            const isActive = idx === currentNotebookIndex
            const nbDone = isNotebookDone(currentCase.caseId, nb)
            return (
              <button
                key={nb.name}
                onClick={() => { setCurrentNotebookIndex(idx); setCurrentMovementIndex(0) }}
                className={cn(
                  "flex h-full items-center gap-2 border-b-2 text-sm font-medium transition-all",
                  isActive ? "border-[#262262] text-[#262262]" : "border-transparent text-slate-500 hover:text-slate-700",
                )}
              >
                {nb.name}
                <span className={cn(
                  "flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                  nbDone ? "bg-green-100 text-green-600" : isActive ? "bg-[#262262] text-white" : "bg-slate-200 text-slate-500",
                )}>
                  {nbDone ? <CheckCircle2 className="h-3 w-3" /> : nb.movements.length}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex-1" />

        {/* Movement pills inline (only when >1 movements) */}
        {currentMovements.length > 1 && (
          <div className="flex shrink-0 items-center gap-1">
            {currentMovements.map((_, idx) => {
              const movDone = isMovementDone(currentCase.caseId, currentNotebook.name, idx)
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentMovementIndex(idx)}
                  className={cn(
                    "h-7 min-w-[28px] rounded-md px-2 text-xs font-bold transition-all",
                    movDone && idx !== currentMovementIndex
                      ? "bg-green-50 text-green-600 border border-green-200"
                      : idx === currentMovementIndex
                        ? "bg-[#262262] text-white shadow-sm"
                        : "bg-slate-100 text-slate-500 border border-slate-200 hover:border-[#262262]/30 hover:text-[#262262]",
                  )}
                >
                  {movDone && idx !== currentMovementIndex ? <CheckCircle2 className="h-3 w-3" /> : idx + 1}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Correction Modal ── */}
      <Dialog open={showCorrectionModal} onOpenChange={(open) => {
        setShowCorrectionModal(open)
        if (!open) { setPendingCorrection(""); setCorrectionExplanation("") }
      }}>
        <DialogContent className="max-w-lg gap-0 p-0 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <DialogTitle className="text-base font-bold text-slate-800">
              Reportar movimiento incorrecto
            </DialogTitle>
          </div>

          {/* Body */}
          <div className="space-y-5 px-6 py-5">
            {/* Movimiento correcto */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Seleccionar movimiento correcto
              </label>
              <Select value={pendingCorrection} onValueChange={setPendingCorrection}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {ALTERNATIVE_MOVEMENTS.map((m) => (
                    <SelectItem key={m.name} value={m.name}>
                      {m.name} <span className="text-slate-400">({m.movementType})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Explicación obligatoria */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Motivos del reporte
                <span className="ml-1 text-red-500">*</span>
              </label>
              <textarea
                value={correctionExplanation}
                onChange={(e) => setCorrectionExplanation(e.target.value)}
                placeholder="Debe explicar por qué el movimiento detectado es incorrecto..."
                rows={4}
                className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#262262]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#262262]/10"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
            <Button
              variant="ghost"
              onClick={() => { setShowCorrectionModal(false); setPendingCorrection(""); setCorrectionExplanation("") }}
            >
              Cancelar
            </Button>
            <Button
              className="bg-[#262262] hover:bg-[#1d1a4d]"
              disabled={!pendingCorrection || !correctionExplanation.trim()}
              onClick={() => {
                handleCorrectMovement(pendingCorrection)
                setShowCorrectionModal(false)
                setPendingCorrection("")
                setCorrectionExplanation("")
              }}
            >
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Scrollable Content (single column) ── */}
      <div className="flex-1 overflow-y-auto bg-[#f8f9fc] p-8">
        <div className="mx-auto max-w-5xl space-y-6">

          {/* Movement Details Card */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Card header: title + badge + report button */}
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-slate-800">{activeMovement.name}</h4>
                  <Badge variant={activeMovement.movementType === "resolucion" ? "default" : "secondary"} className="text-[10px] uppercase">
                    {activeMovement.movementType}
                  </Badge>
                </div>
                <span className="mt-0.5 block text-sm text-slate-400">{activeMovement.date}</span>
              </div>
              {/* Reportar incorrecto */}
              <button
                onClick={() => { setPendingCorrection(activeMovement.name); setShowCorrectionModal(true) }}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                Reportar incorrecto
              </button>
            </div>


            <div className="p-6">
              <div className="mb-5 rounded-lg border border-blue-100 bg-blue-50/50 p-5">
                <p className="text-base font-medium leading-relaxed text-slate-700">
                  &ldquo;{activeMovement.summary}&rdquo;
                </p>
              </div>
              <div className="flex items-end justify-between">
                <div className="grid grid-cols-2 gap-x-16 gap-y-1 text-sm text-slate-600">
                  <div>
                    <span className="mb-0.5 block text-xs uppercase text-slate-400">Tribunal</span>
                    <span className="text-sm font-medium">{activeMovement.court}</span>
                  </div>
                  <div>
                    <span className="mb-0.5 block text-xs uppercase text-slate-400">Acreedor</span>
                    <span className="text-sm font-medium">{activeMovement.creditor}</span>
                  </div>
                </div>
                {/* Ver documento */}
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#262262] underline-offset-2 hover:underline"
                >
                  Ver documento
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h5 className="flex items-center gap-2 font-bold text-slate-800">
                <Sparkles className="h-4 w-4 text-[#262262]" />
                Recomendaciones sugeridas
              </h5>
              <Button size="sm" variant="ghost" className="h-8 text-[#262262]" onClick={handleAddRec}>
                <Plus className="mr-1 h-4 w-4" /> Agregar
              </Button>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              {currentRecs.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center">
                  <p className="text-sm font-medium text-slate-400">No se asignan tareas al movimiento</p>
                </div>
              ) : (
                <div className="grid grid-cols-[160px_minmax(180px,320px)_1fr_160px]">
                  {/* Header cells */}
                  <div className="border-b border-slate-100 bg-slate-50 px-4 py-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Fecha</span>
                  </div>
                  <div className="border-b border-slate-100 bg-slate-50 px-4 py-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Recomendación</span>
                  </div>
                  <div className="border-b border-slate-100 bg-slate-50 px-4 py-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Responsable</span>
                  </div>
                  <div className="border-b border-slate-100 bg-slate-50 px-4 py-2" />

                  {/* Data rows — each rec contributes 4 consecutive cells */}
                  {currentRecs.map((rec, recIdx) => {
                    const isLocked = rec.accepted
                    const rowBg = cn(isLocked ? "bg-green-50/30" : "hover:bg-slate-50/60")
                    const borderTop = recIdx > 0 ? "border-t border-slate-100" : ""
                    return (
                      <>
                        {/* Fecha */}
                        <div key={`${rec.id}-date`} className={cn("flex items-center px-4 py-3", rowBg, borderTop)}>
                          <label className={cn(
                            "relative inline-flex w-full items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm font-medium overflow-hidden",
                            isLocked
                              ? "border-transparent bg-transparent text-slate-500 cursor-default"
                              : "border-slate-200 bg-white text-slate-700 hover:border-[#262262]/30 cursor-pointer",
                          )}>
                            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#262262]/50" />
                            <input
                              type="date"
                              className={cn(
                                "w-full border-none bg-transparent text-sm font-medium text-slate-700 outline-none [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:w-full",
                                isLocked && "pointer-events-none text-slate-500",
                              )}
                              value={rec.dueDate}
                              onChange={(e) => handleDateChange(rec.id, e.target.value)}
                              disabled={isLocked}
                            />
                          </label>
                        </div>

                        {/* Recomendación */}
                        <div key={`${rec.id}-text`} className={cn("flex flex-col justify-center gap-0.5 px-4 py-3", rowBg, borderTop)}>
                          <p className={cn("text-sm font-semibold truncate", isLocked ? "text-green-800" : "text-slate-800")}>
                            {rec.text || <span className="font-normal italic text-slate-400">Sin acción seleccionada</span>}
                          </p>
                          {rec.reason && (
                            <p className="flex items-start gap-1 text-xs text-slate-400">
                              <span className="shrink-0 font-medium not-italic text-slate-500">Motivo:</span>
                              <span className="italic truncate">{rec.reason}</span>
                            </p>
                          )}
                        </div>

                        {/* Responsable */}
                        <div key={`${rec.id}-assignee`} className={cn("flex items-center px-4 py-3", rowBg, borderTop)}>
                          <span className={cn("truncate text-sm", rec.assignee ? "text-slate-700 font-medium" : "italic text-slate-400")}>
                            {rec.assignee || "Sin responsable"}
                          </span>
                        </div>

                        {/* Actions */}
                        <div key={`${rec.id}-actions`} className={cn("flex items-center justify-end gap-1 px-4 py-3", rowBg, borderTop)}>
                          {isLocked ? (
                            <>
                              <Badge className="gap-1 border-none bg-green-100 text-green-700 hover:bg-green-100">
                                <CheckCircle2 className="h-3 w-3" /> Aceptado
                              </Badge>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-300 hover:text-slate-500" onClick={() => handleToggleAcceptRec(rec)} title="Desbloquear">
                                <Unlock className="h-3.5 w-3.5" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-[#262262]" onClick={() => handleEditRecClick(rec)}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => handleDeleteRec(rec.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button size="sm" className="h-8 bg-[#262262] text-xs" onClick={() => handleToggleAcceptRec(rec)} disabled={!rec.text}>
                                Aceptar
                              </Button>
                            </>
                          )}
                        </div>

                      </>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Horizontal Timeline (4 items including current) */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Línea de tiempo</h5>
            </div>
            <div className="px-5 py-6">
              <div className="relative mx-auto mb-6 max-w-3xl">
                {/* Horizontal line */}
                <div className="absolute left-[8%] right-[8%] top-[14px] h-[2px] bg-slate-200" />
                <div className="relative flex justify-between">
                  {[...activeMovement.timeline].slice(0, 4).reverse().map((event, idx, arr) => {
                    const isCurrent = idx === arr.length - 1
                    return (
                      <div key={idx} className="relative z-10 flex w-28 flex-col items-center text-center">
                        <div
                          className={cn(
                            "mb-2 flex h-7 w-7 items-center justify-center rounded-full border-[3px] bg-white",
                            isCurrent
                              ? "border-[#262262] bg-[#262262] shadow-md"
                              : "border-slate-200",
                          )}
                        >
                          {isCurrent ? (
                            <Bell className="h-3 w-3 text-white" />
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-slate-300" />
                          )}
                        </div>
                        <span className={cn("text-[10px] font-bold", isCurrent ? "text-[#262262]" : "text-slate-400")}>
                          {event.date}
                        </span>
                        <span className={cn("mt-0.5 text-xs font-bold leading-tight", isCurrent ? "text-slate-900" : "text-slate-500")}>
                          {event.title}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
              {/* Context footer */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                <p><span className="font-bold text-slate-700">Tipo de reclamación:</span> {activeMovement.claimType}</p>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-700">Riesgo:</span>
                  <Badge
                    className={cn(
                      "h-5 border-none px-2 font-bold",
                      currentCase.riskIndex === "Crítico" ? "bg-red-50 text-red-700"
                        : currentCase.riskIndex === "Medio" ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700",
                    )}
                  >
                    {currentCase.riskIndex}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
        <Button variant="ghost" onClick={onClose} className="text-slate-500 hover:text-slate-800">Cancelar</Button>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-slate-600" onClick={onClose}>Marcar Imposible</Button>
          <Button onClick={handleNext} className="min-w-[140px] bg-[#262262] hover:bg-[#1d1a4d]" disabled={isLastStep && !allDone}>
            {isLastStep ? "Finalizar Tarea" : (<>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></>)}
          </Button>
        </div>
      </div>

      {/* ── Edit Recommendation Modal ── */}
      {isEditingRec && editRec && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <h4 className="text-lg font-bold text-slate-800">Editar Recomendación</h4>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400" onClick={() => setIsEditingRec(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-5 p-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">Seleccionar nueva acción</Label>
                <Popover open={recComboOpen} onOpenChange={setRecComboOpen}>
                  <PopoverTrigger asChild>
                    <button
                      className={cn(
                        "flex h-11 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-left outline-none",
                        "hover:border-slate-300 focus:border-[#262262]/40 focus:ring-2 focus:ring-[#262262]/10",
                        !editRec.text && "text-slate-400",
                      )}
                    >
                      {editRec.text ? (
                        <span className="flex items-center gap-1.5">
                          {editRec.text}
                          {getAssigneeForRec(editRec.text) && (
                            <span className="text-slate-400 font-normal">— {getAssigneeForRec(editRec.text)}</span>
                          )}
                        </span>
                      ) : (
                        "Buscar o seleccionar acción..."
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-slate-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[420px] p-0 shadow-md" align="start">
                    <div>
                      <div className="flex items-center border-b border-slate-100 px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 text-slate-400" />
                        <input
                          autoFocus
                          className="flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-slate-400"
                          placeholder="Buscar acción..."
                          value={recQuery}
                          onChange={(e) => setRecQuery(e.target.value)}
                        />
                      </div>
                      <div
                        className="max-h-[260px] overflow-y-scroll overscroll-contain p-1"
                        style={{ scrollbarGutter: "stable" }}
                        onWheel={(e) => {
                          e.stopPropagation()
                          e.currentTarget.scrollTop += e.deltaY
                        }}
                      >
                        {recOptions.filter((o) => o.toLowerCase().includes(recQuery.toLowerCase())).length === 0 && (
                          <div className="py-6 text-center text-sm text-slate-400">Sin resultados.</div>
                        )}
                        {recOptions
                          .filter((o) => o.toLowerCase().includes(recQuery.toLowerCase()))
                          .map((opt) => {
                            const assignee = getAssigneeForRec(opt)
                            const isSelected = editRec.text === opt
                            return (
                              <button
                                key={opt}
                                type="button"
                                className={cn(
                                  "flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-left",
                                  isSelected ? "bg-slate-100 font-medium" : "hover:bg-slate-50",
                                )}
                                onClick={() => {
                                  setEditRec({ ...editRec, text: opt, assignee: getAssigneeForRec(opt) || editRec.assignee })
                                  setRecComboOpen(false)
                                  setRecQuery("")
                                }}
                              >
                                <Check className={cn("mr-2 h-4 w-4 shrink-0 text-[#262262]", isSelected ? "opacity-100" : "opacity-0")} />
                                <span>{opt}</span>
                                {assignee && <span className="ml-1.5 text-slate-400 font-normal">— {assignee}</span>}
                              </button>
                            )
                          })}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">Motivos del cambio <span className="text-red-500">*</span></Label>
                <Textarea
                  placeholder="Debe explicar obligatoriamente por qué cambia la estrategia..."
                  value={tempReason}
                  onChange={(e) => setTempReason(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>
            </div>
            <div className="border-t border-slate-100 px-6 py-3">
              <p className="text-xs text-slate-400">
                Recuerda <span className="font-medium text-slate-500">aceptar la recomendación</span> una vez guardada para que se cree la tarea correspondiente.
              </p>
            </div>
            <div className="flex justify-end gap-3 bg-slate-50 px-6 py-5">
              <Button variant="outline" onClick={() => setIsEditingRec(false)}>Cancelar</Button>
              <Button className="min-w-[100px] bg-[#262262] hover:bg-[#1d1a4d] text-white" onClick={handleSaveRec} disabled={!tempReason.trim()}>
                Aceptar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ClassicTaskModal({ task, onClose, openClientFromTask }: { task: DeskTask, onClose: () => void, openClientFromTask: (t: DeskTask) => void }) {
  return (
    <div className="p-6">
      <DialogHeader>
        <DialogTitle>{task.title}</DialogTitle>
        <DialogDescription>
          {task.clientName} &middot; {task.caseIds.join(", ")}
        </DialogDescription>
      </DialogHeader>
      <div className="py-8 text-center text-slate-500">
        <p>Vista detallada clásica...</p>
      </div>
      <DialogFooter>
        <Button onClick={onClose}>Cerrar</Button>
        <Button className="bg-[#262262]" onClick={() => openClientFromTask(task)}>
          Ir al expediente
        </Button>
      </DialogFooter>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <div className="rounded-2xl bg-slate-50 p-4 text-slate-400">
        <Inbox className="h-8 w-8" />
      </div>
      <p className="text-base font-bold text-slate-700">No hay tareas para este filtro</p>
      <p className="text-sm text-slate-500">
        Prueba otro criterio de busqueda o filtro.
      </p>
    </div>
  )
}
