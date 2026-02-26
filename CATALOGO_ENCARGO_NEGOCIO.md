# Encargo: Definición de Catálogos y Lenguaje de Negocio

## ¿Por qué estamos haciendo esto?

Actualmente, la plataforma (Lexy Litigation Desk) está creciendo y necesitamos estandarizar el lenguaje que usamos en las pantallas, filtros y reportes. Hoy en día, a veces llamamos de distintas formas a los mismos conceptos, o mezclamos prioridades con estados.

El objetivo de este encargo es que **el equipo de negocio (Legal, Operaciones y Producto) defina el "diccionario oficial"** de la plataforma. Queremos listas cerradas, claras y sin ambigüedades para que los menús desplegables, las tarjetas de los clientes y los reportes funcionen a la perfección.

---

## ¿Qué necesitamos que el Negocio defina?

Hemos agrupado la tarea en tres niveles de prioridad, explicando exactamente qué vemos hoy en la pantalla y qué necesitamos que ustedes estandaricen.

### Prioridad 1: El corazón de la operación (Críticos)

**1. Estados y Tipos de Tareas (Lo que hace el equipo)**
- **Dónde se ve en la plataforma:** En las tarjetas de misiones/tareas asignadas a los ejecutivos y abogados.
- **Qué pasa hoy:** Solo tenemos "Urgente" y "Pendiente" (que mezcla urgencia con estado). No tenemos tipificado *qué* tipo de tarea es (ej. redactar, revisar, llamar).
- **Qué necesitamos:** 
  - Una lista de los **Estados** reales de una tarea (ej. Pendiente, En curso, Bloqueada, Completada).
  - Una lista de los **Tipos de Tarea** (ej. Redacción de escrito, Revisión, Llamada a cliente).

**2. Tipos de Movimientos y Eventos (La bitácora del caso)**
- **Dónde se ve en la plataforma:** En la línea de tiempo del caso (bitácora) y en el modal para enviar el resumen mensual al cliente.
- **Qué pasa hoy:** Tenemos categorías mezcladas como "Presentación", "Resolución", "Comunicación", "Hito" y "Movimiento". 
- **Qué necesitamos:** 
  - Definir la lista oficial de categorías de eventos.
  - Aclarar si "Evento interno" y "Movimiento a reportar al cliente" son lo mismo o si se separan.
  - Indicar cuáles de estos obligan a subir un documento de respaldo.

**3. Roles de Responsables**
- **Dónde se ve en la plataforma:** En el historial del caso, indicando quién hizo qué.
- **Qué pasa hoy:** Usamos "Abogado", "Ejecutivo" y "Sistema".
- **Qué necesitamos:** Confirmar si esta lista está completa o si faltan roles (ej. "Capitán de Operaciones", "Cliente").

**4. Semáforo de Salud del Cliente**
- **Dónde se ve en la plataforma:** En la cabecera del perfil del cliente, indicando su estado general.
- **Qué pasa hoy:** Usamos "Crítico", "Medio" (Warning) y "Saludable".
- **Qué necesitamos:** Confirmar si estos son los 3 estados oficiales y qué criterio exacto define a cada uno.

**5. Etapas del Caso (El mapa de viaje)**
- **Dónde se ve en la plataforma:** En la barra de progreso superior (los círculos numerados).
- **Qué pasa hoy:** Tenemos etapas judiciales (Estudio, Redacción, Admisibilidad, Probatorio, Sentencia) y etapas de protección (Diagnóstico, Borrador, Firma Notarial, CBR, Blindado).
- **Qué necesitamos:** Confirmar los nombres oficiales, si el orden es estrictamente secuencial o si se pueden saltar, y qué hito marca que una etapa se cerró.

### Prioridad 2: Ordenando el expediente

**6. Cuadernos Judiciales**
- **Dónde se ve en la plataforma:** En las pestañas de la bitácora judicial.
- **Qué necesitamos:** Confirmar si la lista oficial es siempre "Principal", "Apremio" y "Tercería", o si existen otros cuadernos estándar.

**7. Tipos de Contratos de Protección Patrimonial**
- **Dónde se ve en la plataforma:** En las tarjetas de la sección de protección patrimonial.
- **Qué pasa hoy:** Vemos textos como "CV Inmueble" o "CV Vehículo".
- **Qué necesitamos:** La lista oficial y cerrada de los tipos de contratos o servicios de protección que ofrecemos.

**8. Filtros del Resumen al Cliente**
- **Dónde se ve en la plataforma:** En las pestañas del modal para enviar el correo al cliente.
- **Qué pasa hoy:** Filtramos por "Todos", "Litigios" y "P. Patrimonial".
- **Qué necesitamos:** Confirmar si estas son las únicas agrupaciones que el cliente entiende y necesita.

### Prioridad 3: Catálogos Maestros

**9. Tipos de Reclamación, Acreedores y Tribunales**
- **Dónde se ve en la plataforma:** En los datos duros del caso y del cliente.
- **Qué necesitamos:** Revisar las listas actuales. ¿Son listas cerradas que administra Operaciones, o los abogados pueden escribir texto libre? Necesitamos la lista oficial inicial.

---

## ¿Cómo nos deben entregar esta información?

Para cada una de las listas mencionadas arriba, necesitamos que armen una planilla (Excel o Google Sheets) con las siguientes columnas:

1. **Nombre Visible:** Cómo debe leerse en la pantalla (ej. "En Curso").
2. **Descripción:** Qué significa exactamente y cuándo debe usarse (para que no haya dudas entre el equipo).
3. **Ámbito (Opcional):** Si aplica solo a Juicios, solo a Protección Patrimonial, o a ambos.
4. **Estado:** Si está "Activo" para usarse hoy, o si es un concepto antiguo que ya no se usa.

---

## Plan de Trabajo Sugerido (2 Semanas)

**Semana 1: Levantamiento**
- El equipo de Producto/Operaciones revisa la plataforma actual y anota todos los términos que se están usando hoy.
- Se arma un Excel en bruto con todo lo encontrado.

**Semana 2: Taller y Cierre**
- Se hace una reunión de 1-2 horas con los líderes de Legal y Operaciones.
- Se discute el Excel, se eliminan duplicados, se unifican nombres y se aprueba la **Versión 1 Oficial**.
- Se define quién será el "dueño" de estos catálogos en el futuro (quién autoriza agregar un nuevo tipo de tarea o un nuevo tribunal).

---

*Nota: Este encargo es puramente de definición de negocio. Una vez que nos entreguen el Excel con las definiciones oficiales, el equipo de tecnología se encargará de limpiar la base de datos y actualizar las pantallas para que reflejen exactamente lo acordado.*