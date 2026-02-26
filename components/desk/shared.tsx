"use client"

import { JUDICIAL_STAGES } from "@/lib/data"

export function HealthAvatar({
  initials,
  health,
}: {
  initials: string
  health: "critical" | "warning" | "healthy"
}) {
  const colors: Record<string, string> = {
    critical: "text-rose-600 bg-rose-50",
    warning: "text-amber-600 bg-amber-50",
    healthy: "text-emerald-600 bg-emerald-50",
  }
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm ${colors[health]}`}
    >
      {initials}
    </div>
  )
}

export function MiniPipeline({ currentStage }: { currentStage: number }) {
  return (
    <div className="flex gap-1 items-center w-32 md:w-48">
      {JUDICIAL_STAGES.map((stage) => {
        let style = "bg-slate-200"
        if (stage.id < currentStage) style = "bg-indigo-950"
        if (stage.id === currentStage) style = "bg-indigo-950 animate-pulse"

        return (
          <div
            key={stage.id}
            className="group relative flex-1 h-2 rounded-full overflow-hidden bg-slate-200"
          >
            <div className={`h-full w-full ${style}`} />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
              {stage.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
