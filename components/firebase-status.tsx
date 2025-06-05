"use client"

import { AlertCircle, WifiOff } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface FirebaseStatusProps {
  usingFallback?: boolean
  error?: string | null
  className?: string
}

export function FirebaseStatus({ usingFallback, error, className }: FirebaseStatusProps) {
  if (!usingFallback && !error) return null

  return (
    <Card className={`bg-yellow-500/10 border-yellow-500 ${className}`}>
      <CardContent className="p-3">
        <div className="flex items-center space-x-2 text-yellow-600">
          {usingFallback ? <WifiOff className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span className="text-sm">{usingFallback ? "Using offline data" : error}</span>
        </div>
      </CardContent>
    </Card>
  )
}
