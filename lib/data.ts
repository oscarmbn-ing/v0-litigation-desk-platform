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
  category?: "presentacion" | "resolucion" | "comunicacion" | "movimiento" | "hito"
  responsible?: {
    role: "abogado" | "ejecutivo" | "sistema"
    name: string
  }
  hasDocument?: boolean
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
  stageDates?: Record<number, string>
  debtAmount?: number
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
  stageDates?: Record<number, string>
  nextAction: string
  deadline: string | null
  strategy: string
  assetsInvolved: string[]
  contractNotes: string
  tasks: Task[]
  history: Record<number, HistoryEvent[]>
  documents?: { name: string; received: boolean }[]
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

export interface ComercialStatus {
  cuotasPagadas: number
  cuotasTotal: number
  alDia: boolean
}

export interface Client {
  id: number
  name: string
  initials: string
  rut: string
  claveUnica: string
  email: string
  cases: CaseEntry[]
  activeCaseId: string
  activeCreditor: string
  health: "critical" | "warning" | "healthy"
  healthScore: number
  mood: string
  clientNotes: string
  comercialStatus: ComercialStatus
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
    rut: "12.345.678-9",
    claveUnica: "Esteban2025!",
    email: "esteban.morales@correo.cl",
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
    comercialStatus: { cuotasPagadas: 3, cuotasTotal: 24, alDia: false },
    judicialData: {
      currentStage: 3,
      stageDates: { 1: "10/11/2025", 2: "15/11/2025", 3: "19/11/2025" },
      debtAmount: 3500000,
      nextAction: "Acreditar PyP con FEA",
      deadline: "3 dias",
      description:
        "Cliente demandado por Scotiabank (credito consumo). Requiere dilatacion para negociar quita.",
      strategy: "Defensa en Juicio",
      tactics: [
        "Monitoreo",
        "Dilatación + P.P",
        "Tercería incorrecta",
      ],
      caseNotes:
        "Juez del 1er Juzgado suele fallar rapido en admisibilidad. Ojo con la notificacion.",
      tasks: [
        {
          id: 103,
          title: "Movimiento detectado",
          due: "Hoy",
          status: "urgent",
          assignee: "Jose Herrera",
        },
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
          due: "Hoy",
          status: "urgent",
          assignee: "Jose Herrera",
        },
      ],
      notebooks: {
        principal: {
          label: "Principal",
          status: "Admisibilidad",
          history: {
            1: [
              {
                date: "10/11/2025",
                type: "hito",
                icon: "doc",
                title: "Recepcion de carpeta",
                desc: "Cliente entrega notificaciones.",
                category: "hito",
                responsible: { role: "ejecutivo", name: "Maria Paz" },
              },
            ],
            2: [
              {
                date: "15/11/2025",
                type: "presentacion",
                icon: "doc",
                title: "Presentación demanda",
                desc: "La contraparte presenta escrito de demanda ejecutiva.",
                category: "presentacion",
                responsible: { role: "ejecutivo", name: "Andrea Solis" },
                hasDocument: true,
              },
              {
                date: "18/11/2025",
                type: "presentacion",
                icon: "doc",
                title: "Presentación: excepciones dilatorias",
                desc: "El equipo presenta excepciones dilatorias en defensa del deudor.",
                category: "presentacion",
                responsible: { role: "ejecutivo", name: "Andrea Solis" },
                hasDocument: true,
              },
            ],
            3: [
              {
                date: "15/12/2025",
                type: "presentacion",
                icon: "doc",
                title: "Presentación: PyP FEA",
                desc: "Se presenta escrito de acreditando PyP con FEA.",
                category: "presentacion",
                responsible: { role: "abogado", name: "José Herrera" },
                hasDocument: true,
              },
              {
                date: "12/12/2025",
                type: "resolucion",
                icon: "gavel",
                title: "Resolución: Apercibimiento",
                desc: "Tribunal apercibe para acreditar patrocinio y poder en la causa.",
                category: "resolucion",
                responsible: { role: "abogado", name: "José Herrera" },
                hasDocument: true,
              },
              {
                date: "20/11/2025",
                type: "comunicacion",
                icon: "mail",
                title: "Correo: Presentamos excepciones",
                desc: "Se envió correo al cliente informando presentación de excepciones dilatorias.",
                category: "comunicacion",
                responsible: { role: "abogado", name: "José Herrera" },
                hasDocument: true,
              },
            ],
            4: [
              {
                date: "15/12/2025",
                type: "presentacion",
                icon: "doc",
                title: "Presentación: PyP FEA",
                desc: "Se presenta escrito de acreditando PyP con FEA.",
                category: "presentacion",
                responsible: { role: "abogado", name: "José Herrera" },
                hasDocument: true,
              },
              {
                date: "12/12/2025",
                type: "resolucion",
                icon: "gavel",
                title: "Resolución: Apercibimiento",
                desc: "Tribunal apercibe para acreditar patrocinio y poder en la causa.",
                category: "resolucion",
                responsible: { role: "sistema", name: "Tribunal" },
                hasDocument: true,
              },
              {
                date: "20/11/2025",
                type: "comunicacion",
                icon: "mail",
                title: "Correo: Presentamos excepciones",
                desc: "Se envió correo al cliente informando presentación de excepciones dilatorias.",
                category: "comunicacion",
                responsible: { role: "abogado", name: "José Herrera" },
                hasDocument: true,
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
              date: "20/12/2025",
              type: "presentacion",
              icon: "doc",
              title: "Solicitud Fuerza Publica",
              desc: "Presentado escrito solicitando auxilio de carabineros.",
              category: "presentacion",
              responsible: { role: "abogado", name: "José Herrera" },
              hasDocument: true,
            },
            {
              date: "15/12/2025",
              type: "movimiento",
              icon: "alert",
              title: "Embargo Frustrado",
              desc: "Receptor no pudo entrar al domicilio. Se solicita fuerza publica.",
              category: "movimiento",
              responsible: { role: "ejecutivo", name: "Andrea Solis" },
              hasDocument: true,
            },
            {
              date: "05/12/2025",
              type: "resolucion",
              icon: "hammer",
              title: "Mandamiento de Ejecucion",
              desc: "Despachese mandamiento de ejecucion y embargo.",
              category: "resolucion",
              responsible: { role: "abogado", name: "José Herrera" },
              hasDocument: true,
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
          stageDates: { 1: "03/12/2025", 2: "09/12/2025", 3: "13/12/2025" },
          nextAction: "Coordinar firma escritura",
          deadline: "Viernes",
          strategy: "Separacion de Bienes + Venta",
          assetsInvolved: ["Parcela Lampa Rol 44-5"],
          contractNotes:
            "Cliente casado en sociedad conyugal, tiene parcela y vehículo, señala que transferirá ambos a su primo en Curicó; viajará para la firma.",
          tasks: [
            {
              id: 201,
              title: "Recepcionar contrato notariado",
              due: "Hoy",
              status: "urgent",
              assignee: "Camilo Cortés",
            },
          ],
          history: {
            1: [
              {
                date: "03/12/2025",
                type: "comunicacion",
                icon: "mail",
                title: "Solicitud de documentos",
                desc: "Se solicita al cliente la documentación para redactar la escritura.",
                category: "comunicacion",
                responsible: { role: "ejecutivo", name: "Andrea Solis" },
                hasDocument: true,
              },
              {
                date: "05/12/2025",
                type: "presentacion",
                icon: "upload",
                title: "Cliente envía documentación",
                desc: "Cliente remite antecedentes requeridos para preparación de escritura.",
                category: "presentacion",
                responsible: { role: "ejecutivo", name: "Andrea Solis" },
                hasDocument: true,
              },
              {
                date: "07/12/2025",
                type: "hito",
                icon: "eye",
                title: "Estudio de antecedentes",
                desc: "Equipo ejecutivo revisa y valida documentación recibida.",
                category: "hito",
                responsible: { role: "ejecutivo", name: "Andrea Solis" },
                hasDocument: true,
              },
            ],
            2: [
              {
                date: "09/12/2025",
                type: "presentacion",
                icon: "doc",
                title: "Inicio redacción de escritura",
                desc: "Abogado inicia redacción de borrador de escritura.",
                category: "presentacion",
                responsible: { role: "abogado", name: "José Herrera" },
                hasDocument: true,
              },
              {
                date: "11/12/2025",
                type: "hito",
                icon: "eye",
                title: "Revisión por Capitán de Operaciones",
                desc: "Se envía escritura a revisión interna de calidad.",
                category: "hito",
                responsible: { role: "abogado", name: "Capitán de Operaciones" },
                hasDocument: true,
              },
              {
                date: "12/12/2025",
                type: "resolucion",
                icon: "check",
                title: "Aprobación de revisión interna",
                desc: "Capitán de Operaciones aprueba versión final para firma.",
                category: "resolucion",
                responsible: { role: "abogado", name: "Capitán de Operaciones" },
                hasDocument: true,
              },
            ],
            3: [
              {
                date: "13/12/2025",
                type: "comunicacion",
                icon: "mail",
                title: "Cotización firma en notaría",
                desc: "Ejecutivo solicita cotización de firma y queda a la espera de respuesta.",
                category: "comunicacion",
                responsible: { role: "ejecutivo", name: "Andrea Solis" },
                hasDocument: true,
              },
              {
                date: "15/12/2025",
                type: "comunicacion",
                icon: "mail",
                title: "Respuesta de notaría recibida",
                desc: "Se recibe confirmación de costos y disponibilidad de firma.",
                category: "comunicacion",
                responsible: { role: "ejecutivo", name: "Andrea Solis" },
                hasDocument: true,
              },
              {
                date: "16/12/2025",
                type: "hito",
                icon: "check",
                title: "Coordinación con cliente",
                desc: "Se coordina día y hora para firma con el cliente.",
                category: "hito",
                responsible: { role: "ejecutivo", name: "Andrea Solis" },
                hasDocument: true,
              },
            ],
          },
          documents: [
            { name: "Dominio Vigente con copia", received: true },
            { name: "Hipotecas y Gravámenes", received: true },
            { name: "Avaúo Fiscal", received: true },
            { name: "No deuda TGR", received: true },
          ],
        },
        {
          id: "CTR-002",
          type: "CV Vehiculo",
          icon: "car",
          detail: "Mazda 3 2020",
          currentStage: 1,
          stageDates: { 1: "20/11/2025" },
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
          documents: [
            { name: "Permiso de Circulación al día", received: false },
            { name: "Anotaciones Vigentes", received: false },
            { name: "SOAP", received: false },
          ],
        },
      ],
    },
  },
  {
    id: 2,
    name: "Maria Fernanda Gonzalez",
    initials: "MF",
    rut: "13.456.789-0",
    claveUnica: "Maria2024#",
    email: "maria.gonzalez@correo.cl",
    cases: [{ id: "C-498-2025", creditor: "Falabella", active: true }],
    activeCaseId: "C-498-2025",
    activeCreditor: "Falabella",
    health: "healthy",
    healthScore: 92,
    mood: "tranquilo",
    clientNotes: "Cliente tranquilo.",
    comercialStatus: { cuotasPagadas: 18, cuotasTotal: 24, alDia: true },
    judicialData: {
      currentStage: 3,
      stageDates: { 1: "01/10/2025", 2: "15/10/2025", 3: "01/11/2025" },
      debtAmount: 1200000,
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
  {
    id: 3,
    name: "Ricardo Paredes Mella",
    initials: "RP",
    rut: "10.987.654-3",
    claveUnica: "Ricardo@456",
    email: "ricardo.paredes@correo.cl",
    cases: [{ id: "C-712-2025", creditor: "Banco de Chile", active: true }],
    activeCaseId: "C-712-2025",
    activeCreditor: "Banco de Chile",
    health: "warning",
    healthScore: 68,
    mood: "inquieto",
    clientNotes: "Prefiere contacto por correo y reunion semanal.",
    comercialStatus: { cuotasPagadas: 7, cuotasTotal: 36, alDia: false },
    judicialData: {
      currentStage: 2,
      stageDates: { 1: "25/11/2025", 2: "08/12/2025" },
      debtAmount: 8900000,
      nextAction: "Preparar escrito de excepciones",
      deadline: "2 dias",
      description: "Demanda ejecutiva por deuda comercial.",
      strategy: "Defensa activa",
      tactics: ["Excepciones", "Control de plazos"],
      caseNotes: "Revisar notificacion y preparar acompanamiento probatorio.",
      tasks: [
        {
          id: 301,
          title: "Validar antecedentes de pago parcial",
          due: "Manana",
          status: "urgent",
          assignee: "Jose Herrera",
        },
      ],
      notebooks: {
        principal: {
          label: "Principal",
          status: "Redaccion",
          history: {
            2: [
              {
                date: "08/12/2025",
                type: "presentacion",
                icon: "doc",
                title: "Preparacion de excepciones",
                desc: "Se prepara borrador de excepciones dilatorias.",
                category: "presentacion",
                responsible: { role: "abogado", name: "Jose Herrera" },
                hasDocument: true,
              },
            ],
          },
        },
        apremio: { label: "Apremio", status: "No iniciado", isActive: false, history: [] },
        terceria: { label: "Terceria", status: "No iniciada", isActive: false, history: [] },
      },
    },
    protectionData: {
      isActive: true,
      contracts: [
        {
          id: "CTR-101",
          type: "CV Inmueble",
          icon: "home",
          detail: "Depto Nunoa",
          currentStage: 2,
          stageDates: { 1: "02/12/2025", 2: "10/12/2025" },
          nextAction: "Enviar borrador para revision interna",
          deadline: "Jueves",
          strategy: "Venta a tercero relacionado",
          assetsInvolved: ["Depto Nunoa Rol 110-22"],
          contractNotes: "Cliente coordina firma durante la proxima semana.",
          tasks: [
            {
              id: 311,
              title: "Revisar observaciones de redaccion",
              due: "Hoy",
              status: "urgent",
              assignee: "Camilo Cortes",
            },
          ],
          history: {
            1: [
              {
                date: "02/12/2025",
                type: "comunicacion",
                icon: "mail",
                title: "Solicitud de documentos",
                desc: "Ejecutivo solicita documentos base para escritura.",
                category: "comunicacion",
                responsible: { role: "ejecutivo", name: "Andrea Solis" },
                hasDocument: true,
              },
            ],
            2: [
              {
                date: "10/12/2025",
                type: "presentacion",
                icon: "doc",
                title: "Inicio de redaccion",
                desc: "Abogado inicia redaccion de escritura.",
                category: "presentacion",
                responsible: { role: "abogado", name: "Camilo Cortes" },
                hasDocument: true,
              },
            ],
          },
        },
      ],
    },
  },
  {
    id: 4,
    name: "Paula Arriagada Soto",
    initials: "PA",
    rut: "15.234.567-8",
    claveUnica: "Paula789$",
    email: "paula.arriagada@correo.cl",
    cases: [{ id: "C-901-2024", creditor: "Santander", active: true }],
    activeCaseId: "C-901-2024",
    activeCreditor: "Santander",
    health: "healthy",
    healthScore: 88,
    mood: "tranquila",
    clientNotes: "Cliente ordenada, envia documentos el mismo dia.",
    comercialStatus: { cuotasPagadas: 20, cuotasTotal: 24, alDia: true },
    judicialData: {
      currentStage: 4,
      stageDates: { 1: "01/08/2025", 2: "20/08/2025", 3: "10/09/2025", 4: "01/10/2025" },
      debtAmount: 15000000,
      nextAction: "Esperar resolucion probatoria",
      deadline: null,
      description: "Proceso en termino probatorio con defensa consolidada.",
      strategy: "Monitoreo judicial",
      tactics: ["Seguimiento semanal"],
      caseNotes: "No hay alertas criticas en esta causa.",
      tasks: [],
      notebooks: {
        principal: { label: "Principal", status: "Probatorio", history: {} },
        apremio: { label: "Apremio", status: "No iniciado", isActive: false, history: [] },
        terceria: { label: "Terceria", status: "No iniciada", isActive: false, history: [] },
      },
    },
    protectionData: {
      isActive: true,
      contracts: [
        {
          id: "CTR-201",
          type: "CV Inmueble",
          icon: "home",
          detail: "Casa Talca",
          currentStage: 5,
          stageDates: { 1: "01/09/2025", 2: "12/09/2025", 3: "20/09/2025", 4: "05/10/2025", 5: "01/11/2025" },
          nextAction: "Contrato finalizado",
          deadline: null,
          strategy: "Separacion de bienes y venta",
          assetsInvolved: ["Casa Talca Rol 20-18"],
          contractNotes: "Contrato firmado e inscrito sin observaciones.",
          tasks: [],
          history: {
            5: [
              {
                date: "05/11/2025",
                type: "resolucion",
                icon: "check",
                title: "Contrato blindado",
                desc: "Proceso completado y cerrado por el equipo.",
                category: "resolucion",
                responsible: { role: "abogado", name: "Camilo Cortes" },
                hasDocument: true,
              },
            ],
          },
        },
      ],
    },
  },
  {
    id: 5,
    name: "Nicolas Quintana Vera",
    initials: "NQ",
    rut: "16.543.210-1",
    claveUnica: "Nico2025*",
    email: "nicolas.quintana@correo.cl",
    cases: [{ id: "C-333-2025", creditor: "Itau", active: true }],
    activeCaseId: "C-333-2025",
    activeCreditor: "Itau",
    health: "critical",
    healthScore: 41,
    mood: "estresado",
    clientNotes: "Cliente solicita reportes cortos por WhatsApp.",
    comercialStatus: { cuotasPagadas: 1, cuotasTotal: 18, alDia: false },
    judicialData: {
      currentStage: 3,
      stageDates: { 1: "05/12/2025", 2: "18/12/2025", 3: "02/01/2026" },
      debtAmount: 4750000,
      nextAction: "Acreditar personeria",
      deadline: "Hoy",
      description: "Causa en admisibilidad con apercibimiento del tribunal.",
      strategy: "Defensa procesal",
      tactics: ["Control de escritos", "Alerta de plazos"],
      caseNotes: "Priorizar respuesta antes de las 14:00.",
      tasks: [
        {
          id: 501,
          title: "Subir escrito de acreditacion",
          due: "Hoy",
          status: "urgent",
          assignee: "Jose Herrera",
        },
      ],
      notebooks: {
        principal: { label: "Principal", status: "Admisibilidad", history: {} },
        apremio: { label: "Apremio", status: "No iniciado", isActive: false, history: [] },
        terceria: { label: "Terceria", status: "No iniciada", isActive: false, history: [] },
      },
    },
    protectionData: {
      isActive: false,
      contracts: [],
    },
  },
  {
    id: 6,
    name: "Claudia Sepulveda Rios",
    initials: "CR",
    rut: "14.678.901-2",
    claveUnica: "Claudia#321",
    email: "claudia.sepulveda@correo.cl",
    cases: [{ id: "C-620-2025", creditor: "BCI", active: true }],
    activeCaseId: "C-620-2025",
    activeCreditor: "BCI",
    health: "warning",
    healthScore: 63,
    mood: "expectante",
    clientNotes: "Prefiere llamadas en horario de tarde.",
    comercialStatus: { cuotasPagadas: 12, cuotasTotal: 36, alDia: true },
    judicialData: {
      currentStage: 1,
      stageDates: { 1: "10/01/2026" },
      debtAmount: 2200000,
      nextAction: "Recoleccion de antecedentes",
      deadline: null,
      description: "Ingreso de carpeta para estrategia inicial.",
      strategy: "Preparacion de defensa",
      tactics: ["Levantamiento documental"],
      caseNotes: "Falta certificado de deuda actualizado.",
      tasks: [],
      notebooks: {
        principal: { label: "Principal", status: "Estudio", history: {} },
        apremio: { label: "Apremio", status: "No iniciado", isActive: false, history: [] },
        terceria: { label: "Terceria", status: "No iniciada", isActive: false, history: [] },
      },
    },
    protectionData: {
      isActive: true,
      contracts: [
        {
          id: "CTR-301",
          type: "CV Vehiculo",
          icon: "car",
          detail: "Patente KDJS.56",
          currentStage: 3,
          stageDates: { 1: "05/12/2025", 2: "10/12/2025", 3: "14/12/2025" },
          nextAction: "Coordinar firma en notaria",
          deadline: "Viernes",
          strategy: "Transferencia a tercero",
          assetsInvolved: ["Vehiculo Patente KDJS.56"],
          contractNotes: "Esperando confirmacion de hora por notaria.",
          tasks: [
            {
              id: 611,
              title: "Confirmar hora de firma",
              due: "Jueves",
              status: "pending",
              assignee: "Andrea Solis",
            },
          ],
          history: {
            3: [
              {
                date: "14/12/2025",
                type: "comunicacion",
                icon: "mail",
                title: "Notaria confirma disponibilidad",
                desc: "Se recibe respuesta de notaria para agendar firma.",
                category: "comunicacion",
                responsible: { role: "ejecutivo", name: "Andrea Solis" },
                hasDocument: true,
              },
            ],
          },
        },
      ],
    },
  },
]
