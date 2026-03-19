# 🏛️ Desk Tramitación - Litigation Platform

> **¡Hola equipo de desarrollo! 👋**
> Mucho éxito metiendo mano en este código. Recuerden mantener las cosas ordenadas, preguntar si tienen dudas, ¡y vamos con todo! 🚀 Que los bugs sean pocos y los commits muchos.

Plataforma de gestión, monitoreo y seguimiento de clientes diseñada para administrar de forma eficiente los juicios y flujos de trabajo legales, manteniendo un control claro sobre expedientes, contratos de protección patrimonial y estados financieros diarios.

## 🛠️ Tecnologías Principales

- **Framework Principal:** [Next.js](https://nextjs.org/) (React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI Base:** [Radix UI](https://www.radix-ui.com/) y componentes inspirados en [shadcn/ui](https://ui.shadcn.com/)
- **Iconos:** [Lucide React](https://lucide.dev/)

## 🚀 Entorno de Desarrollo

Sigue estos pasos para comenzar a probar la aplicación en tu entorno local:

### 1. Clonar el repositorio e ingresar al directorio

```bash
git clone https://github.com/oscarmbn-ing/v0-litigation-desk-platform.git
cd v0-litigation-desk-platform
```

### 2. Instalar dependencias

La aplicación requiere la instalación de sus paquetes antes de correr por primera vez. Puedes usar tu manejador de paquetes de preferencia (`npm`, `pnpm` o `yarn`):

```bash
npm install
```

### 3. Iniciar el servidor local

Levanta el servidor en modo desarrollo con reflex de cambios instantáneos:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador preferido. ¡Ahí está tu app funcionando!

## 📁 Estructura del Repositorio

A la hora de navegar por la arquitectura del código, ten en cuenta los directorios principales:

- `app/`: Definición de las rutas del proyecto y enrutamiento global (usando Next.js App Router). Todo el css global vive en `globals.css`
- `components/`: Componentes modulares, separados de las rutas:
  - `ui/`: Componentes base (Botones, Modales, Desplegables, Inputs, etc.) completamente re-usables.
  - `desk/`: Las vistas complejas y específicas del negocio (Panel del cliente, widgets, mapas de viaje (journey map), bitácoras).
- `lib/`: Utilidades para formateos genéricos (`utils.ts`) y la data de mock usada por toda la aplicación temporalmente o como fuente de verdad estática (`data.ts`).

## ✍️ Flujo de Trabajo

- Eviten siempre pushear directamente a `main`, utilicen ramas separadas para su módulo / componente y luego abran un *Pull Request* para revisarlo.
- Usen nombres descriptivos en sus commits (por favor 🧐) identificando la vista o fichero principal trabajado.
- Validar componentes interactivos ante los diferentes estados (vacio, cargando, inactivo).

---
*Plataforma desarrollada para optimizar la toma de decisiones, la comunicación y la productividad legal.*
