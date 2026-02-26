"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { CLIENTS_DATA } from "@/lib/data"
import { ClientDetail } from "@/components/desk/client-detail"
import { notFound } from "next/navigation"

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const client = CLIENTS_DATA.find((c) => c.id === Number(id))

  if (!client) {
    notFound()
  }

  return (
    <ClientDetail
      client={client}
      onBack={() => router.push("/clientes")}
      onNavigateToTask={(taskId) => router.push(`/tareas?taskId=${taskId}`)}
    />
  )
}
