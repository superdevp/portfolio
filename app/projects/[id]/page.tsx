"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { LoadingSection } from "@/components/loading-spinner"
import { ArrowLeft, Github, ExternalLink } from "lucide-react"
import { useProjects } from "@/hooks/useFirebaseData"
import { notFound } from "next/navigation"

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { id } = React.use(params)
  const { projects, loading } = useProjects()

  const project = projects.find((p) => p.id === id)

  if (!project && !loading) {
    notFound()
  }

  if (loading || !project) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <LoadingSection>Loading project...</LoadingSection>
      </div>
    )
  }

  const relatedProjects = projects.filter((p) => p.id !== id).slice(0, 2)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/projects" className="inline-flex items-center space-x-2 text-teal-400 hover:text-teal-300 mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Link>

          {/* Project Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-6">{project.title}</h1>
            <Image
              src={project.imageUrl || project.image || "/placeholder.svg"}
              alt={project.title}
              width={800}
              height={400}
              className="w-full rounded-lg"
            />
          </div>

          {/* Project Content */}
          <Card className="bg-card border-border">
            <CardContent className="p-8 space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                {project.longDescription || project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, idx) => (
                  <span key={idx} className="px-3 py-1 bg-teal-400/20 text-teal-400 text-xs rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-gray-900">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </Button>
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-gray-900">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </Button>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-8">Related Projects</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedProjects.map((rp) => (
                  <Card key={rp.id} className="bg-card border-border hover:border-teal-400 transition-colors">
                    <CardContent className="p-6">
                      <Image
                        src={rp.imageUrl || rp.image || "/placeholder.svg"}
                        alt={rp.title}
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                      <h4 className="text-teal-400 font-semibold mb-2 line-clamp-2">{rp.title}</h4>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {rp.technologies.map((tech, idx) => (
                          <span key={idx} className="px-2 py-1 bg-teal-400/20 text-teal-400 text-xs rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <Link href={`/projects/${rp.id}`}>
                        <Button variant="outline" size="sm" className="border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-gray-900">
                          View Details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
