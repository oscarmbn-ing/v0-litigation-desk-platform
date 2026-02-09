// --- DEFINICION DE ETAPAS (Contexto Judicial) ---
export const JUDICIAL_STAGES = [
  { id: 1, name: "Para estudio", label: "Estudio" },
  { id: 2, name: "En redaccion", label: "Redaccion" },
  { id: 3, name: "Admisibilidad", label: "Admisibilidad" },
  { id: 4, name: "Termino probatorio", label: "Probatorio" },
  { id: 5, name: "Sentencia", label: "Sentencia" },
]

// --- DEFINICION DE ETAPAS (Contexto Proteccion Patrimonial) ---
export const PROTECTION_STAGES = [
  { id: 1, name: "Diagnostico", label: "Diagnostico" },
  { id: 2, name: "Borrador", label: "Redaccion" },
  { id: 3, name: "Notaria", label: "Firma Notarial" },
  { id: 4, name: "Inscripcion", label: "CBR / Registro" },
  { id: 5, name: "Finalizado", label: "Blindado" },
]

// --- TIPOS ---
export interface HistoryEvent {
  date: string
  type: string
  icon: string
  title: string
  desc: string
}

export interface Task {
  id: number
  title: string
  due: string
  status: "urgent" | "pending"
  assignee: string
}

export interface Notebook {
  label: string
  status: string
  isActive?: boolean
  history: HistoryEvent[] | Record<number, HistoryEvent[]>
}

export interface JudicialData {
  currentStage: number
  nextAction: string
  deadline: string | null
  description: string
  strategy: string
  tactics: string[]
  caseNotes: string
  tasks: Task[]
  notebooks: {
    principal: {
      label: string
      status: string
      history: Record<number, HistoryEvent[]>
    }
    apremio: Notebook
    terceria: Notebook
  }
}

export interface ContractData {
  id: string
  type: string
  icon: string
  detail: string
  currentStage: number
  nextAction: string
  deadline: string | null
  strategy: string
  assetsInvolved: string[]
  contractNotes: string
  tasks: Task[]
  history: Record<number, HistoryEvent[]>
}

export interface ProtectionData {
  isActive: boolean
  contracts: ContractData[]
}

export interface CaseEntry {
  id: string
  creditor: string
  active: boolean
}

export interface Client {
  id: number
  name: string
  initials: string
  cases: CaseEntry[]
  activeCaseId: string
  activeCreditor: string
  health: "critical" | "warning" | "healthy"
  healthScore: number
  mood: string
  clientNotes: string
  judicialData: JudicialData
  protectionData: ProtectionData
}

export interface Stage {
  id: number
  name: string
  label: string
}

// --- MOCK DATA ---
export const CLIENTS_DATA: Client[] = [
  {
    id: 1,
    name: "Esteban Morales Cerda",
    initials: "EM",
    cases: [
      { id: "C-455-2025", creditor: "Scotiabank", active: true },
      { id: "C-880-2025", creditor: "Banco Estado", active: false },
    ],
    activeCaseId: "C-455-2025",
    activeCreditor: "Scotiabank",
    health: "critical",
    healthScore: 45,
    mood: "ansioso",
    clientNotes:
      "Cliente muy ansioso, llamar solo en las tardes. Prefiere contacto por correo y WhatsApp.",
    judicialData: {
      currentStage: 4,
      nextAction: "Presentar lista de testigos",
      deadline: "2 dias",
      description:
        "Cliente demandado por Scotiabank (credito consumo). Requiere dilatacion para negociar quita.",
      strategy: "Dilatacion y Defensa de Fondo",
      tactics: [
        "Defensa en juicio",
        "Monitoreo diario",
        "Excepcion de prescripcion",
      ],
      caseNotes:
        "Juez del 1er Juzgado suele fallar rapido en admisibilidad. Ojo con la notificacion.",
      tasks: [
        {
          id: 101,
          title: "Lista de Testigos",
          due: "Manana",
          status: "urgent",
          assignee: "Andrea Solis",
        },
        {
          id: 102,
          title: "Revisar liquidacion",
          due: "En 4 dias",
          status: "pending",
          assignee: "Jose Herrera",
        },
      ],
      notebooks: {
        principal: {
          label: "Principal",
          status: "Probatorio",
          history: {
            1: [
              {
                date: "10/11/2025",
                type: "hito",
                icon: "doc",
                title: "Recepcion de carpeta",
                desc: "Cliente entrega notificaciones.",
              },
            ],
            3: [
              {
                date: "20/11/2025",
                type: "hito",
                icon: "gavel",
                title: "Resolucion: Traslado",
                desc: "Tribunal confiere traslado.",
              },
            ],
          },
        },
        apremio: {
          label: "Apremio",
          status: "Embargo",
          isActive: true,
          history: [
            {
              date: "05/12/2025",
              type: "hito",
              icon: "hammer",
              title: "Mandamiento de Ejecucion",
              desc: "Despachese mandamiento de ejecucion y embargo.",
            },
            {
              date: "15/12/2025",
              type: "hito",
              icon: "alert",
              title: "Embargo Frustrado",
              desc: "Receptor no pudo entrar al domicilio. Se solicita fuerza publica.",
            },
            {
              date: "20/12/2025",
              type: "hito",
              icon: "check",
              title: "Solicitud Fuerza Publica",
              desc: "Presentado escrito solicitando auxilio de carabineros.",
            },
          ],
        },
        terceria: {
          label: "Terceria",
          status: "No iniciada",
          isActive: false,
          history: [],
        },
      },
    },
    protectionData: {
      isActive: true,
      contracts: [
        {
          id: "CTR-001",
          type: "CV Inmueble",
          icon: "home",
          detail: "Parcela Lampa",
          currentStage: 3,
          nextAction: "Coordinar firma escritura",
          deadline: "Viernes",
          strategy: "Separacion de Bienes + Venta",
          assetsInvolved: ["Parcela Lampa Rol 44-5"],
          contractNotes:
            "Comprador es la conyuge. Revisar liquidacion sociedad conyugal previa.",
          tasks: [
            {
              id: 201,
              title: "Agendar firma notaria",
              due: "Hoy",
              status: "urgent",
              assignee: "Camila Asistente",
            },
          ],
          history: {
            1: [
              {
                date: "01/12/2025",
                type: "hito",
                icon: "eye",
                title: "Tasacion Fiscal",
                desc: "Revision de avaluo.",
              },
            ],
            2: [
              {
                date: "05/12/2025",
                type: "hito",
                icon: "edit",
                title: "Borrador enviado",
                desc: "A espera de VB cliente.",
              },
            ],
          },
        },
        {
          id: "CTR-002",
          type: "CV Vehiculo",
          icon: "car",
          detail: "Mazda 3 2020",
          currentStage: 1,
          nextAction: "Obtener CAV y Multas",
          deadline: null,
          strategy: "Traspaso a tercero",
          assetsInvolved: ["Mazda 3 Patente FW-22"],
          contractNotes:
            "Vehiculo tiene prenda, revisar alzamiento antes de transferir.",
          tasks: [
            {
              id: 205,
              title: "Solicitar estado prenda",
              due: "Lunes",
              status: "pending",
              assignee: "Jose Herrera",
            },
          ],
          history: {},
        },
      ],
    },
  },
  {
    id: 2,
    name: "Maria Fernanda Gonzalez",
    initials: "MF",
    cases: [{ id: "C-498-2025", creditor: "Falabella", active: true }],
    activeCaseId: "C-498-2025",
    activeCreditor: "Falabella",
    health: "healthy",
    healthScore: 92,
    mood: "tranquilo",
    clientNotes: "Cliente tranquilo.",
    judicialData: {
      currentStage: 3,
      nextAction: "Esperando resolucion",
      deadline: null,
      description: "Demanda por incumplimiento de pagare.",
      strategy: "Monitoreo",
      tactics: ["Revision periodica"],
      caseNotes: "Sin novedades.",
      tasks: [],
      notebooks: {
        principal: {
          label: "Principal",
          status: "Admisibilidad",
          history: {},
        },
        apremio: {
          label: "Apremio",
          status: "No iniciado",
          isActive: false,
          history: [],
        },
        terceria: {
          label: "Terceria",
          status: "No iniciada",
          isActive: false,
          history: [],
        },
      },
    },
    protectionData: {
      isActive: false,
      contracts: [],
    },
  },
]
