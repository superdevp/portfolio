export interface BlogPost {
  id?: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  readTime: string
  views: string
  likes: string
  comments: string
  image: string
  category: string
  trending: boolean
  featured: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface PersonalInfo {
  id?: string
  name: string
  title: string
  bio: string
  location: string
  email: string
  phone?: string
  profileImage: string
  resumeUrl?: string
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    website?: string,
    telegram?: string
  }
  stats: {
    yearsExperience: string
    projectsCompleted: string
    happyClients: string
    technologies: string
  }
  createdAt?: Date
  updatedAt?: Date
}

export interface Project {
  id?: string
  title: string
  description: string
  image: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  featured: boolean
  order: number
  category?: string
  createdAt?: Date
  longDescription?: string
  imageUrl?: string
}

export interface Skill {
  id?: string
  category: string
  items: string[]
  order: number
  color?: string
}

export interface Experience {
  id?: string
  title: string
  company: string
  location: string
  period: string
  current: boolean
  description: string
  achievements: string[]
  order?: number
}

export interface Achievement {
  id?: string
  title: string
  year: string
  icon: string
  order: number
}

export interface Interest {
  id?: string
  title: string
  description: string
  icon: string
  order: number
}

export interface FeaturedPost {
  slug: string
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
  views: string
  likes: string
  comments: string
  image: string
  category: string
  featured: boolean
}

export interface Category {
  name: string
  count: number
  active: boolean
}

export interface Stat {
  label: string
  value: string
  icon: string
}
