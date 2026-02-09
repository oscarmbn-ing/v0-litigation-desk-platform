"use client"

import { CheckCircle2, ChevronDown } from "lucide-react"
import type { Stage } from "@/lib/data"

const colorThemes = {
  indigo: {
    fill: "bg-indigo-950",
    active: "bg-indigo-600",
    border: "border-indigo-600",
    text: "text-indigo-700",
    light: "bg-indigo-100 text-indigo-800",
    past: "bg-indigo-950 border-indigo-950 text-white",
    ring: "ring-indigo-200",
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
    <div className="relative w-full py-8 px-4">
      {/* Background track */}
      <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0" />

      {/* Progress fill */}
      <div
        className={`absolute top-1/2 left-0 h-1 ${theme.fill} -translate-y-1/2 z-0 transition-all duration-1000`}
        style={{
          width: `${((currentStage - 1) / (stages.length - 1)) * 100}%`,
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
              className="flex flex-col items-center group cursor-pointer bg-transparent border-0 p-0"
              onClick={() => onSelectStage(stage.id)}
            >
              <div
                className={`
                w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 relative
                ${isPast ? theme.past : ""}
                ${isCurrent ? `bg-white ${theme.border} scale-110 shadow-lg` : ""}
                ${isFuture ? "bg-white border-slate-300 text-slate-300" : ""}
                ${isSelected ? `ring-4 ${theme.ring} scale-125` : "hover:scale-110"}
              `}
              >
                {isPast && <CheckCircle2 size={16} />}
                {isCurrent && (
                  <div
                    className={`w-3 h-3 ${theme.active} rounded-full animate-ping-slow`}
                  />
                )}
                {isFuture && (
                  <span className="text-xs font-medium">{stage.id}</span>
                )}
                {isSelected && (
                  <div
                    className={`absolute -bottom-3 ${theme.text} animate-bounce`}
                  >
                    <ChevronDown size={20} fill="currentColor" />
                  </div>
                )}
              </div>
              <div
                className={`mt-3 text-xs md:text-sm font-medium transition-colors ${isSelected ? `${theme.text} font-bold` : "text-slate-500"}`}
              >
                {stage.label}
              </div>
              {isCurrent && !isSelected && (
                <div
                  className={`absolute top-16 ${theme.light} text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mt-1`}
                >
                  En curso
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
