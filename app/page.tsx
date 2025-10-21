"use client"

import { useState } from "react"
import { RoleSelector } from "@/components/role-selector"
import { ChatInterface } from "@/components/chat-interface"

export type UserRole = "admin" | "radiologist" | "center"

export default function Home() {
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null)

  if (!currentRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <RoleSelector onSelectRole={setCurrentRole} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ChatInterface currentRole={currentRole} onChangeRole={() => setCurrentRole(null)} />
    </div>
  )
}
