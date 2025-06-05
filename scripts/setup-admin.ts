import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../lib/firebase"

export async function setupAdminUser() {
  const adminEmail = "superdevp@gmail.com"
  const adminPassword = "Admin123"

  try {
    console.log("Creating admin user...")

    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword)
    const user = userCredential.user

    console.log("✅ Admin user created successfully!")
    console.log("Email:", user.email)
    console.log("UID:", user.uid)
    console.log("Created at:", user.metadata.creationTime)

    return {
      success: true,
      user: {
        email: user.email,
        uid: user.uid,
        createdAt: user.metadata.creationTime,
      },
    }
  } catch (error: any) {
    console.error("❌ Error creating admin user:", error.message)

    if (error.code === "auth/email-already-in-use") {
      console.log("ℹ️  Admin user already exists. You can log in with the existing account.")
      return {
        success: false,
        error: "User already exists",
        canLogin: true,
      }
    }

    return {
      success: false,
      error: error.message,
      canLogin: false,
    }
  }
}
