"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import type { UserRole } from "@/app/page"
import { Send, LogOut, Shield, Stethoscope, Building2, Trash2, Users } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Message {
  id: string
  role: UserRole
  content: string
  timestamp: Date
  priority?: boolean
}

interface ChatInterfaceProps {
  currentRole: UserRole
  onChangeRole: () => void
}

export function ChatInterface({ currentRole, onChangeRole }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "admin",
      content: "Welcome to the chat system. All roles are now connected.",
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: "2",
      role: "radiologist",
      content: "Hello everyone, ready to discuss the cases.",
      timestamp: new Date(Date.now() - 240000),
    },
    {
      id: "3",
      role: "center",
      content: "Good morning team, we have several urgent requests today.",
      timestamp: new Date(Date.now() - 180000),
      priority: true,
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isPriority, setIsPriority] = useState(false)
  const [onlineUsers] = useState<UserRole[]>(["admin", "radiologist", "center"])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: currentRole,
      content: inputValue,
      timestamp: new Date(),
      priority: isPriority,
    }

    setMessages([...messages, newMessage])
    setInputValue("")
    setIsPriority(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleClearChat = () => {
    setMessages([])
  }

  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case "admin":
        return {
          name: "Admin",
          icon: Shield,
          color: "bg-blue-100 text-blue-700",
          avatarBg: "bg-blue-600",
        }
      case "radiologist":
        return {
          name: "Radiologist",
          icon: Stethoscope,
          color: "bg-emerald-100 text-emerald-700",
          avatarBg: "bg-emerald-600",
        }
      case "center":
        return {
          name: "Center",
          icon: Building2,
          color: "bg-purple-100 text-purple-700",
          avatarBg: "bg-purple-600",
        }
    }
  }

  const currentRoleConfig = getRoleConfig(currentRole)
  const CurrentRoleIcon = currentRoleConfig.icon

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${currentRoleConfig.color}`}>
              <CurrentRoleIcon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">Multi-Role Chat</h1>
              <p className="text-sm text-muted-foreground">Logged in as {currentRoleConfig.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg mr-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{onlineUsers.length}</span>
            </div>
            {currentRole === "admin" && messages.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Chat
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear all messages?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all chat messages.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearChat}>Clear</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button variant="outline" size="sm" onClick={onChangeRole}>
              <LogOut className="h-4 w-4 mr-2" />
              Switch Role
            </Button>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const roleConfig = getRoleConfig(message.role)
            const RoleIcon = roleConfig.icon
            const isCurrentUser = message.role === currentRole

            return (
              <div key={message.id} className={`flex gap-3 ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                <Avatar className={roleConfig.avatarBg}>
                  <AvatarFallback className="text-white">
                    <RoleIcon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className={`flex flex-col gap-1 max-w-md ${isCurrentUser ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{roleConfig.name}</span>
                    {message.priority && (
                      <Badge variant="destructive" className="text-xs">
                        Urgent
                      </Badge>
                    )}
                    <span className="text-muted-foreground text-xs">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <Card
                    className={`p-3 ${isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"} ${message.priority ? "border-2 border-destructive" : ""}`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </Card>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-card p-4">
        <div className="flex flex-col gap-2 max-w-4xl mx-auto">
          {(currentRole === "center" || currentRole === "radiologist") && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="priority"
                checked={isPriority}
                onChange={(e) => setIsPriority(e.target.checked)}
                className="h-4 w-4 rounded border-input"
              />
              <label htmlFor="priority" className="text-sm text-muted-foreground cursor-pointer">
                Mark as urgent message
              </label>
            </div>
          )}
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
