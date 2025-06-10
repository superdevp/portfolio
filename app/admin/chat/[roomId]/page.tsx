"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { chatService, type ChatMessage } from "@/lib/chat-service"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Send, ArrowLeft } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { useParams } from "next/navigation"

function AdminChatRoomContent() {
  const { user } = useAuth()
  const params = useParams()
  const roomId = params.roomId as string
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [typingUser, setTypingUser] = useState<string | null>(null)
  const [userOnline, setUserOnline] = useState(false)
  const typingTimeout = useRef<NodeJS.Timeout | null>(null)
  const currentUserName = "Kei (Admin)"

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!roomId) return

    // Listen to messages
    const unsubscribeMessages = chatService.onMessagesSnapshot(roomId, (messages) => {
      setMessages(messages)
      setLoading(false)
    })

    const unsubscribeTyping = chatService.onTypingStatusSnapshot(roomId, (name) => setTypingUser(name))

    chatService.updateAdminOnlineStatus(roomId, true)
    const unsubscribeUserOnline = chatService.onUserOnlineStatusSnapshot(
      roomId,
      (online) => setUserOnline(online),
    )

    const updateStatus = (online: boolean) =>
      chatService.updateAdminOnlineStatus(roomId, online)

    const handleVisibility = () => {
      updateStatus(document.visibilityState === "visible")
    }

    const handleFocus = () => updateStatus(true)
    const handleBlur = () => updateStatus(false)
    const handleUnload = () => updateStatus(false)

    updateStatus(document.visibilityState === "visible")
    window.addEventListener("focus", handleFocus)
    window.addEventListener("blur", handleBlur)
    document.addEventListener("visibilitychange", handleVisibility)
    window.addEventListener("beforeunload", handleUnload)

    return () => {
      unsubscribeMessages()
      unsubscribeTyping()
      unsubscribeUserOnline()
      chatService.updateAdminOnlineStatus(roomId, false)
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("blur", handleBlur)
      document.removeEventListener("visibilitychange", handleVisibility)
      window.removeEventListener("beforeunload", handleUnload)
    }
  }, [roomId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !roomId || !user || sending) return

    setSending(true)
    try {
      await chatService.sendMessage(
        roomId,
        newMessage.trim(),
        user.uid,
        "Kei (Admin)",
        user.email || "",
        true, // isAdmin = true
      )
      setNewMessage("")
      chatService.updateTypingStatus(roomId, null)
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setSending(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    if (!roomId) return
    chatService.updateTypingStatus(roomId, currentUserName)
    if (typingTimeout.current) clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => {
      chatService.updateTypingStatus(roomId, null)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Get user info from first message
  const userMessage = messages.find((m) => !m.isAdmin)
  const userName = userMessage?.senderName || "User"

  return (
    <div className="space-y-6 max-h-[100%] p-[40px]">
      <div className="flex justify-between items-center space-x-4">
        <div>
          <h1 className="text-2xl font-bold">Chat with {userName}</h1>
          <p className="text-muted-foreground">Admin Chat Interface</p>
          <div className="flex items-center space-x-2 mt-1">
            <span
              className={`h-2 w-2 rounded-full ${userOnline ? "bg-green-500" : "bg-red-500"}`}
            />
            <span className="text-xs text-muted-foreground">
              {userOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/chat">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chats
          </Link>
        </Button>
      </div>

      <Card className="h-[calc(100vh-200px)] flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">Conversation</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-4 h-full">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-muted/20 rounded-lg">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>No messages in this conversation yet.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`flex ${message.isAdmin ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex items-start space-x-2 max-w-[70%] ${
                      message.isAdmin ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className={message.isAdmin ? "bg-teal-500 text-white" : "bg-blue-500 text-white"}>
                        {message.isAdmin ? "E" : message.senderName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 ${
                        message.isAdmin ? "bg-teal-500 text-white" : "bg-background border shadow-sm"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.isAdmin ? "text-teal-100" : "text-muted-foreground"}`}>
                        {message.timestamp && formatDistanceToNow(message.timestamp.toDate(), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div>
            {typingUser && typingUser !== currentUserName && (
              <p className="text-xs text-muted-foreground px-5">{typingUser} is typing...</p>
            )}
            <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={handleInputChange}
                  placeholder="Type your reply..."
                  disabled={sending}
                  className="flex-1"
                  autoFocus
                />
              <Button type="submit" disabled={sending || !newMessage.trim()}>
                {sending ? <LoadingSpinner size="sm" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminChatRoomPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminChatRoomContent />
    </ProtectedRoute>
  )
}
