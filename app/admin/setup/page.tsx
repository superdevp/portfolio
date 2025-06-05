"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { CheckCircle, XCircle, User, ArrowRight } from "lucide-react"

export default function AdminSetupPage() {
  const [setupResult, setSetupResult] = useState<any>(null)
  const [settingUp, setSettingUp] = useState(false)

  const setupAdminUser = async () => {
    setSettingUp(true)
    setSetupResult(null)

    try {
      const response = await fetch("/api/setup-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      setSetupResult(data)
    } catch (error) {
      setSetupResult({
        success: false,
        message: "Network error occurred",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setSettingUp(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center space-x-2">
            <User className="w-6 h-6 text-teal-400" />
            <span>Admin Setup</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-muted-foreground">
            <p className="mb-4">Create your admin user account to access the portfolio admin panel.</p>
          </div>

          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Admin Credentials:</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="font-mono">superdevp@gmail.com</span>
              </div>
              <div className="flex justify-between">
                <span>Password:</span>
                <span className="font-mono">Admin123</span>
              </div>
            </div>
          </div>

          <Button
            onClick={setupAdminUser}
            disabled={settingUp}
            className="w-full bg-teal-400 text-gray-900 hover:bg-teal-500"
          >
            {settingUp ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Creating Admin User...
              </>
            ) : (
              "Create Admin User Account"
            )}
          </Button>

          {setupResult && (
            <div
              className={`p-4 rounded-lg border ${
                setupResult.success
                  ? "bg-green-500/10 border-green-500 text-green-400"
                  : "bg-red-500/10 border-red-500 text-red-400"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                {setupResult.success ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                <span className="font-medium">{setupResult.success ? "Success!" : "Error"}</span>
              </div>
              <p className="text-sm mb-2">{setupResult.message}</p>

              {setupResult.success && setupResult.user && (
                <div className="mt-3 text-xs space-y-1">
                  <p>
                    <strong>User ID:</strong> {setupResult.user.uid}
                  </p>
                  <p>
                    <strong>Created:</strong> {setupResult.user.createdAt}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <Link href="/">
              <Button variant="outline" className="border-border text-muted-foreground">
                Back to Site
              </Button>
            </Link>
            {(setupResult?.success || setupResult?.canLogin) && (
              <Link href="/admin/login">
                <Button className="bg-teal-400 text-gray-900 hover:bg-teal-500">
                  Go to Login <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            )}
          </div>

          <div className="text-xs text-muted-foreground text-center">
            <p>
              <strong>Security Note:</strong> Change your password after first login for better security.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
