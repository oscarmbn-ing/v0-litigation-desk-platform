"use client"

import { CheckCircle2, ChevronDown } from "lucide-react"
import type { Stage } from "@/lib/data"

const colorThemes = {
  indigo: {
    fill: "bg-indigo-950",
    active: "bg-indigo-950",
    border: "border-indigo-950",
    text: "text-indigo-950",
    light: "bg-violet-100 text-violet-900",
    past: "bg-indigo-950 border-indigo-950 text-white",
    ring: "ring-violet-200",
  },
  emerald: {
    fill: "bg-emerald-600",
    active: "bg-emerald-500",
    border: "border-emerald-500",
    text: "text-emerald-700",
    light: "bg-emerald-100 text-emerald-800",
    past: "bg-emerald-600 border-emerald-600 text-white",
    ring: "ring-emerald-200",
  },
}

export function JourneyMap({
  stages,
  currentStage,
  selectedStageId,
  onSelectStage,
  themeColor = "indigo",
}: {
  stages: Stage[]
  currentStage: number
  selectedStageId: number | null
  onSelectStage: (id: number) => void
  themeColor?: "indigo" | "emerald"
}) {
  const theme = colorThemes[themeColor]

  return (
    <div className="relative w-full py-10 px-8">
      {/* Background track */}
      <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-200 -translate-y-1/2 z-0" />

      {/* Progress fill */}
      <div
        className={`absolute top-1/2 left-8 h-1 ${theme.fill} -translate-y-1/2 z-0 transition-all duration-1000`}
        style={{
          width: `calc(${((currentStage - 1) / (stages.length - 1)) * 100}% - 32px)`,
        }}
      />

      {/* Stage nodes */}
      <div className="relative z-10 flex justify-between w-full">
        {stages.map((stage) => {
          const isPast = stage.id < currentStage
          const isCurrent = stage.id === currentStage
          const isFuture = stage.id > currentStage
          const isSelected = stage.id === selectedStageId

          return (
            <button
              type="button"
              key={stage.id}
              className={`flex flex-col items-center group cursor-pointer bg-transparent border-0 p-0 transform transition-transform duration-300 ${isSelected ? "scale-105" : "hover:scale-105"}`}
              onClick={() => onSelectStage(stage.id)}
            >
              <div
                className={`
                w-12 h-12 rounded-full flex items-center justify-center border-0 transition-all duration-300 relative z-10
                ${isPast ? theme.fill + " text-white" : ""}
                ${isCurrent ? theme.fill + " text-white ring-4 ring-white shadow-xl scale-125" : ""}
                ${isFuture ? "bg-slate-400 text-transparent" : ""}
              `}
              >
                {isPast && <span className="text-sm font-bold">{stage.id}</span>}
                {isCurrent && <CheckCircle2 size={24} className="animate-in zoom-in spin-in-90 duration-300" />}
                {isFuture && <span className="hidden">{stage.id}</span>}
                
                {isSelected && !isCurrent && (
                   <div className={`absolute -bottom-2 ${theme.text} transform translate-y-full`}>
                      <ChevronDown size={20} />
                   </div>
                )}
              </div>
              <div
                className={`mt-4 text-xs font-semibold transition-colors
                  ${isCurrent || isSelected ? "text-slate-900" : "text-slate-500"}
                  ${isFuture ? "text-slate-400" : ""}
                `}
              >
                {stage.label}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
