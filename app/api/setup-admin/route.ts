import { NextResponse } from "next/server"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"

export async function POST() {
  try {
    const adminEmail = "superdevp@gmail.com"
    const adminPassword = "Admin123"

    console.log("Setting up admin user...")

    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword)
    const user = userCredential.user

    console.log("Admin user created successfully!")

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully!",
      user: {
        email: user.email,
        uid: user.uid,
        createdAt: user.metadata.creationTime,
      },
    })
  } catch (error: any) {
    console.error("Error creating admin user:", error)

    if (error.code === "auth/email-already-in-use") {
      return NextResponse.json({
        success: false,
        message: "Admin user already exists. You can log in with the existing account.",
        error: "User already exists",
        canLogin: true,
      })
    }

    if (error.code === "auth/weak-password") {
      return NextResponse.json({
        success: false,
        message: "Password is too weak. Please use a stronger password.",
        error: error.message,
        canLogin: false,
      })
    }

    if (error.code === "auth/invalid-email") {
      return NextResponse.json({
        success: false,
        message: "Invalid email address format.",
        error: error.message,
        canLogin: false,
      })
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create admin user",
        error: error.message,
        canLogin: false,
      },
      { status: 500 },
    )
  }
}
