"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { projectsService } from "@/lib/firebase-services"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import type { Project } from "@/lib/types"

interface ProjectEditPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ProjectEditPage({ params }: ProjectEditPageProps) {
  const { id } = React.use(params);
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    technologies: "",
    githubUrl: "",
    liveUrl: "",
    imageUrl: "",
    featured: false,
    order: 0,
  })

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true)
        // Get project by ID from Firebase
        const projects = await projectsService.getAll()
        const foundProject = projects.find((p) => p.id === id)

        if (foundProject) {
          setProject(foundProject)
          setFormData({
            title: foundProject.title || "",
            description: foundProject.description || "",
            longDescription: foundProject.longDescription || "",
            technologies: Array.isArray(foundProject.technologies)
              ? foundProject.technologies.join(", ")
              : foundProject.technologies || "",
            githubUrl: foundProject.githubUrl || "",
            liveUrl: foundProject.liveUrl || "",
            imageUrl: foundProject.imageUrl || "",
            featured: foundProject.featured || false,
            order: foundProject.order || 0,
          })
        } else {
          toast({
            title: "Error",
            description: "Project not found",
            variant: "destructive",
          })
          router.push("/admin/projects")
        }
      } catch (error) {
        console.error("Error fetching project:", error)
        toast({
          title: "Error",
          description: "Failed to load project",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const updatedProject = {
        ...formData,
        technologies: formData.technologies
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean),
        order: Number(formData.order),
      }

      const success = await projectsService.update(id, updatedProject)

      if (success) {
        toast({
          title: "Success",
          description: "Project updated successfully",
        })
        router.push("/admin/projects")
      } else {
        throw new Error("Failed to update project")
      }
    } catch (error) {
      console.error("Error updating project:", error)
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-8">
        <p>Project not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Edit Project</h1>
        <Button variant="outline" onClick={() => router.push("/admin/projects")}>
          Back to Projects
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => handleInputChange("order", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longDescription">Detailed Description</Label>
              <Textarea
                id="longDescription"
                value={formData.longDescription}
                onChange={(e) => handleInputChange("longDescription", e.target.value)}
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="technologies">Technologies (comma-separated)</Label>
              <Input
                id="technologies"
                value={formData.technologies}
                onChange={(e) => handleInputChange("technologies", e.target.value)}
                placeholder="React, TypeScript, Node.js"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                  placeholder="https://github.com/username/repo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="liveUrl">Live Demo URL</Label>
                <Input
                  id="liveUrl"
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) => handleInputChange("liveUrl", e.target.value)}
                  placeholder="https://project-demo.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Project Image URL</Label>
              <Input
                id="imageUrl"
                type="text"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                placeholder="https://example.com/project-image.jpg"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange("featured", checked)}
              />
              <Label htmlFor="featured">Featured Project</Label>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? "Updating..." : "Update Project"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/projects")} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
