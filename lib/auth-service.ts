import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "./firebase"

export const authService = {
  // Sign up a new user
  async signUp(email: string, password: string, displayName?: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update display name if provided
      if (displayName) {
        await updateProfile(user, { displayName })
      }

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: displayName || user.email?.split("@")[0] || "User",
        role: "user",
        createdAt: new Date(),
        lastActive: new Date(),
      })

      return user
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign up")
    }
  },

  // Sign in an existing user
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      // Update last active time
      if (userCredential.user) {
        await setDoc(
          doc(db, "users", userCredential.user.uid),
          {
            lastActive: new Date(),
          },
          { merge: true },
        )
      }

      return userCredential.user
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign in")
    }
  },

  // Sign out the current user
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth)
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign out")
    }
  },

  // Get the current user
  getCurrentUser(): User | null {
    return auth.currentUser
  },

  // Listen for auth state changes
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback)
  },
}
