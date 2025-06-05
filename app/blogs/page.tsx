"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { LoadingSection } from "@/components/loading-spinner"
import { Calendar, Clock, Search, ArrowRight, TrendingUp, ThumbsUp, MessageSquare, Eye } from "lucide-react"
import { FollowButton } from "@/components/follow-button"
import { useBlogPosts, useFeaturedPosts } from "@/hooks/useFirebaseData"

export default function BlogsPage() {
  const { posts: allPosts, loading: postsLoading } = useBlogPosts()
  const { posts: featuredPosts, loading: featuredLoading } = useFeaturedPosts()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [followerCount, setFollowerCount] = useState(0)

  useEffect(() => {
    const loadFollowers = async () => {
      try {
        const res = await fetch("/api/follow")
        const data = await res.json()
        if (data.count !== undefined) setFollowerCount(data.count)
      } catch {
        // ignore
      }
    }
    loadFollowers()
  }, [])

  // Extract categories from posts
  const categories = Array.from(new Set(allPosts.map((post) => post.category).filter(Boolean)))

  // Calculate blog stats
  const blogStats = {
    totalPosts: allPosts.length,
    totalViews: allPosts.reduce((sum, post) => sum + Number.parseInt(post.views?.replace(/[^\d]/g, "") || "0"), 0),
    totalLikes: allPosts.reduce((sum, post) => sum + Number.parseInt(post.likes || "0"), 0),
    totalComments: allPosts.reduce((sum, post) => sum + Number.parseInt(post.comments || "0"), 0),
    followers: followerCount,
  }

  // Filter posts based on search query and active tab
  const filteredPosts = allPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "trending") return matchesSearch && post.trending
    return matchesSearch && post.category === activeTab
  })

  // Find featured post
  const featuredPost = featuredPosts.length > 0 ? featuredPosts[0] : null

  if (postsLoading || featuredLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <LoadingSection>Loading blog posts...</LoadingSection>
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
              My <span className="text-teal-400">Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Thoughts, tutorials, and insights on web development, design, and technology
            </p>
            <div className="relative max-w-xl mx-auto">
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-10 py-6 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
            <div className="mt-6">
              <FollowButton />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-teal-400 mb-2">{blogStats.totalPosts}</div>
              <div className="text-muted-foreground">Articles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-teal-400 mb-2">
                {blogStats.totalViews.toLocaleString()}
              </div>
              <div className="text-muted-foreground">Views</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-teal-400 mb-2">{blogStats.totalLikes}</div>
              <div className="text-muted-foreground">Likes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-teal-400 mb-2">{blogStats.totalComments}</div>
              <div className="text-muted-foreground">Comments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-teal-400 mb-2">{blogStats.followers}</div>
              <div className="text-muted-foreground">Followers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10">Featured Post</h2>
            <Card className="bg-card border-border overflow-hidden">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative h-64 md:h-full">
                  <Image
                    src={featuredPost.image || "/placeholder.svg?height=400&width=600"}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-teal-400 text-gray-900 hover:bg-teal-500">{featuredPost.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{featuredPost.date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{featuredPost.readTime}</span>
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-teal-400">{featuredPost.title}</h3>
                  <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{featuredPost.views}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{featuredPost.likes}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{featuredPost.comments}</span>
                      </span>
                    </div>
                    <Link href={`/blogs/${featuredPost.slug}`}>
                      <Button className="bg-teal-400 text-gray-900 hover:bg-teal-500">
                        Read More
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

      {/* Blog Posts */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
            <h2 className="text-3xl font-bold mb-4 md:mb-0">Latest Articles</h2>
            <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="trending" className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Trending
                </TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold mb-4">No posts found</h3>
              <p className="text-muted-foreground">Try a different search term or category</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="bg-card border-border hover:border-teal-400 transition-colors">
                  <CardContent className="p-0">
                    <div className="relative h-48">
                      <Image
                        src={post.image || "/placeholder.svg?height=200&width=400"}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-teal-400 text-gray-900 hover:bg-teal-500">{post.category}</Badge>
                      </div>
                      {post.trending && (
                        <div className="absolute top-4 right-4">
                          <Badge variant="outline" className="bg-card border-teal-400 text-teal-400">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{post.date}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{post.readTime}</span>
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{post.views}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <ThumbsUp className="w-3 h-3" />
                            <span>{post.likes}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>{post.comments}</span>
                          </span>
                        </div>
                        <Link href={`/blogs/${post.slug}`}>
                          <Button variant="ghost" size="sm" className="text-teal-400 hover:text-teal-300">
                            Read More <ArrowRight className="w-3 h-3 ml-1" />
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

      {/* Newsletter Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-teal-400">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Subscribe to My Newsletter</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Get the latest articles, tutorials, and updates delivered straight to your inbox. No spam, unsubscribe
                anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input type="email" placeholder="Your email address" className="py-6 text-lg" />
                <Button className="bg-teal-400 text-gray-900 hover:bg-teal-500 text-lg px-8 py-3">Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
