"use client"

import { useRouter } from "next/navigation"
import { ClientList } from "@/components/desk/client-list"

export default function ClientesPage() {
  const router = useRouter()

  return (
    <ClientList
      onSelectClient={(client) => {
        router.push(`/clientes/${client.id}`)
      }}
    />
  )
}
