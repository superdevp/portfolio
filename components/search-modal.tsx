"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, FileText, User, Code } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface SearchResult {
  type: "blog" | "page" | "project"
  title: string
  description: string
  url: string
  image?: string
  date?: string
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Mock search data - in a real app, this would come from an API or database
  const searchData: SearchResult[] = [
    {
      type: "blog",
      title: "What does it take to become a web developer?",
      description: "Web development encompasses a variety of tasks and processes involved in creating websites...",
      url: "/blogs/what-does-it-take-to-become-a-web-developer",
      image: "/placeholder.svg?height=60&width=60",
      date: "16.03.2023",
    },
    {
      type: "blog",
      title: "Modern JavaScript Frameworks Comparison",
      description: "Exploring the differences between React, Vue, and Angular to help you choose...",
      url: "/blogs/modern-javascript-frameworks-comparison",
      image: "/placeholder.svg?height=60&width=60",
      date: "12.03.2023",
    },
    {
      type: "blog",
      title: "Building Scalable Node.js Applications",
      description: "Learn the best practices for creating robust and scalable backend applications...",
      url: "/blogs/building-scalable-nodejs-applications",
      image: "/placeholder.svg?height=60&width=60",
      date: "08.03.2023",
    },
    {
      type: "page",
      title: "About Me",
      description: "Learn more about my journey, experience, and technical skills as a full-stack developer.",
      url: "/about",
    },
    {
      type: "page",
      title: "Blog Posts",
      description: "Read my thoughts on technology, web development, and programming best practices.",
      url: "/blogs",
    },
    {
      type: "project",
      title: "E-Commerce Platform",
      description: "A modern e-commerce solution built with React and Node.js",
      url: "#",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      type: "project",
      title: "Task Management App",
      description: "Collaborative project management tool with real-time updates",
      url: "#",
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)

    // Simulate API delay
    const timer = setTimeout(() => {
      const filteredResults = searchData.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()),
      )
      setResults(filteredResults)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const getIcon = (type: string) => {
    switch (type) {
      case "blog":
        return <FileText className="w-4 h-4" />
      case "page":
        return <User className="w-4 h-4" />
      case "project":
        return <Code className="w-4 h-4" />
      default:
        return <Search className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "blog":
        return "text-blue-400"
      case "page":
        return "text-green-400"
      case "project":
        return "text-purple-400"
      default:
        return "text-muted-foreground"
    }
  }

  const handleResultClick = () => {
    setQuery("")
    setResults([])
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background border-border text-foreground max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Search</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search for blog posts, pages, or projects..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 bg-background border-border text-foreground placeholder-muted-foreground focus:border-teal-400"
              autoFocus
            />
          </div>

          {query.length >= 2 && (
            <div className="max-h-96 overflow-y-auto space-y-2">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="animate-spin w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                  Searching...
                </div>
              ) : results.length > 0 ? (
                <>
                  <div className="text-sm text-muted-foreground mb-3">
                    Found {results.length} result{results.length !== 1 ? "s" : ""}
                  </div>
                  {results.map((result, index) => (
                    <Link
                      key={index}
                      href={result.url}
                      onClick={handleResultClick}
                      className="block p-3 rounded-lg bg-muted hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        {result.image && (
                          <Image
                            src={result.image || "/placeholder.svg"}
                            alt={result.title}
                            width={60}
                            height={60}
                            className="rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={getTypeColor(result.type)}>{getIcon(result.type)}</span>
                            <span className={`text-xs uppercase font-medium ${getTypeColor(result.type)}`}>
                              {result.type}
                            </span>
                            {result.date && <span className="text-xs text-muted-foreground">• {result.date}</span>}
                          </div>
                          <h3 className="font-medium text-foreground mb-1 truncate">{result.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{result.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No results found for "{query}"</p>
                  <p className="text-sm mt-1">Try searching for blog posts, pages, or projects</p>
                </div>
              )}
            </div>
          )}

          {query.length < 2 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Start typing to search...</p>
              <p className="text-sm mt-1">Search for blog posts, pages, or projects</p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose} className="border-border text-muted-foreground hover:bg-accent">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
