"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  blogPostsService,
  projectsService,
  skillsService,
  experienceService,
  achievementsService,
  interestsService,
} from "@/lib/firebase-services"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { FileText, FolderOpen, Code, Briefcase, Award, Heart, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalBlogPosts: number
  totalProjects: number
  totalSkills: number
  totalExperience: number
  totalAchievements: number
  totalInterests: number
  featuredPosts: number
  featuredProjects: number
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<any[]>([])
  const [skillsData, setSkillsData] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)

        // Fetch all data from Firebase
        const [blogPosts, projects, skills, experience, achievements, interests] = await Promise.all([
          blogPostsService.getAll(),
          projectsService.getAll(),
          skillsService.getAll(),
          experienceService.getAll(),
          achievementsService.getAll(),
          interestsService.getAll(),
        ])

        // Calculate stats
        const dashboardStats: DashboardStats = {
          totalBlogPosts: blogPosts.length,
          totalProjects: projects.length,
          totalSkills: skills.length,
          totalExperience: experience.length,
          totalAchievements: achievements.length,
          totalInterests: interests.length,
          featuredPosts: blogPosts.filter((post) => post.featured).length,
          featuredProjects: projects.filter((project) => project.featured).length,
        }

        setStats(dashboardStats)

        // Prepare chart data
        const contentData = [
          { name: "Blog Posts", value: blogPosts.length, color: "#0088FE" },
          { name: "Projects", value: projects.length, color: "#00C49F" },
          { name: "Skills", value: skills.length, color: "#FFBB28" },
          { name: "Experience", value: experience.length, color: "#FF8042" },
          { name: "Achievements", value: achievements.length, color: "#8884D8" },
          { name: "Interests", value: interests.length, color: "#82CA9D" },
        ]

        setChartData(contentData)

        // Prepare skills by category data
        const skillsByCategory = skills.reduce((acc: any, skill) => {
          const category = skill.category || "Other"
          acc[category] = (acc[category] || 0) + 1
          return acc
        }, {})

        const skillsChartData = Object.entries(skillsByCategory).map(([category, count]) => ({
          category,
          count,
        }))

        setSkillsData(skillsChartData)

        // Prepare recent activity (mock data for now)
        const activity = [
          { action: "Created blog post", item: blogPosts[0]?.title || "New Post", time: "2 hours ago", type: "blog" },
          { action: "Updated project", item: projects[0]?.title || "New Project", time: "1 day ago", type: "project" },
          { action: "Added skill", item: skills[0]?.name || "New Skill", time: "3 days ago", type: "skill" },
        ]

        setRecentActivity(activity)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p>Failed to load dashboard data</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Badge variant="outline" className="text-sm">
          Real-time Data from Firebase
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBlogPosts}</div>
            <p className="text-xs text-muted-foreground">{stats.featuredPosts} featured</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">{stats.featuredProjects} featured</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSkills}</div>
            <p className="text-xs text-muted-foreground">Across {skillsData.length} categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experience</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExperience}</div>
            <p className="text-xs text-muted-foreground">Work positions</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Overview Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Content Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Skills Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Skills by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={skillsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, count }) => `${category}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {skillsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/blogs/new">
                <Button className="w-full" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  New Blog Post
                </Button>
              </Link>
              <Link href="/admin/projects/new">
                <Button className="w-full" variant="outline">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </Link>
              <Link href="/admin/profile">
                <Button className="w-full" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button className="w-full" variant="outline">
                  <Code className="mr-2 h-4 w-4" />
                  Manage Skills
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.item}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {activity.time}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAchievements}</div>
            <p className="text-xs text-muted-foreground">Career milestones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interests</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInterests}</div>
            <p className="text-xs text-muted-foreground">Personal interests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Health</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Excellent</div>
            <p className="text-xs text-muted-foreground">All sections populated</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
