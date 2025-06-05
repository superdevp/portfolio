"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { LoadingSpinner } from "@/components/loading-spinner"

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
  userOnly?: boolean
  requireAuth?: boolean
}

export function ProtectedRoute({
  children,
  adminOnly = false,
  userOnly = false,
  requireAuth = true,
}: ProtectedRouteProps) {
  const { user, loading, isAdmin, isUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push("/auth/login")
      } else if (adminOnly && !isAdmin) {
        router.push("/auth/unauthorized")
      } else if (userOnly && !isUser) {
        router.push("/auth/unauthorized")
      }
    }
  }, [user, loading, isAdmin, isUser, router, adminOnly, userOnly, requireAuth])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (requireAuth && !user) {
    return null
  }

  if (adminOnly && !isAdmin) {
    return null
  }

  if (userOnly && !isUser) {
    return null
  }

  return <>{children}</>
}
