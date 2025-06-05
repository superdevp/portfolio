"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/loading-spinner"
import { projectsService } from "@/lib/firebase-services"
import { ArrowLeft, Save, Plus, X } from "lucide-react"
import Link from "next/link"
import type { Project } from "@/lib/types"

export default function NewProjectPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newTech, setNewTech] = useState("")
  const [project, setProject] = useState<Omit<Project, "id">>({
    title: "",
    description: "",
    image: "/placeholder.svg?height=200&width=300",
    technologies: [],
    githubUrl: "",
    liveUrl: "",
    featured: false,
    order: 1,
    category: "Full-Stack",
    createdAt: new Date(),
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setProject((prev) => ({ ...prev, [name]: checked }))
    } else if (type === "number") {
      setProject((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
    } else {
      setProject((prev) => ({ ...prev, [name]: value }))
    }
  }

  const addTechnology = () => {
    if (newTech.trim() && !project.technologies.includes(newTech.trim())) {
      setProject((prev) => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()],
      }))
      setNewTech("")
    }
  }

  const removeTechnology = (tech: string) => {
    setProject((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      if (!project.title.trim() || !project.description.trim()) {
        setError("Title and description are required")
        return
      }

      const projectId = await projectsService.add(project)
      if (projectId) {
        router.push("/admin/projects")
      } else {
        setError("Failed to create project")
      }
    } catch (error) {
      console.error("Error creating project:", error)
      setError("An error occurred while creating the project")
    } finally {
      setSaving(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin/projects">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Create New Project</h1>
              <p className="text-muted-foreground">Add a new project to your portfolio.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-md mb-6">{error}</div>}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-foreground">
                      Project Title *
                    </label>
                    <Input
                      id="title"
                      name="title"
                      value={project.title}
                      onChange={handleChange}
                      placeholder="Enter project title..."
                      className="bg-background border-border text-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium text-foreground">
                      Description *
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      value={project.description}
                      onChange={handleChange}
                      placeholder="Describe your project..."
                      rows={4}
                      className="bg-background border-border text-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="image" className="text-sm font-medium text-foreground">
                      Project Image URL
                    </label>
                    <Input
                      id="image"
                      name="image"
                      value={project.image}
                      onChange={handleChange}
                      placeholder="https://example.com/project-image.jpg"
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Technologies Used</label>
                    <div className="flex space-x-2">
                      <Input
                        value={newTech}
                        onChange={(e) => setNewTech(e.target.value)}
                        placeholder="Add technology..."
                        className="bg-background border-border text-foreground"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTechnology())}
                      />
                      <Button type="button" onClick={addTechnology} variant="outline" className="border-border">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-teal-400/20 text-teal-400 text-sm rounded-full flex items-center space-x-1"
                        >
                          <span>{tech}</span>
                          <button
                            type="button"
                            onClick={() => removeTechnology(tech)}
                            className="text-teal-400 hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="githubUrl" className="text-sm font-medium text-foreground">
                        GitHub URL
                      </label>
                      <Input
                        id="githubUrl"
                        name="githubUrl"
                        value={project.githubUrl || ""}
                        onChange={handleChange}
                        placeholder="https://github.com/username/repo"
                        className="bg-background border-border text-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="liveUrl" className="text-sm font-medium text-foreground">
                        Live Demo URL
                      </label>
                      <Input
                        id="liveUrl"
                        name="liveUrl"
                        value={project.liveUrl || ""}
                        onChange={handleChange}
                        placeholder="https://project-demo.com"
                        className="bg-background border-border text-foreground"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Project Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium text-foreground">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={project.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                    >
                      <option value="Full-Stack">Full-Stack</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Mobile">Mobile</option>
                      <option value="Desktop">Desktop</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="order" className="text-sm font-medium text-foreground">
                      Display Order
                    </label>
                    <Input
                      id="order"
                      name="order"
                      type="number"
                      value={project.order}
                      onChange={handleChange}
                      min="1"
                      className="bg-background border-border text-foreground"
                    />
                    <p className="text-xs text-muted-foreground">Lower numbers appear first</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={project.featured}
                      onChange={handleChange}
                      className="rounded border-border"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-foreground">
                      Featured Project
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-teal-400 text-gray-900 hover:bg-teal-500"
                  >
                    {saving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    {saving ? "Creating..." : "Create Project"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  )
}
