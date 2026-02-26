"use client"

import { useRouter } from "next/navigation"
import { HomeView } from "@/components/desk/home-view"

export default function HomePage() {
  const router = useRouter()

  return (
    <HomeView
      onNavigate={(section) => {
        if (section === "clientes") router.push("/clientes")
        if (section === "tareas") router.push("/tareas")
      }}
    />
  )
}
