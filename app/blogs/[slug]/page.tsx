'use client';

import React from 'react';
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, ArrowLeft } from "lucide-react"
import { FollowButton } from "@/components/follow-button"
import { Header } from "@/components/header"
import { notFound } from "next/navigation"
import { useBlogPost, useBlogPosts } from "@/hooks/useFirebaseData"
import { LoadingSection } from "@/components/loading-spinner"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = React.use(params);
  const { post: post, loading: loadingPost } = useBlogPost(slug);
  const { posts: posts, loading: loadingPosts } = useBlogPosts();

  if (!post && (!loadingPost || !loadingPosts)) {
    notFound()
  }

  if (loadingPost || loadingPosts) {
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

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/blogs" className="inline-flex items-center space-x-2 text-teal-400 hover:text-teal-300 mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blogs</span>
          </Link>
          <div className="mb-8 text-right">
            <FollowButton />
          </div>

          {/* Article Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-6">{post?.title}</h1>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-8">
              <span className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{post?.author}</span>
              </span>
              <span className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{post?.date}</span>
              </span>
              <span className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{post?.readTime}</span>
              </span>
            </div>
            <Image
              src={post?.image || "/placeholder.svg"}
              alt={post?.title || 'Blog Post'}
              width={800}
              height={400}
              className="w-full rounded-lg"
            />
          </div>

          {/* Article Content */}
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <div
                className="prose prose-invert prose-teal max-w-none"
                dangerouslySetInnerHTML={{ __html: post?.content || "Blog Content" }}
                style={{
                  color: "var(--foreground)",
                }}
              />
            </CardContent>
          </Card>

          {/* Related Posts */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-8">Related Posts</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(posts)
                .filter(([_, post]) => post.slug !== slug)
                .slice(0, 2)
                .map(([key, relatedPost]) => (
                  <Card key={key} className="bg-card border-border hover:border-teal-400 transition-colors">
                    <CardContent className="p-6">
                      <Image
                        src={relatedPost.image || "/placeholder.svg"}
                        alt={relatedPost.title}
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                      <h4 className="text-teal-400 font-semibold mb-2 line-clamp-2">{relatedPost.title}</h4>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-4">
                        <span>{relatedPost.date}</span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                      <Link href={`/blogs/${relatedPost.slug}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-gray-900"
                        >
                          Read More
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
