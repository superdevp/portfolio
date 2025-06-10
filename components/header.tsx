"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Github, Search, Home, FileText, MessageCircle, Code, User } from "lucide-react"
import { SearchModal } from "./search-modal"
import { ThemeToggle } from "./theme-toggle"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { usePersonalInfo } from "@/hooks/useFirebaseData"

export function Header() {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { user, isAdmin, isUser, signOut } = useAuth()
  const { info: personalInfo } = usePersonalInfo()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-teal-400 font-mono text-lg">{"</>"}</div>
            
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`flex items-center space-x-1 hover:text-teal-400 transition-colors ${
                isActive("/") ? "text-teal-400" : "text-muted-foreground"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/blogs"
              className={`flex items-center space-x-1 hover:text-teal-400 transition-colors ${
                isActive("/blogs") ? "text-teal-400" : "text-muted-foreground"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Blogs</span>
            </Link>
            <Link
              href="/projects"
              className={`flex items-center space-x-1 hover:text-teal-400 transition-colors ${
                isActive("/projects") ? "text-teal-400" : "text-muted-foreground"
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Projects</span>
            </Link>
            <Link
              href="/about"
              className={`flex items-center space-x-1 hover:text-teal-400 transition-colors ${
                isActive("/about") ? "text-teal-400" : "text-muted-foreground"
              }`}
            >
              <User className="w-4 h-4" />
              <span>About</span>
            </Link>

            {/* Auth-based navigation */}
            {user ? (
              <>
                {isUser && (
                  <Link
                    href="/chat"
                    className={`flex items-center space-x-1 hover:text-teal-400 transition-colors ${
                      isActive("/chat") ? "text-teal-400" : "text-muted-foreground"
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat</span>
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className={`flex items-center space-x-1 hover:text-teal-400 transition-colors ${
                      pathname.startsWith("/admin") ? "text-teal-400" : "text-muted-foreground"
                    }`}
                  >
                    <span>Admin</span>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-muted-foreground hover:text-teal-400"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/auth/login" className="text-muted-foreground hover:text-teal-400 transition-colors">
                Sign In
              </Link>
            )}

            <Search
              className="w-4 h-4 cursor-pointer hover:text-teal-400 transition-colors text-muted-foreground"
              onClick={() => setIsSearchOpen(true)}
            />
            {personalInfo?.socialLinks.github && (
              <a
                href={personalInfo.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4 cursor-pointer hover:text-teal-400 transition-colors text-muted-foreground" />
              </a>
            )}
            <ThemeToggle />
          </div>
        </nav>
      </div>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  )
}
