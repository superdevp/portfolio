"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/loading-spinner"
import { blogPostsService } from "@/lib/firebase-services"
import { Plus, Search, Edit, Trash2, Eye, Calendar, Clock, TrendingUp } from "lucide-react"
import type { BlogPost } from "@/lib/types"

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const data = await blogPostsService.getAll()
      setPosts(data)
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    setDeleting(id)
    try {
      const success = await blogPostsService.delete(id)
      if (success) {
        setPosts(posts.filter((post) => post.id !== id))
      } else {
        alert("Failed to delete blog post")
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Error deleting blog post")
    } finally {
      setDeleting(null)
    }
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <ProtectedRoute>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Blog Posts</h1>
            <p className="text-muted-foreground">Manage your blog posts and articles.</p>
          </div>
          <Link href="/admin/blogs/new">
            <Button className="bg-teal-400 text-gray-900 hover:bg-teal-500">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>

        <Card className="bg-card border-border mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search posts by title or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border"
                />
              </div>
              <Button
                onClick={fetchPosts}
                variant="outline"
                className="border-border text-muted-foreground"
                disabled={loading}
              >
                {loading ? <LoadingSpinner size="sm" /> : "Refresh"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="p-12 text-center">
                  <div className="text-muted-foreground">
                    <p className="text-lg mb-4">No blog posts found</p>
                    <p className="mb-6">Create your first blog post to get started.</p>
                    <Link href="/admin/blogs/new">
                      <Button className="bg-teal-400 text-gray-900 hover:bg-teal-500">
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Post
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredPosts.map((post) => (
                <Card key={post.id} className="bg-card border-border hover:border-teal-400 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-semibold text-foreground">{post.title}</h3>
                          {post.featured && (
                            <span className="px-2 py-1 bg-teal-400/20 text-teal-400 text-xs rounded-full">
                              Featured
                            </span>
                          )}
                          {post.trending && (
                            <span className="px-2 py-1 bg-orange-500/20 text-orange-500 text-xs rounded-full flex items-center">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Trending
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{post.date}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views} views</span>
                          </span>
                          <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Link href={`/blogs/${post.slug}`} target="_blank">
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/blogs/edit/${post.id}`}>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => post.id && handleDelete(post.id)}
                          disabled={deleting === post.id}
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        >
                          {deleting === post.id ? <LoadingSpinner size="sm" /> : <Trash2 className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
