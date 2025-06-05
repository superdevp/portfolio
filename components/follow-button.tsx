"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function FollowButton() {
  const { user } = useAuth()
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const check = async () => {
      if (!user) return
      try {
        const res = await fetch(`/api/follow?userId=${user.uid}`)
        const data = await res.json()
        if (data.isFollowing) setFollowing(true)
      } catch {
        // ignore
      }
    }
    check()
  }, [user])

  const follow = async () => {
    if (!user) return
    setLoading(true)
    try {
      await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid }),
      })
      setFollowing(true)
    } finally {
      setLoading(false)
    }
  }

  const unfollow = async () => {
    if (!user) return
    setLoading(true)
    try {
      await fetch("/api/follow", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid }),
      })
      setFollowing(false)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Link href="/auth/login">
        <Button className="bg-teal-400 text-gray-900 hover:bg-teal-500">Follow</Button>
      </Link>
    )
  }

  return (
    <Button
      onClick={following ? unfollow : follow}
      disabled={loading}
      className={following ? "bg-red-500 hover:bg-red-600" : "bg-teal-400 text-gray-900 hover:bg-teal-500"}
    >
      {following ? "Unfollow" : "Follow"}
    </Button>
  )
}
