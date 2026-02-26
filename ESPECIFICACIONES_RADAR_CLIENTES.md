# Especificaciones Funcionales - Radar de Clientes

## Clasificación de tarjetas por trabajo del día

En la pantalla **Radar de Clientes**, las tarjetas se separan en dos grupos:

- **Para hoy**
- **Sin tareas para hoy**

## Regla de negocio

Un cliente va en **Para hoy** cuando tiene al menos una tarea para el día, considerando:

1. Tareas judiciales del cliente (`client.judicialData.tasks`) donde:
   - `task.status === "urgent"` **o**
   - `task.due` es `"hoy"` (comparación en minúsculas).

2. Tareas de protección patrimonial en cualquiera de sus contratos  
   (`client.protectionData.contracts[].tasks`) donde:
   - `task.status === "urgent"` **o**
   - `task.due` es `"hoy"` (comparación en minúsculas).

Si no se cumple ninguna de esas condiciones, el cliente va en **Sin tareas para hoy**.

## Etiquetas de sección en UI

- Sección 1: `Para hoy`
- Sección 2: `Sin tareas para hoy`

## Referencia de implementación actual

- `components/desk/client-list.tsx`
  - función: `hasImmediateAction(client)`
  - agrupación:
    - `immediateClients = filtered.filter(hasImmediateAction)`
    - `followUpClients = filtered.filter((client) => !hasImmediateAction(client))`

