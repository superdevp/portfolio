"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-500 flex items-center justify-center space-x-2">
            <AlertTriangle className="w-6 h-6" />
            <span>Unauthorized Access</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            You don't have permission to access this page. Please contact the administrator if you believe this is an
            error.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/">
              <Button variant="outline" className="border-border text-foreground">
                Go to Homepage
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button className="bg-teal-400 text-gray-900 hover:bg-teal-500">Login Again</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
