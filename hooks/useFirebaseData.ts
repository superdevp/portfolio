"use client"

import { useState, useEffect } from "react"
import {
  blogPostsService,
  personalInfoService,
  projectsService,
  skillsService,
  experienceService,
  achievementsService,
  interestsService,
} from "@/lib/firebase-services"
import { fallbackPersonalInfo, fallbackProjects, fallbackBlogPosts } from "@/lib/fallback-data"
import type { BlogPost, PersonalInfo, Project, Skill, Experience } from "@/lib/types"

// Hook for blog posts
export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await blogPostsService.getAll()
      if (data.length > 0) {
        setPosts(data)
        setUsingFallback(false)
      } else {
        // Use fallback data if no posts found
        setPosts(fallbackBlogPosts)
        setUsingFallback(true)
      }
    } catch (err) {
      console.error("Firebase error, using fallback data:", err)
      setPosts(fallbackBlogPosts)
      setUsingFallback(true)
      setError("Using offline data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return { posts, loading, error, usingFallback, refetch: fetchPosts }
}

// Hook for a single blog post
export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  const fetchPost = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await blogPostsService.getBySlug(slug)
      if (data) {
        setPost(data)
        setUsingFallback(false)
      } else {
        // Try fallback data
        const fallbackPost = fallbackBlogPosts.find((p) => p.slug === slug)
        setPost(fallbackPost || null)
        setUsingFallback(!!fallbackPost)
      }
    } catch (err) {
      console.error("Firebase error, using fallback data:", err)
      const fallbackPost = fallbackBlogPosts.find((p) => p.slug === slug)
      setPost(fallbackPost || null)
      setUsingFallback(!!fallbackPost)
      setError("Using offline data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  return { post, loading, error, usingFallback }
}

// Hook for featured blog posts
export function useFeaturedPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await blogPostsService.getFeatured()
      if (data.length > 0) {
        setPosts(data)
        setUsingFallback(false)
      } else {
        const fallbackFeatured = fallbackBlogPosts.filter((p) => p.featured)
        setPosts(fallbackFeatured)
        setUsingFallback(true)
      }
    } catch (err) {
      console.error("Firebase error, using fallback data:", err)
      const fallbackFeatured = fallbackBlogPosts.filter((p) => p.featured)
      setPosts(fallbackFeatured)
      setUsingFallback(true)
      setError("Using offline data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return { posts, loading, error, usingFallback }
}

// Hook for recent blog posts
export function useRecentPosts(limit = 2) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await blogPostsService.getRecent(limit)
      if (data.length > 0) {
        setPosts(data)
        setUsingFallback(false)
      } else {
        const fallbackRecent = fallbackBlogPosts.slice(0, limit)
        setPosts(fallbackRecent)
        setUsingFallback(true)
      }
    } catch (err) {
      console.error("Firebase error, using fallback data:", err)
      const fallbackRecent = fallbackBlogPosts.slice(0, limit)
      setPosts(fallbackRecent)
      setUsingFallback(true)
      setError("Using offline data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [limit])

  return { posts, loading, error, usingFallback }
}

// Hook for personal info
export function usePersonalInfo() {
  const [info, setInfo] = useState<PersonalInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  const fetchInfo = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await personalInfoService.get()
      if (data) {
        setInfo(data)
        setUsingFallback(false)
      } else {
        setInfo(fallbackPersonalInfo)
        setUsingFallback(true)
      }
    } catch (err) {
      console.error("Firebase error, using fallback data:", err)
      setInfo(fallbackPersonalInfo)
      setUsingFallback(true)
      setError("Using offline data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInfo()
  }, [])

  return { info, loading, error, usingFallback }
}

// Hook for projects
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await projectsService.getAll()
      if (data.length > 0) {
        setProjects(data)
        setUsingFallback(false)
      } else {
        setProjects(fallbackProjects)
        setUsingFallback(true)
      }
    } catch (err) {
      console.error("Firebase error, using fallback data:", err)
      setProjects(fallbackProjects)
      setUsingFallback(true)
      setError("Using offline data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return { projects, loading, error, usingFallback }
}

// Hook for featured projects
export function useFeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await projectsService.getFeatured()
      if (data.length > 0) {
        setProjects(data)
        setUsingFallback(false)
      } else {
        const fallbackFeatured = fallbackProjects.filter((p) => p.featured)
        setProjects(fallbackFeatured)
        setUsingFallback(true)
      }
    } catch (err) {
      console.error("Firebase error, using fallback data:", err)
      const fallbackFeatured = fallbackProjects.filter((p) => p.featured)
      setProjects(fallbackFeatured)
      setUsingFallback(true)
      setError("Using offline data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return { projects, loading, error, usingFallback }
}

// Hook for skills
export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  const fetchSkills = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await skillsService.getAll()
      setSkills(data)
      setUsingFallback(data.length === 0)
    } catch (err) {
      console.error("Firebase error:", err)
      setSkills([])
      setUsingFallback(true)
      setError("Failed to load skills")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  return { skills, loading, error, usingFallback }
}

// Hook for experience
export function useExperience() {
  const [experience, setExperience] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  const fetchExperience = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await experienceService.getAll()
      setExperience(data)
      setUsingFallback(data.length === 0)
    } catch (err) {
      console.error("Firebase error:", err)
      setExperience([])
      setUsingFallback(true)
      setError("Failed to load experience")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExperience()
  }, [])

  return { experience, loading, error, usingFallback }
}

// Hook for achievements
export function useAchievements() {
  const [achievements, setAchievements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAchievements = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await achievementsService.getAll()
      setAchievements(data)
    } catch (err) {
      console.error("Firebase error:", err)
      setError("Failed to load achievements")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAchievements()
  }, [])

  return { achievements, loading, error, refetch: fetchAchievements }
}

// Hook for interests
export function useInterests() {
  const [interests, setInterests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInterests = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await interestsService.getAll()
      setInterests(data)
    } catch (err) {
      console.error("Firebase error:", err)
      setError("Failed to load interests")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInterests()
  }, [])

  return { interests, loading, error, refetch: fetchInterests }
}
