# Modelo de Datos por Pantallas (desde Frontend)

Documento de trabajo incremental para definir entidades y reglas de datos pantalla por pantalla.

---

## Pantalla: Sidebar

## Bloque: Usuario (menú contextual inferior)

### Entidad propuesta: `UsuarioSesion`

Representa al usuario autenticado que aparece en la parte inferior de la sidebar y que abre el menú contextual de usuario.

Campos definidos hasta ahora:

- `nombreCompleto: string`
  - Ejemplo UI: `Jose Herrera`
  - Uso en interfaz: texto principal del bloque de usuario.

- `rolVisible: string`
  - Valores permitidos: `Ejecutivo legal` | `Abogado`
  - Ejemplo UI: `Abogado`
  - Uso en interfaz: subtítulo bajo el nombre.

- `avatarInicial: string`
  - Regla definida: debe ser la inicial del primer nombre.
  - Ejemplo: `Jose Herrera` -> `J`, `María Paz Soto` -> `M`.
  - Uso en interfaz: círculo de avatar en el bloque de usuario.

---

## Nota de implementación observada (estado actual frontend)

En la implementación actual de `components/desk/sidebar.tsx`, nombre, rol e inicial están hardcodeados (`Jose Herrera`, `Abogado`, `J`).

---

## Pantalla: Home Page

## Bloque: Saludo principal

### Entidad: `UsuarioSesion`

Campo reutilizado del modelo:

- `nombreCompleto: string` (ya definido en Sidebar)
  - Regla definida: en Home no se crea un campo nuevo; se toma el primer token de `nombreCompleto`.
  - Ejemplo: `Jose Herrera` -> saludo `Hola, Jose`.

---

## Pantalla: Radar de Clientes

## Bloque: Radar de clientes (tarjetas)

### Entidad: `Cliente`

Campos definidos para la tarjeta:

- `nombre: string`
  - Uso en interfaz: nombre visible del cliente en la tarjeta.

- `correo: string`
  - Uso en interfaz: email del cliente en la tarjeta.

- `progresoJudicial: number | string`
  - Uso en interfaz: avance/progreso judicial del cliente.
  - Nota: formato exacto (porcentaje, etapa o ambos) se mantiene por definir en siguientes iteraciones.

- `estadoPP: "pp_en_curso" | "sin_pp" | "pp_exitosa"`
  - Uso en interfaz: estado de Protección Patrimonial (P.P.) mostrado en la tarjeta.
  - Valores de negocio definidos:
    - `pp_en_curso` -> "P.P en curso"
    - `sin_pp` -> "Sin P.P"
    - `pp_exitosa` -> "P.P exitosa"
  - Regla de negocio (caja madre):
    - si hay caja madre, `estadoPP = pp_en_curso`
    - si no hay caja madre, `estadoPP = sin_pp`
    - si la caja madre está en etapa de gestión exitosa, `estadoPP = pp_exitosa`

Nota:
- En Home existe solo una tarjeta/atajo para ir al Radar de Clientes; las tarjetas de clientes pertenecen a la pantalla de Radar.

### Bloque: Filtros del Radar de Clientes

Reglas documentadas:

- Filtro `Acreedor`
  - Se refiere a los juicios del cliente.
  - Un cliente cumple este filtro si tiene **al menos un juicio** cuyo acreedor coincide con el acreedor filtrado.

- Filtro `Tribunal`
  - Se refiere a los juicios del cliente.
  - Un cliente cumple este filtro si tiene **al menos un juicio** asociado al tribunal filtrado.

Interpretación funcional:
- La evaluación del filtro se hace sobre el conjunto de juicios contenidos del cliente (no solo sobre uno).
- Si existe coincidencia en cualquiera de sus juicios, el cliente debe aparecer en el resultado filtrado.

---

## Pantalla: Centro de Comando (detalle de cliente)

## Bloque: Cabecera del cliente

### Entidad: `Cliente`

Campos observados/reutilizados:

- `nombre: string`
  - Uso en interfaz: se vuelve a mostrar el nombre del cliente en el detalle.

## Bloque: Litigios (juicios)

### Entidad: `Juicio`

Reglas definidas:

- Los juicios del cliente se muestran en un desplegable dentro de la pestaña Litigios.
- El juicio seleccionado en el desplegable muestra abajo sus datos de detalle.

Campos clave:

- `idJuicio: string`
- `rolJuicio: string`
- `tribunal: string`
- `tipoReclamacion: string` (diccionario pendiente de definir)
- `acreedor: string`
- `tacticas: string[]` (catálogo pendiente de definir)
- `activo: boolean` (selección/juicio activo)
- `misiones: MisionJuicio[]`

Regla de relación:

- Las misiones están contenidas en cada `Juicio`.
- Las tácticas están contenidas en cada `Juicio` (son del caso).

### Propiedad en `Juicio`: `misiones`

Campos base de misión:

- `idMision: string | number`
- `tituloMision: string`
- `estadoMision: string` (catálogo pendiente)
- `fechaObjetivo: string | date` (si aplica)
- `encargadoMision: string` (si aplica)

Nota de catálogo:

- El catálogo de misiones debe quedar explícitamente definido (tipos/estados de misión pendientes de cierre de negocio).
- El catálogo de tácticas debe quedar explícitamente documentado y definido (pendiente de cierre de negocio).

### Entidad: `Task` (tareas de misión)

Reglas definidas:

- Las tasks están contenidas dentro de los casos/juicios.
- Existe un caso especial: la task **"Movimiento detectado"** puede pertenecer a varios casos.

Catálogo pendiente:

- Debe definirse el catálogo de tipos de task.
- Tipos de task definidos hasta ahora:
  - `movimiento`
  - `gestion`
  - `cx`

## Bloque: Etapas (nodos de progreso)

### Propiedad en `Juicio`: `etapaJuicio`

Regla definida:

- Las etapas se representan visualmente como nodos.
- La definición completa del catálogo de etapas queda pendiente de cierre de negocio.

Campos base (como propiedad de `Juicio`):

- `idEtapa: number | string`
- `nombreEtapa: string`
- `orden: number`
- `estadoEtapa: string` (por definir catálogo)

## Bloque: Eventos del juicio

### Entidad: `EventoJuicio`

Tipos actuales observados:

- `presentacion`
- `resolucion`
- `correo`

Nota:
- Los tipos de eventos/categorías siguen pendientes de definición final de catálogo.

Campos definidos:

- `tipoEvento: string`
- `fechaEvento: string | date`
- `encargado: EncargadoEvento`

### Entidad: `EncargadoEvento`

Campos definidos:

- `rolEncargado: string`
- `nombreEncargado: string`

Regla de relación:

- El usuario activo de sesión puede ser un encargado de evento.
- Debe existir relación funcional entre `UsuarioSesion` y `EncargadoEvento`.

## Nota funcional futura (comportamiento al abrir evento)

- Si el evento es `presentacion` o `resolucion`: abre documento.
- Si el evento es `correo`: navega al correo asociado.
- Si el evento es mensaje de `whatsapp`: no se abre (no disponible para apertura).

## Bloque: Historial completo

Regla definida:

- En el historial completo se muestran los eventos que han pasado para el cliente.
- Cada evento debe mostrar indicación de:
  - `rol` (del juicio/evento)
  - `tribunal`
  - `acreedor`

## Bloque: Datos del cliente

### Entidad: `Cliente`

Propiedades observadas en esta sección:

- `rut: string`
- `claveUnica: string`
- `email: string`
- `ficha: string` (URL/enlace a la ficha del cliente)
- `acreedorContratado: string`
- `situacionComercial: string`
- `notasCliente: string`

Nota:
- En esta sección se modela un único valor por campo (string), no listas.
- `acreedorContratado` representa el acreedor mostrado para el cliente/caso en contexto.
- `situacionComercial` representa el estado comercial consolidado del cliente.
- `notasCliente` corresponde al texto de notas del cliente.

---

## Pantalla: Protección Patrimonial (detalle de cliente)

## Bloque: Contratos de protección

### Entidad: `ContratoProteccion`

Regla definida:

- Los contratos de protección patrimonial son el símil de los juicios en Litigios.

Campos clave:

- `idContrato: string`
- `registroContrato: string`
- `activo: boolean` (contrato seleccionado/activo en interfaz)
- `etapaProteccion: EtapaProteccion` (propiedad del contrato)
- `misionesProteccion: MisionProteccion[]`
- `eventosProteccion: EventoProteccion[]`

### Propiedad en `ContratoProteccion`: `etapaProteccion`

Regla definida:

- Cada contrato tiene sus propias etapas de protección.
- Debe existir un catálogo dedicado para las etapas de protección patrimonial.

Campos base:

- `idEtapa: number | string`
- `nombreEtapa: string`
- `orden: number`
- `estadoEtapa: string` (catálogo pendiente)

### Propiedad en `ContratoProteccion`: `eventosProteccion`

Regla definida:

- Los eventos de protección patrimonial siguen el mismo modelo de eventos que Litigios.

Campos base:

- `tipoEvento: string` (catálogo pendiente)
- `fechaEvento: string | date`
- `encargadoEvento: string | object`
- `detalleEvento: string`

### Propiedad en `ContratoProteccion`: `misionesProteccion`

Regla definida:

- Debe existir un catálogo específico de misiones para Protección Patrimonial.

Campos base:

- `idMision: string | number`
- `tituloMision: string`
- `estadoMision: string` (catálogo pendiente)
- `fechaObjetivo: string | date`
- `encargadoMision: string`

## Catálogos pendientes explícitos (Protección Patrimonial)

- Catálogo de etapas de Protección Patrimonial.
- Catálogo de tipos de eventos de Protección Patrimonial.
- Catálogo de misiones de Protección Patrimonial.

