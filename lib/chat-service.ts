import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore"
import { db } from "./firebase"

export interface ChatMessage {
  id: string
  text: string
  senderId: string
  senderName: string
  senderEmail: string
  timestamp: any
  isAdmin: boolean
  read: boolean
}

export interface ChatRoom {
  id: string
  userId: string
  userName: string
  userEmail: string
  lastMessage: string
  lastMessageTime: any
  unreadCount: number
  isActive: boolean
  userOnline?: boolean
  adminOnline?: boolean
  typing?: string
}

export const chatService = {
  // Send a message
  async sendMessage(
    roomId: string,
    text: string,
    senderId: string,
    senderName: string,
    senderEmail: string,
    isAdmin = false,
  ): Promise<void> {
    try {
      await addDoc(collection(db, `chatRooms/${roomId}/messages`), {
        text,
        senderId,
        senderName,
        senderEmail,
        timestamp: serverTimestamp(),
        isAdmin,
        read: false,
      })

      // Update room's last message
      await updateDoc(doc(db, "chatRooms", roomId), {
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
        isActive: true,
      })
    } catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  },

  // Listen to messages in a room
  onMessagesSnapshot(roomId: string, callback: (messages: ChatMessage[]) => void): () => void {
    const q = query(collection(db, `chatRooms/${roomId}/messages`), orderBy("timestamp", "asc"))

    return onSnapshot(q, (snapshot) => {
      const messages: ChatMessage[] = []
      snapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data(),
        } as ChatMessage)
      })
      callback(messages)
    })
  },

  // Create or get chat room for user
  async getOrCreateChatRoom(userId: string, userName: string, userEmail: string): Promise<string> {
    try {
      // Check if room already exists
      const q = query(collection(db, "chatRooms"), where("userId", "==", userId))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].id
      }

      // Create new room
      const docRef = await addDoc(collection(db, "chatRooms"), {
        userId,
        userName,
        userEmail,
        lastMessage: "",
        lastMessageTime: serverTimestamp(),
        unreadCount: 0,
        isActive: true,
        userOnline: true,
        adminOnline: false,
        createdAt: serverTimestamp(),
      })

      return docRef.id
    } catch (error) {
      console.error("Error creating chat room:", error)
      throw error
    }
  },

  // Get all chat rooms (for admin)
  onChatRoomsSnapshot(callback: (rooms: ChatRoom[]) => void): () => void {
    const q = query(collection(db, "chatRooms"), orderBy("lastMessageTime", "desc"))

    return onSnapshot(q, (snapshot) => {
      const rooms: ChatRoom[] = []
      snapshot.forEach((doc) => {
        rooms.push({
          id: doc.id,
          ...doc.data(),
        } as ChatRoom)
      })
      callback(rooms)
    })
  },

  // Simplified mark messages as read - mark all messages in room as read
  async markMessagesAsRead(roomId: string, currentUserId: string): Promise<void> {
    try {
      // Get all unread messages in the room
      const messagesRef = collection(db, `chatRooms/${roomId}/messages`)
      const q = query(messagesRef, where("read", "==", false))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) return

      // Use batch to update multiple documents
      const batch = writeBatch(db)

      querySnapshot.docs.forEach((docSnapshot) => {
        const messageData = docSnapshot.data()
        // Only mark messages as read if they're not from the current user
        if (messageData.senderId !== currentUserId) {
          batch.update(docSnapshot.ref, { read: true })
        }
      })

      await batch.commit()
    } catch (error) {
      console.error("Error marking messages as read:", error)
      // Don't throw error to prevent chat from breaking
    }
  },

  // Alternative simpler approach - just mark room as read without complex queries
  async markRoomAsRead(roomId: string): Promise<void> {
    try {
      await updateDoc(doc(db, "chatRooms", roomId), {
        unreadCount: 0,
      })
    } catch (error) {
      console.error("Error marking room as read:", error)
    }
  },

  // Update typing status for a chat room
  async updateTypingStatus(
    roomId: string,
    typingUser: string | null,
  ): Promise<void> {
    try {
      await updateDoc(doc(db, "chatRooms", roomId), {
        typing: typingUser,
      })
    } catch (error) {
      console.error("Error updating typing status:", error)
    }
  },

  // Listen to typing status changes
  onTypingStatusSnapshot(
    roomId: string,
    callback: (typingUser: string | null) => void,
  ): () => void {
    const roomDoc = doc(db, "chatRooms", roomId)
    return onSnapshot(roomDoc, (snapshot) => {
      const data = snapshot.data()
      callback((data?.typing as string) || null)
    })
  },

  // Update online status for user
  async updateUserOnlineStatus(
    roomId: string,
    online: boolean,
  ): Promise<void> {
    try {
      await updateDoc(doc(db, "chatRooms", roomId), {
        userOnline: online,
      })
    } catch (error) {
      console.error("Error updating user online status:", error)
    }
  },

  // Update online status for admin
  async updateAdminOnlineStatus(
    roomId: string,
    online: boolean,
  ): Promise<void> {
    try {
      await updateDoc(doc(db, "chatRooms", roomId), {
        adminOnline: online,
      })
    } catch (error) {
      console.error("Error updating admin online status:", error)
    }
  },

  // Listen to admin online status
  onAdminOnlineStatusSnapshot(
    roomId: string,
    callback: (online: boolean) => void,
  ): () => void {
    const roomDoc = doc(db, "chatRooms", roomId)
    return onSnapshot(roomDoc, (snapshot) => {
      const data = snapshot.data()
      callback(Boolean(data?.adminOnline))
    })
  },

  // Listen to user online status
  onUserOnlineStatusSnapshot(
    roomId: string,
    callback: (online: boolean) => void,
  ): () => void {
    const roomDoc = doc(db, "chatRooms", roomId)
    return onSnapshot(roomDoc, (snapshot) => {
      const data = snapshot.data()
      callback(Boolean(data?.userOnline))
    })
  },
}
