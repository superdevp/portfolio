"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { LoadingSection } from "@/components/loading-spinner"
import { Search, ArrowRight, Github, ExternalLink } from "lucide-react"
import { useProjects, useFeaturedProjects } from "@/hooks/useFirebaseData"

export default function ProjectsPage() {
  const { projects: allProjects, loading: projectsLoading } = useProjects()
  const { projects: featuredProjects, loading: featuredLoading } = useFeaturedProjects()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const categories = Array.from(new Set(allProjects.map((p) => p.category).filter(Boolean)))

  const projectStats = {
    totalProjects: allProjects.length,
    featured: allProjects.filter((p) => p.featured).length,
    categories: categories.length,
    technologies: Array.from(new Set(allProjects.flatMap((p) => p.technologies))).length,
  }

  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && project.category === activeTab
  })

  const featuredProject = featuredProjects.length > 0 ? featuredProjects[0] : null

  if (projectsLoading || featuredLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <LoadingSection>Loading projects...</LoadingSection>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-cyan-500/10"></div>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              My <span className="text-teal-400">Projects</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              A collection of applications and experiments I've been working on
            </p>
            <div className="relative max-w-xl mx-auto">
              <Input
                type="text"
                placeholder="Search projects..."
                className="pl-10 py-6 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-teal-400 mb-2">{projectStats.totalProjects}</div>
              <div className="text-muted-foreground">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-teal-400 mb-2">{projectStats.featured}</div>
              <div className="text-muted-foreground">Featured</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-teal-400 mb-2">{projectStats.categories}</div>
              <div className="text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-teal-400 mb-2">{projectStats.technologies}</div>
              <div className="text-muted-foreground">Technologies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Project */}
      {featuredProject && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10">Featured Project</h2>
            <Card className="bg-card border-border overflow-hidden">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative h-64 md:h-full">
                  <Image
                    src={featuredProject.imageUrl || featuredProject.image || "/placeholder.svg?height=400&width=600"}
                    alt={featuredProject.title}
                    fill
                    className="object-cover"
                  />
                  {featuredProject.category && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-teal-400 text-gray-900 hover:bg-teal-500">{featuredProject.category}</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-4 text-teal-400">{featuredProject.title}</h3>
                  <p className="text-muted-foreground mb-6">{featuredProject.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredProject.technologies.map((tech, idx) => (
                      <span key={idx} className="px-3 py-1 bg-teal-400/20 text-teal-400 text-xs rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center space-x-4">
                    {featuredProject.githubUrl && (
                      <a href={featuredProject.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="bg-teal-400 text-gray-900 hover:bg-teal-500">
                          <Github className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                    {featuredProject.liveUrl && (
                      <a href={featuredProject.liveUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="bg-teal-400 text-gray-900 hover:bg-teal-500">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                    <Link href={`/projects/${featuredProject.id}`}>
                      <Button className="bg-teal-400 text-gray-900 hover:bg-teal-500">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Projects List */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
            <h2 className="text-3xl font-bold mb-4 md:mb-0">All Projects</h2>
            <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold mb-4">No projects found</h3>
              <p className="text-muted-foreground">Try a different search term or category</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="bg-card border-border hover:border-teal-400 transition-colors">
                  <CardContent className="p-0">
                    <div className="relative h-48">
                      <Image
                        src={project.imageUrl || project.image || "/placeholder.svg?height=200&width=400"}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                      {project.category && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-teal-400 text-gray-900 hover:bg-teal-500">{project.category}</Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.technologies.map((tech, idx) => (
                          <span key={idx} className="px-2 py-1 bg-teal-400/20 text-teal-400 text-xs rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
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
                        <Link href={`/projects/${project.id}`}>
                          <Button variant="ghost" size="sm" className="text-teal-400 hover:text-teal-300">
                            View Details <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
