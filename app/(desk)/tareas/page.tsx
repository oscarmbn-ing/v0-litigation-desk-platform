"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import dynamic from "next/dynamic"

const TasksView = dynamic(
  () => import("@/components/desk/tasks-view").then((mod) => mod.TasksView),
  { ssr: false }
)

function TareasContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTaskId = searchParams.get("taskId")

  return (
    <TasksView
      initialTaskId={initialTaskId}
      onOpenClient={(client) => {
        router.push(`/clientes/${client.id}`)
      }}
    />
  )
}

export default function TareasPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <TareasContent />
    </Suspense>
  )
}
