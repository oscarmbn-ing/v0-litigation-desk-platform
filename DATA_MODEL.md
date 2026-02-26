# DATA MODEL REAL (AS-IS)

Este documento describe **el modelo actual real** del proyecto, basado en:

- `lib/data.ts` (tipos, catálogos y mock data)
- `components/desk/client-detail.tsx` (uso en UI)

No incluye diseño futuro ni propuestas.

## 1) Contexto real del modelo

Hoy el proyecto usa un modelo orientado a frontend con mock data tipada en TypeScript.
La entidad central es `Client`, que contiene:

- datos de identificación/comercial del cliente
- `cases[]` + `activeCaseId`
- `judicialData` (estado judicial)
- `protectionData` (protección patrimonial)

## 2) Tipos reales (exactos)

### `HistoryEvent`

Representa un evento en bitácora/historial.

Campos relevantes:
- `date`, `type`, `icon`, `title`, `desc`
- `category?: "presentacion" | "resolucion" | "comunicacion" | "movimiento" | "hito"`
- `responsible?: { role: "abogado" | "ejecutivo" | "sistema"; name: string }`
- `hasDocument?: boolean`

### `Task`

Tarea operativa simple.

- `id: number`
- `title: string`
- `due: string`
- `status: "urgent" | "pending"`
- `assignee: string`

### `Notebook`

Cuaderno judicial auxiliar (`apremio`/`terceria`).

- `label: string`
- `status: string`
- `isActive?: boolean`
- `history: HistoryEvent[] | Record<number, HistoryEvent[]>`

### `JudicialData`

Estado judicial del cliente.

- `currentStage: number`
- `stageDates?: Record<number, string>`
- `debtAmount?: number`
- `nextAction: string`
- `deadline: string | null`
- `description`, `strategy`, `tactics`, `caseNotes`
- `tasks: Task[]`
- `notebooks:`
  - `principal.history: Record<number, HistoryEvent[]>`
  - `apremio: Notebook`
  - `terceria: Notebook`

### `ContractData`

Contrato de protección patrimonial.

- `id`, `type`, `icon`, `detail`
- `currentStage: number`
- `stageDates?: Record<number, string>`
- `nextAction`, `deadline`, `strategy`, `assetsInvolved`, `contractNotes`
- `tasks: Task[]`
- `history: Record<number, HistoryEvent[]>`
- `documents?: { name: string; received: boolean }[]`

### `ProtectionData`

- `isActive: boolean`
- `contracts: ContractData[]`

### `CaseEntry`

Resumen mínimo de causa:

- `id: string`
- `creditor: string`
- `active: boolean`

### `ComercialStatus`

- `cuotasPagadas: number`
- `cuotasTotal: number`
- `alDia: boolean`

### `Client` (entidad principal real)

- `id: number`
- `name`, `initials`, `rut`, `claveUnica`, `email`
- `cases: CaseEntry[]`
- `activeCaseId: string`
- `activeCreditor: string`
- `health: "critical" | "warning" | "healthy"`
- `healthScore: number`
- `mood: string`
- `clientNotes: string`
- `tipoReclamacion: string`
- `tribunal: string`
- `comercialStatus: ComercialStatus`
- `judicialData: JudicialData`
- `protectionData: ProtectionData`

### `Stage`

- `id: number`
- `name: string`
- `label: string`

## 3) Catálogos reales

En `lib/data.ts` existen estos catálogos:

- `JUDICIAL_STAGES`
- `PROTECTION_STAGES`
- `TIPOS_RECLAMACION`
- `ACREEDORES`
- `TRIBUNALES`

## 4) Relaciones reales (actuales)

Relación real hoy:

- `Client (1)` contiene:
  - `cases (N)` tipo `CaseEntry` (solo id/acreedor/activo)
  - `judicialData (1)` a nivel cliente
    - `judicialData.tasks (N)` tipo `Task`
  - `protectionData (1)` a nivel cliente, con `contracts (N)`
    - `contracts[].tasks (N)` tipo `Task`

Punto importante real:
- La causa (`CaseEntry`) **no** trae su propio `judicialData`.
- En UI se usa `activeCaseId` para seleccionar causa y, cuando no es la activa principal, se deriva una vista judicial desde `getJudicialDataForCase()` en `client-detail.tsx`.

## 5) Significado en lenguaje natural (sin especular)

- `health` / `healthScore`: semáforo y puntaje de “salud” operativa del cliente.
  - lectura de negocio solicitada para UI: `indiceRiesgo`
    - `critical` -> `Crítico` (rojo)
    - `warning` -> `Medio` (amarillo)
    - `healthy` -> `Bajo` (verde)
  - en la pantalla de Radar, el ícono/avatar de la tarjeta del cliente refleja este estado de índice de riesgo.
- `activeCaseId`: causa que se está trabajando/mostrando como activa en el panel.
- `judicialData.currentStage`: etapa judicial actual del cliente en el flujo judicial.
- `stageDates`: fechas registradas por número de etapa.
- `tipoReclamacion`: clasificación declarada del tipo de reclamación para ese cliente.
- `notebooks`: bitácoras por cuaderno (`principal`, `apremio`, `terceria`) con historial de eventos.
- `protectionData.isActive`: indica si hay frente de protección patrimonial habilitado.
- `contracts[].currentStage`: etapa del contrato de protección patrimonial.
- `Client` se relaciona con tareas por dos vías en el modelo actual:
  - tareas judiciales en `judicialData.tasks`
  - tareas patrimoniales en `protectionData.contracts[].tasks`

## 6) Ejemplos reales del dataset (`CLIENTS_DATA`)

### Ejemplo A: cliente con múltiples causas

`id: 1` (`Esteban Morales Cerda`) tiene:
- `cases`: `C-455-2025` (activa) y `C-880-2025` (inactiva)
- `activeCaseId: "C-455-2025"`

### Ejemplo B: progreso judicial real

En ese mismo cliente (`id: 1`):
- `judicialData.currentStage: 3`
- `judicialData.stageDates`: `{1:"10/11/2025",2:"15/11/2025",3:"19/11/2025"}`

### Ejemplo C: protección patrimonial real

`id: 1` en `protectionData`:
- `isActive: true`
- contrato `CTR-001`:
  - `type: "CV Inmueble"`
  - `currentStage: 3`
  - `assetsInvolved: ["Parcela Lampa Rol 44-5"]`
  - `documents`: lista de documentos con `received: true/false`

### Ejemplo D: historial de eventos real

En `judicialData.notebooks.principal.history[3]` (cliente `id: 1`) hay eventos como:
- `"Presentación: PyP FEA"` (`category: "presentacion"`)
- `"Resolución: Apercibimiento"` (`category: "resolucion"`)
- `"Correo: Presentamos excepciones"` (`category: "comunicacion"`)

## 7) Limitaciones reales observables (hechos)

Hechos del modelo actual:

- `CaseEntry` es mínimo (id/acreedor/activo); no contiene detalle judicial completo.
- `judicialData` vive a nivel `Client`, no por cada `CaseEntry`.
- En UI hay lógica de derivación para causas no activas (`getJudicialDataForCase`) en vez de un `judicialData` separado por causa.
- Existen dos estructuras de historial en cuadernos:
  - `Record<number, HistoryEvent[]>` (principal)
  - `HistoryEvent[]` (apremio/terceria en algunos casos)

---

Fuente de verdad revisada:
- `lib/data.ts`
- `components/desk/client-detail.tsx`
