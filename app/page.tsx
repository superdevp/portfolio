'use client';

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { LoadingSection, LoadingCard } from "@/components/loading-spinner"
import { ArrowRight, Code, Palette, Database, Globe, Github, ExternalLink, Calendar, Clock } from "lucide-react"
import { usePersonalInfo, useRecentPosts, useFeaturedProjects } from "@/hooks/useFirebaseData"

function HomePageContent() {
  const { info: personalInfo, loading: infoLoading } = usePersonalInfo()
  const { posts: recentPosts, loading: postsLoading } = useRecentPosts(2)
  const { projects: featuredProjects, loading: projectsLoading } = useFeaturedProjects()

  const services = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Frontend Development",
      description:
        "Creating responsive and interactive user interfaces with React, Next.js, and modern CSS frameworks.",
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Backend Development",
      description: "Building robust server-side applications with Node.js, Express, and database management.",
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "UI/UX Design",
      description: "Designing beautiful and user-friendly interfaces that provide excellent user experiences.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Full-Stack Solutions",
      description: "End-to-end web application development from concept to deployment and maintenance.",
    },
  ]

  if (infoLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <LoadingSection>Loading your portfolio...</LoadingSection>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-cyan-500/10"></div>
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-teal-400 font-medium">👋 Hello, I'm</p>
                <h1 className="text-5xl lg:text-7xl font-bold">
                  {personalInfo?.name.split(" ")[0]}{" "}
                  <span className="text-teal-400">{personalInfo?.name.split(" ")[1]}</span>
                </h1>
                <h2 className="text-2xl lg:text-3xl text-muted-foreground">{personalInfo?.title}</h2>
                <p className="text-lg text-muted-foreground max-w-lg">{personalInfo?.bio}</p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button className="bg-teal-400 text-gray-900 hover:bg-teal-500 text-lg px-8 py-3">
                  Let's Work Together
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  className="border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-gray-900 text-lg px-8 py-3"
                >
                  View My Work
                </Button>
              </div>

              <div className="flex items-center space-x-6">
                {personalInfo?.socialLinks?.github && (
                  <a href={personalInfo.socialLinks.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-6 h-6 text-muted-foreground hover:text-teal-400 cursor-pointer transition-colors" />
                  </a>
                )}
                <div className="w-6 h-6 text-muted-foreground hover:text-teal-400 cursor-pointer transition-colors">
                  💼
                </div>
                <div className="w-6 h-6 text-muted-foreground hover:text-teal-400 cursor-pointer transition-colors">
                  📧
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative w-80 h-80 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full blur-3xl opacity-20"></div>
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-teal-400 shadow-2xl">
                  <Image
                    src={personalInfo?.profileImage || "/placeholder.svg?height=320&width=320"}
                    alt={`${personalInfo?.name} - ${personalInfo?.title}`}
                    width={320}
                    height={320}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-4 -right-4 bg-card rounded-lg p-4 border border-border shadow-lg">
                  <div className="text-sm space-y-1">
                    <div className="text-teal-400 font-semibold">{personalInfo?.stats.yearsExperience}</div>
                    <div className="text-muted-foreground">Experience</div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-card rounded-lg p-4 border border-border shadow-lg">
                  <div className="text-sm space-y-1">
                    <div className="text-teal-400 font-semibold">{personalInfo?.stats.projectsCompleted}</div>
                    <div className="text-muted-foreground">Projects</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {personalInfo?.stats &&
              Object.entries(personalInfo.stats).map(([key, value], index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-teal-400 mb-2">{value}</div>
                  <div className="text-muted-foreground">
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What I Do</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              I provide comprehensive web development services to help bring your ideas to life
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="bg-card border-border hover:border-teal-400 transition-all duration-300 hover:transform hover:scale-105"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-teal-400 mb-4 flex justify-center">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
              <p className="text-muted-foreground text-lg">Some of my recent work</p>
            </div>
            <Button variant="outline" className="border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-gray-900">
              View All Projects
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {projectsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                <Card
                  key={index}
                  className="bg-card border-border hover:border-teal-400 transition-all duration-300 group"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <Image
                        src={project.imageUrl || "/placeholder.svg"}
                        alt={project.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" className="bg-teal-400 text-gray-900 hover:bg-teal-500">
                              <Github className="w-4 h-4" />
                            </Button>
                          </a>
                        )}
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" className="bg-teal-400 text-gray-900 hover:bg-teal-500">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="px-3 py-1 bg-teal-400/20 text-teal-400 text-xs rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Technical Skills</h2>
            <p className="text-muted-foreground text-lg">Technologies I work with</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {[
              { name: "HTML", icon: "📄", color: "orange" },
              { name: "CSS", icon: "🎨", color: "blue" },
              { name: "JavaScript", icon: "⚡", color: "yellow" },
              { name: "React", icon: "⚛️", color: "cyan" },
              { name: "Node.js", icon: "🟢", color: "green" },
              { name: "TypeScript", icon: "📘", color: "blue" },
              { name: "MongoDB", icon: "🍃", color: "green" },
              { name: "Git", icon: "📚", color: "orange" },
            ].map((skill, index) => (
              <Card
                key={index}
                className="bg-card border-border hover:border-teal-400 transition-all duration-300 hover:transform hover:scale-105"
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{skill.icon}</div>
                  <div className="text-teal-400 font-semibold text-sm">{skill.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Blogs */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl font-bold mb-4">Latest Blog Posts</h2>
              <p className="text-muted-foreground text-lg">Thoughts on technology and development</p>
            </div>
            <Link href="/blogs">
              <Button variant="outline" className="border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-gray-900">
                View All Posts
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {postsLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {recentPosts.map((blog, index) => (
                <Card key={index} className="bg-card border-border hover:border-teal-400 transition-colors">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-teal-400 mb-3">{blog.title}</h3>
                    <p className="text-muted-foreground mb-4">{blog.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{blog.date}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{blog.readTime}</span>
                        </span>
                      </div>
                      <Link href={`/blogs/${blog.slug}`}>
                        <Button variant="ghost" size="sm" className="text-teal-400 hover:text-teal-300">
                          Read More <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-teal-400">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold mb-4">Ready to Start Your Project?</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Let's work together to bring your ideas to life. I'm always excited to take on new challenges and create
                something amazing.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/chat">
                  <Button className="bg-teal-400 text-gray-900 hover:bg-teal-500 text-lg px-8 py-3">
                    Get In Touch
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="outline"
                    className="border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-gray-900 text-lg px-8 py-3"
                  >
                    Learn More About Me
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default function HomePage() {
  return <HomePageContent />
}
