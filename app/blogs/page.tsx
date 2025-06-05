import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Eye, Heart, MessageCircle, TrendingUp, Filter, Search } from "lucide-react"
import { Header } from "@/components/header"
import { blogPosts, featuredPost, categories, blogStats } from "@/lib/mock-data"

export default function BlogsPage() {
  // Convert the blogPosts object to an array for easier mapping
  const blogPostsArray = Object.values(blogPosts)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-cyan-500/10"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              My <span className="text-teal-400">Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Thoughts on technology, web development, and everything in between. Join me on my journey of continuous
              learning and sharing knowledge with the developer community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-teal-400 text-gray-900 hover:bg-teal-500 text-lg px-8 py-3">
                <MessageCircle className="w-5 h-5 mr-2" />
                Subscribe to Newsletter
              </Button>
              <Button
                variant="outline"
                className="border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-gray-900 text-lg px-8 py-3"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Posts
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {blogStats.map((stat, index) => {
              const IconComponent = {
                MessageCircle,
                Eye,
                User,
                Calendar,
              }[stat.icon as keyof typeof import("lucide-react")]

              return (
                <Card key={index} className="bg-card/50 border-border backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="text-teal-400 mb-2 flex justify-center">
                      {IconComponent && <IconComponent className="w-5 h-5" />}
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-muted-foreground text-sm">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Categories & Filter */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={category.active ? "default" : "outline"}
                  size="sm"
                  className={
                    category.active
                      ? "bg-teal-400 text-gray-900 hover:bg-teal-500"
                      : "border-border text-muted-foreground hover:border-teal-400 hover:text-teal-400"
                  }
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-border text-muted-foreground hover:border-teal-400 hover:text-teal-400"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 mb-8">
            <TrendingUp className="w-6 h-6 text-teal-400" />
            <h2 className="text-3xl font-bold">Featured Post</h2>
          </div>

          <Card className="bg-card border-border hover:border-teal-400 transition-all duration-300 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-auto">
                  <Image
                    src={featuredPost.image || "/placeholder.svg"}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-teal-400 text-gray-900 hover:bg-teal-500">Featured</Badge>
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center space-x-2 mb-4">
                    <Badge variant="outline" className="border-teal-400 text-teal-400">
                      {featuredPost.category}
                    </Badge>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground text-sm">{featuredPost.date}</span>
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 leading-tight">
                    {featuredPost.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{featuredPost.excerpt}</p>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{featuredPost.author}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{featuredPost.readTime}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{featuredPost.views}</span>
                      </span>
                    </div>
                  </div>

                  <Link href={`/blogs/${featuredPost.slug}`}>
                    <Button className="bg-teal-400 text-gray-900 hover:bg-teal-500 w-full lg:w-auto">
                      Read Full Article
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Latest Posts</h2>
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground">Sort by:</span>
              <Button
                variant="outline"
                size="sm"
                className="border-border text-muted-foreground hover:border-teal-400 hover:text-teal-400"
              >
                Latest
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPostsArray.map((post) => (
              <Card
                key={post.id}
                className="bg-card border-border hover:border-teal-400 transition-all duration-300 group overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      <Badge variant="outline" className="border-teal-400 text-teal-400 bg-background/80">
                        {post.category}
                      </Badge>
                      {post.trending && (
                        <Badge className="bg-orange-500 text-white">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-teal-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{post.excerpt}</p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{post.author}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{post.date}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{post.readTime}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{post.views}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{post.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{post.comments}</span>
                        </span>
                      </div>
                      <Link href={`/blogs/${post.slug}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-teal-400 hover:text-teal-300 hover:bg-teal-400/10"
                        >
                          Read More
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-gray-900 px-8 py-3"
            >
              Load More Posts
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-teal-400 max-w-4xl mx-auto">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Get the latest posts delivered right to your inbox. Join over 1,200 developers who stay up-to-date with
                my latest thoughts on web development.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-teal-400 focus:outline-none"
                />
                <Button className="bg-teal-400 text-gray-900 hover:bg-teal-500 px-8 py-3">Subscribe</Button>
              </div>

              <p className="text-muted-foreground text-sm">
                No spam, unsubscribe at any time. I respect your privacy and will never share your email.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
