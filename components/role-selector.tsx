"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserRole } from "@/app/page"
import { Shield, Stethoscope, Building2 } from "lucide-react"

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void
}

export function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  const roles = [
    {
      id: "admin" as UserRole,
      title: "Admin",
      description: "System administrator with full access",
      icon: Shield,
      color: "text-blue-600",
    },
    {
      id: "radiologist" as UserRole,
      title: "Radiologist",
      description: "Medical imaging specialist",
      icon: Stethoscope,
      color: "text-emerald-600",
    },
    {
      id: "center" as UserRole,
      title: "Center",
      description: "Medical center representative",
      icon: Building2,
      color: "text-purple-600",
    },
  ]

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Select Your Role</CardTitle>
        <CardDescription>Choose a role to enter the chat</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {roles.map((role) => {
          const Icon = role.icon
          return (
            <Button
              key={role.id}
              variant="outline"
              className="h-auto p-6 justify-start gap-4 hover:bg-accent bg-transparent"
              onClick={() => onSelectRole(role.id)}
            >
              <Icon className={`h-8 w-8 ${role.color}`} />
              <div className="text-left">
                <div className="font-semibold text-lg">{role.title}</div>
                <div className="text-sm text-muted-foreground">{role.description}</div>
              </div>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}
