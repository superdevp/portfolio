"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { AuthProvider } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import {
  User,
  Settings,
  FileText,
  Briefcase,
  LogOut,
  Home,
  LayoutDashboard,
  ChevronRight,
  MessageCircle,
} from "lucide-react"

function AdminNavigation() {
  const pathname = usePathname()
  const { signOut, user } = useAuth()

  if (!user) return null

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: "/admin/profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { href: "/admin/blogs", label: "Blog Posts", icon: <FileText className="w-4 h-4" /> },
    { href: "/admin/projects", label: "Projects", icon: <Briefcase className="w-4 h-4" /> },
    { href: "/admin/chat", label: "Chat", icon: <MessageCircle className="w-4 h-4" /> },
    { href: "/admin/settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ]

  return (
    <div className="bg-card border-r border-border h-screen w-64 fixed left-0 top-0">
      <div className="p-4 border-b border-border">
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          <div className="text-teal-400 font-mono text-lg">{"</>"}</div>
          <span className="font-semibold text-foreground">Admin Panel</span>
        </Link>
      </div>

      <div className="p-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  isActive(item.href)
                    ? "bg-teal-400/10 text-teal-400"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {isActive(item.href) && <ChevronRight className="w-4 h-4 ml-auto" />}
              </div>
            </Link>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-teal-400/20 flex items-center justify-center text-teal-400">
              {user.email?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="text-sm">
              <div className="font-medium truncate max-w-[120px]">{user.email}</div>
              <div className="text-xs text-muted-foreground">Admin</div>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Link href="/" className="flex-1">
            <Button variant="outline" size="sm" className="w-full border-border text-muted-foreground">
              <Home className="w-4 h-4 mr-1" />
              Site
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut()}
            className="flex-1 border-border text-muted-foreground"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <AdminNavigation />
        <div className="ml-64 min-h-screen">{children}</div>
      </div>
    </AuthProvider>
  )
}
