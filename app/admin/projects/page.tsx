"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/loading-spinner"
import { projectsService } from "@/lib/firebase-services"
import { Plus, Search, Edit, Trash2, ExternalLink, Github, Star } from "lucide-react"
import type { Project } from "@/lib/types"

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const data = await projectsService.getAll()
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    setDeleting(id)
    try {
      const success = await projectsService.delete(id)
      if (success) {
        setProjects(projects.filter((project) => project.id !== id))
      } else {
        alert("Failed to delete project")
      }
    } catch (error) {
      console.error("Error deleting project:", error)
      alert("Error deleting project")
    } finally {
      setDeleting(null)
    }
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <ProtectedRoute>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground">Manage your portfolio projects and showcase work.</p>
          </div>
          <Link href="/admin/projects/new">
            <Button className="bg-teal-400 text-gray-900 hover:bg-teal-500">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </Link>
        </div>

        <Card className="bg-card border-border mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search projects by title, category, or technology..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border"
                />
              </div>
              <Button
                onClick={fetchProjects}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.length === 0 ? (
              <div className="col-span-full">
                <Card className="bg-card border-border">
                  <CardContent className="p-12 text-center">
                    <div className="text-muted-foreground">
                      <p className="text-lg mb-4">No projects found</p>
                      <p className="mb-6">Create your first project to get started.</p>
                      <Link href="/admin/projects/new">
                        <Button className="bg-teal-400 text-gray-900 hover:bg-teal-500">
                          <Plus className="w-4 h-4 mr-2" />
                          Create First Project
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <Card key={project.id} className="bg-card border-border hover:border-teal-400 transition-colors">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={project.imageUrl || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {project.featured && (
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-1 bg-teal-400 text-gray-900 text-xs rounded-full flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Link href={`/admin/projects/edit/${project.id}`}>
                          <Button variant="ghost" size="sm" className="bg-black/50 text-white hover:bg-black/70">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => project.id && handleDelete(project.id)}
                          disabled={deleting === project.id}
                          className="bg-black/50 text-white hover:bg-red-500/70"
                        >
                          {deleting === project.id ? <LoadingSpinner size="sm" /> : <Trash2 className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                        {project.category && (
                          <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                            {project.category}
                          </span>
                        )}
                      </div>

                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.technologies.map((tech, index) => (
                          <span key={index} className="px-2 py-1 bg-teal-400/20 text-teal-400 text-xs rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center space-x-2">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                              <Github className="w-4 h-4" />
                            </Button>
                          </a>
                        )}
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </a>
                        )}
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
