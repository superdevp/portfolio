"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/loading-spinner"
import { blogPostsService } from "@/lib/firebase-services"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { BlogPost } from "@/lib/types"

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>
}

export default function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const router = useRouter()
  const [postId, setPostId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [post, setPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params
      setPostId(resolvedParams.id)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (postId) {
      fetchPost()
    }
  }, [postId])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const docRef = doc(db, "blogPosts", postId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const postData = { id: docSnap.id, ...docSnap.data() } as BlogPost
        setPost(postData)
      } else {
        setError("Blog post not found")
      }
    } catch (error) {
      console.error("Error fetching post:", error)
      setError("Failed to load blog post")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!post) return

    const { name, value, type } = e.target

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setPost((prev) => (prev ? { ...prev, [name]: checked } : null))
    } else {
      setPost((prev) => (prev ? { ...prev, [name]: value } : null))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!post) return

    setError(null)
    setSaving(true)

    try {
      if (!post.title.trim() || !post.content.trim()) {
        setError("Title and content are required")
        return
      }

      const updatedPost = {
        ...post,
        updatedAt: new Date(),
      }

      const success = await blogPostsService.update(postId, updatedPost)
      if (success) {
        router.push("/admin/blogs")
      } else {
        setError("Failed to update blog post")
      }
    } catch (error) {
      console.error("Error updating post:", error)
      setError("An error occurred while updating the post")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="p-8 flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </ProtectedRoute>
    )
  }

  if (error && !post) {
    return (
      <ProtectedRoute>
        <div className="p-8">
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-md">{error}</div>
          <Link href="/admin/blogs" className="mt-4 inline-block">
            <Button variant="outline">Back to Posts</Button>
          </Link>
        </div>
      </ProtectedRoute>
    )
  }

  if (!post) return null

  return (
    <ProtectedRoute>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin/blogs">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Posts
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Edit Blog Post</h1>
              <p className="text-muted-foreground">Update your blog post content and settings.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-md mb-6">{error}</div>}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Post Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-foreground">
                      Title *
                    </label>
                    <Input
                      id="title"
                      name="title"
                      value={post.title}
                      onChange={handleChange}
                      className="bg-background border-border text-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="slug" className="text-sm font-medium text-foreground">
                      Slug
                    </label>
                    <Input
                      id="slug"
                      name="slug"
                      value={post.slug}
                      onChange={handleChange}
                      className="bg-background border-border text-foreground"
                    />
                    <p className="text-xs text-muted-foreground">URL: /blogs/{post.slug}</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="excerpt" className="text-sm font-medium text-foreground">
                      Excerpt
                    </label>
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      value={post.excerpt}
                      onChange={handleChange}
                      rows={3}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="content" className="text-sm font-medium text-foreground">
                      Content *
                    </label>
                    <Textarea
                      id="content"
                      name="content"
                      value={post.content}
                      onChange={handleChange}
                      rows={15}
                      className="bg-background border-border text-foreground font-mono text-sm"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Post Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium text-foreground">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={post.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                    >
                      <option value="Technology">Technology</option>
                      <option value="Career">Career</option>
                      <option value="JavaScript">JavaScript</option>
                      <option value="React">React</option>
                      <option value="Backend">Backend</option>
                      <option value="CSS">CSS</option>
                      <option value="TypeScript">TypeScript</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="readTime" className="text-sm font-medium text-foreground">
                      Read Time
                    </label>
                    <Input
                      id="readTime"
                      name="readTime"
                      value={post.readTime}
                      onChange={handleChange}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="image" className="text-sm font-medium text-foreground">
                      Featured Image URL
                    </label>
                    <Input
                      id="image"
                      name="image"
                      value={post.image}
                      onChange={handleChange}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        name="featured"
                        checked={post.featured}
                        onChange={handleChange}
                        className="rounded border-border"
                      />
                      <label htmlFor="featured" className="text-sm font-medium text-foreground">
                        Featured Post
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="trending"
                        name="trending"
                        checked={post.trending}
                        onChange={handleChange}
                        className="rounded border-border"
                      />
                      <label htmlFor="trending" className="text-sm font-medium text-foreground">
                        Trending Post
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-teal-400 text-gray-900 hover:bg-teal-500"
                  >
                    {saving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    {saving ? "Updating..." : "Update Post"}
                  </Button>

                  <Link href={`/blogs/${post.slug}`} target="_blank">
                    <Button variant="outline" className="w-full border-border text-muted-foreground">
                      <Eye className="w-4 h-4 mr-2" />
                      View Post
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  )
}
