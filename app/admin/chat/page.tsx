"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ProtectedRoute } from "@/components/protected-route"
import { chatService, type ChatRoom } from "@/lib/chat-service"
import { LoadingSpinner } from "@/components/loading-spinner"
import { MessageCircle, Users, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

function AdminChatContent() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = chatService.onChatRoomsSnapshot((rooms) => {
      setChatRooms(rooms)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-[40px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Chat Management</h1>
          <p className="text-muted-foreground">Manage conversations with users</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chatRooms.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chatRooms.filter((room) => room.isActive).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chatRooms.reduce((total, room) => total + room.unreadCount, 0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Rooms List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          {chatRooms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {chatRooms.map((room) => (
                <div
                  key={room.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback className="bg-blue-500 text-white">
                        {room.userName?.charAt(0).toUpperCase() || ''}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{room.userName}</h3>
                        {room.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {room.unreadCount} new
                          </Badge>
                        )}
                        {room.isActive && (
                          <Badge variant="secondary" className="text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{room.userEmail}</p>
                      {room.lastMessage && (
                        <p className="text-sm text-muted-foreground truncate max-w-md">{room.lastMessage}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {room.lastMessageTime && (
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(room.lastMessageTime.toDate(), { addSuffix: true })}
                      </span>
                    )}
                    <Button asChild size="sm">
                      <Link href={`/admin/chat/${room.id}`}>View Chat</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminChatPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminChatContent />
    </ProtectedRoute>
  )
}
