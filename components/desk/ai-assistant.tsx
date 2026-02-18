"use client"

import React, { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, Send, Plus, MessageSquare, ChevronLeft, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "¡Hola! Soy LitiBot 🦝, tu asistente legal. ¿En qué puedo ayudarte hoy?",
  timestamp: new Date(),
}

function createConversation(): Conversation {
  return {
    id: Date.now().toString(),
    title: "Nueva conversación",
    messages: [{ ...WELCOME_MESSAGE, id: `welcome-${Date.now()}`, timestamp: new Date() }],
    createdAt: new Date(),
  }
}

const TOOLTIP_PHRASES = [
  "¿En qué te puedo ayudar?",
  "¿En qué trabajamos hoy?",
  "Estoy listo para asistirte",
  "¿Necesitas algo?",
  "¡Hablemos de tu caso!",
  "¿Revisamos tus tareas?",
  "Pregúntame lo que quieras",
]

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)

  const [showConversations, setShowConversations] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>(() => [createConversation()])
  const [activeConversationId, setActiveConversationId] = useState<string>(() => conversations[0]?.id || "")
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const [tooltipIndex, setTooltipIndex] = useState(0)

  const activeConversation = conversations.find((c) => c.id === activeConversationId)
  const messages = activeConversation?.messages || []

  /* SSR guard — only render portal after mount */
  useEffect(() => { setMounted(true) }, [])

  /* Native pointerdown blocker — stops the event BEFORE Radix's document listener sees it */
  useEffect(() => {
    const stop = (e: PointerEvent) => {
      e.stopPropagation()
    }
    const btn = btnRef.current
    const wrap = wrapperRef.current
    btn?.addEventListener('pointerdown', stop, true)
    wrap?.addEventListener('pointerdown', stop, true)
    return () => {
      btn?.removeEventListener('pointerdown', stop, true)
      wrap?.removeEventListener('pointerdown', stop, true)
    }
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const updateConversationTitle = (convId: string, userMessage: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId && c.title === "Nueva conversación"
          ? { ...c, title: userMessage.length > 30 ? userMessage.slice(0, 30) + "..." : userMessage }
          : c
      )
    )
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !activeConversation) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? { ...c, messages: [...c.messages, userMessage] }
          : c
      )
    )

    updateConversationTitle(activeConversationId, inputValue)
    setInputValue("")
    setIsTyping(true)

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Esta es una respuesta simulada. Aquí se conectaría con la API real para consultar información de la plataforma o Streak.",
        timestamp: new Date(),
      }
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? { ...c, messages: [...c.messages, botMessage] }
            : c
        )
      )
      setIsTyping(false)
    }, 1000)
  }

  const handleNewConversation = () => {
    const newConv = createConversation()
    setConversations((prev) => [newConv, ...prev])
    setActiveConversationId(newConv.id)
    setShowConversations(false)
  }

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id)
    setShowConversations(false)
  }

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id)
      if (filtered.length === 0) {
        const newConv = createConversation()
        setActiveConversationId(newConv.id)
        return [newConv]
      }
      if (id === activeConversationId) {
        setActiveConversationId(filtered[0].id)
      }
      return filtered
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!mounted) return null

  if (!isOpen) {
    return createPortal(
      <div
        className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 group"
        data-litibot
        style={{ pointerEvents: 'auto' }}
        onMouseEnter={() => setTooltipIndex((prev) => (prev + 1) % TOOLTIP_PHRASES.length)}
      >
        {/* Tooltip bubble — only visible on hover */}
        <div className="relative bg-white/95 backdrop-blur-sm rounded-lg shadow-sm px-3 py-1.5 text-xs text-slate-500 border border-slate-100/80 max-w-[180px] opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
          {TOOLTIP_PHRASES[tooltipIndex]}
          <div className="absolute top-1/2 -right-[5px] -translate-y-1/2 w-2.5 h-2.5 bg-white/95 border-r border-b border-slate-100/80 rotate-[-45deg]" />
        </div>
        <button
          ref={btnRef}
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative w-14 h-14 bg-gradient-to-br from-indigo-950 via-[#262262] to-violet-900 hover:from-indigo-900 hover:to-violet-800 text-white rounded-full shadow-[0_4px_24px_rgba(38,34,98,0.45)] hover:shadow-[0_6px_32px_rgba(38,34,98,0.6)] flex items-center justify-center transition-all duration-150 hover:scale-110 ring-2 ring-white/20 hover:ring-white/40"
        >
          <span className="text-[26px] drop-shadow-sm">🦝</span>
        </button>
      </div>,
      document.body
    )
  }

  return createPortal(
    <div ref={wrapperRef} className="fixed bottom-6 right-6 w-96 z-[9999] transition-all" data-litibot style={{ pointerEvents: 'auto' }}>
      <Card className="shadow-2xl border-indigo-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 to-violet-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showConversations ? (
              <button
                type="button"
                onClick={() => setShowConversations(false)}
                className="hover:bg-white/20 p-1.5 rounded transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
            ) : (
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl">🦝</span>
              </div>
            )}
            <div>
              <h3 className="font-bold text-sm">
                {showConversations ? "Conversaciones" : "LitiBot"}
              </h3>
              <p className="text-xs text-indigo-100">
                {showConversations
                  ? `${conversations.length} conversación${conversations.length !== 1 ? "es" : ""}`
                  : "Siempre disponible"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {!showConversations && (
              <button
                type="button"
                onClick={() => setShowConversations(true)}
                className="hover:bg-white/20 p-1.5 rounded transition-colors"
                title="Ver conversaciones"
              >
                <MessageSquare size={16} />
              </button>
            )}
            {!showConversations && (
              <button
                type="button"
                onClick={handleNewConversation}
                className="hover:bg-white/20 p-1.5 rounded transition-colors"
                title="Nueva conversación"
              >
                <Plus size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1.5 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <>
          {showConversations ? (
            /* Conversations List */
            <div className="h-96 overflow-y-auto bg-slate-50">
              <div className="p-3">
                <button
                  type="button"
                  onClick={handleNewConversation}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-indigo-300 hover:text-indigo-950 hover:bg-indigo-50 transition-all text-sm font-semibold"
                >
                  <Plus size={18} />
                  Nueva conversación
                </button>
              </div>
              <div className="px-3 pb-3 space-y-1">
                {conversations.map((conv) => (
                  <button
                    type="button"
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all group ${conv.id === activeConversationId
                      ? "bg-indigo-950 text-white"
                      : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-100"
                      }`}
                  >
                    <MessageSquare size={16} className="shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{conv.title}</p>
                      <p className={`text-xs mt-0.5 ${conv.id === activeConversationId ? "text-indigo-200" : "text-slate-400"
                        }`}>
                        {conv.messages.length - 1} mensaje{conv.messages.length - 1 !== 1 ? "s" : ""} · {conv.createdAt.toLocaleDateString("es-CL", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteConversation(conv.id, e)}
                      className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${conv.id === activeConversationId
                        ? "hover:bg-white/20"
                        : "hover:bg-slate-200"
                        }`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Messages Area */
            <div className="h-96 overflow-y-auto p-4 bg-slate-50 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.role === "user"
                      ? "bg-indigo-950 text-white"
                      : "bg-white text-slate-800 border border-slate-200"
                      }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${message.role === "user"
                        ? "text-violet-200"
                        : "text-slate-400"
                        }`}
                    >
                      {message.timestamp.toLocaleTimeString("es-CL", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-slate-800 border border-slate-200 rounded-2xl px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input Area - only show in chat view */}
          {!showConversations && (
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu pregunta..."
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-950/30 text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-indigo-950 hover:bg-indigo-900 text-white px-4"
                >
                  <Send size={18} />
                </Button>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Pregunta sobre casos, clientes o información en Streak
              </p>
            </div>
          )}
        </>
      </Card>
    </div>,
    document.body
  )
}
