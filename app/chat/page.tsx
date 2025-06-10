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
import { Send, LogOut } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Header } from "@/components/header"

function ChatPageContent() {
  const { user, signOut, isUser } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [roomId, setRoomId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [typingUser, setTypingUser] = useState<string | null>(null)
  const [adminOnline, setAdminOnline] = useState(false)
  const typingTimeout = useRef<NodeJS.Timeout | null>(null)
  const currentUserName =
    user?.displayName || user?.email?.split("@")[0] || "User"

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!user) return

    const initializeChat = async () => {
      try {
        const chatRoomId = await chatService.getOrCreateChatRoom(
          user.uid,
          user.displayName || user.email?.split("@")[0] || "User",
          user.email || "",
        )
        setRoomId(chatRoomId)

        chatService.updateUserOnlineStatus(chatRoomId, true)

        const unsubscribeAdminOnline =
          chatService.onAdminOnlineStatusSnapshot(chatRoomId, (online) =>
            setAdminOnline(online),
          )

        // Listen to messages
        const unsubscribeMessages = chatService.onMessagesSnapshot(
          chatRoomId,
          (messages) => {
            setMessages(messages)
            setLoading(false)

            // Use the simpler room read marking approach
            chatService.markRoomAsRead(chatRoomId)
          },
        )

        const unsubscribeTyping = chatService.onTypingStatusSnapshot(
          chatRoomId,
          (name) => setTypingUser(name),
        )

        return () => {
          unsubscribeMessages()
          unsubscribeTyping()
          unsubscribeAdminOnline()
        }
      } catch (error) {
        console.error("Error initializing chat:", error)
        setLoading(false)
      }
    }

    const unsubscribePromise = initializeChat()
    return () => {
      if (unsubscribePromise) {
        unsubscribePromise.then((unsub) => unsub?.())
      }
    }
  }, [user])

  // Update online status based on tab focus
  useEffect(() => {
    if (!roomId) return

    const updateStatus = (online: boolean) =>
      chatService.updateUserOnlineStatus(roomId, online)

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
      updateStatus(false)
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
        user.displayName || user.email?.split("@")[0] || "User",
        user.email || "",
        false,
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

  const handleSignOut = async () => {
    try {
      if (roomId) {
        await chatService.updateUserOnlineStatus(roomId, false)
      }
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className=" bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-2xl">Chat with Kei</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Welcome, {user?.displayName || user?.email?.split("@")[0]}!
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span
                    className={`h-2 w-2 rounded-full ${adminOnline ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {adminOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col space-y-4 max-h-[80%]">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-muted/20 rounded-lg">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <p>No messages yet. Start the conversation!</p>
                    <p className="text-sm mt-2">Say hello and I'll get back to you soon! 👋</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === user?.uid ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-start space-x-2 max-w-[70%] ${
                          message.senderId === user?.uid ? "flex-row-reverse space-x-reverse" : ""
                        }`}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback
                            className={message.isAdmin ? "bg-teal-500 text-white" : "bg-blue-500 text-white"}
                          >
                            {message.isAdmin ? "E" : message.senderName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`rounded-lg p-3 ${
                            message.senderId === user?.uid ? "bg-teal-500 text-white" : "bg-background border shadow-sm"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.senderId === user?.uid ? "text-teal-100" : "text-muted-foreground"
                            }`}
                          >
                            {message.timestamp && formatDistanceToNow(message.timestamp.toDate(), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            </CardContent>
              {typingUser && typingUser !== currentUserName && (
                <p className="text-xs text-muted-foreground px-5">{typingUser} is typing...</p>
              )}
          </Card>
              <div>
                {/* Message Input */}
              
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  disabled={sending}
                  className="flex-1"
                  autoFocus
                />
                <Button type="submit" disabled={sending || !newMessage.trim()}>
                  {sending ? <LoadingSpinner size="sm" /> : <Send className="w-4 h-4" />}
                </Button>
              </form>
              </div>
        </div>
      </div>
      </>
  )
}

export default function ChatPage() {
  return (
    <ProtectedRoute userOnly>
      <ChatPageContent />
    </ProtectedRoute>
  )
}
