import type { BlogPost, PersonalInfo, Project } from "./types"

// Fallback data in case Firebase is not available
export const fallbackPersonalInfo: PersonalInfo = {
  name: "Kei Nishikori",
  title: "Full-Stack Developer",
  bio: "I'm Kei Nishikori, a dedicated full-stack developer based in San Francisco, CA. I specialize in building modern web applications that combine beautiful design with robust functionality.",
  location: "San Francisco, CA",
  email: "kei@asvinfomedia.com",
  phone: "+1 (555) 123-4567",
  profileImage: "/placeholder.svg?height=320&width=320",
  resumeUrl: "/resume.pdf",
  socialLinks: {
    github: "https://github.com/superdevp",
    linkedin: "https://linkedin.com/in/superdevp",
    twitter: "https://twitter.com/superdevp",
    website: "https://webu.life",
    telegram: "https://t.me/superdevp",
  },
  stats: {
    yearsExperience: "5+",
    projectsCompleted: "50+",
    happyClients: "30+",
    technologies: "15+",
  },
}

export const fallbackProjects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description: "A modern e-commerce solution built with React and Node.js",
    image: "/placeholder.svg?height=200&width=300",
    technologies: ["React", "Node.js", "MongoDB"],
    githubUrl: "https://github.com/superdevp",
    liveUrl: "",
    featured: true,
    order: 1,
    category: "Full-Stack",
  }
]

export const fallbackBlogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "what-does-it-take-to-become-a-web-developer",
    title: "What does it take to become a web developer?",
    excerpt:
      "Web development encompasses a variety of tasks and processes involved in creating websites for the internet.",
    content: "<p>Web development content...</p>",
    author: "Kei Nishikori",
    date: "16.03.2023",
    readTime: "4 Min",
    views: "2.1k",
    likes: "45",
    comments: "12",
    image: "/placeholder.svg?height=400&width=800",
    category: "Career",
    trending: true,
    featured: true,
  },
  {
    id: "2",
    slug: "modern-javascript-frameworks-comparison",
    title: "Modern JavaScript Frameworks Comparison",
    excerpt: "Exploring the differences between React, Vue, and Angular to help you choose the right framework.",
    content: "<p>Framework comparison content...</p>",
    author: "Kei Nishikori",
    date: "12.03.2023",
    readTime: "6 Min",
    views: "1.8k",
    likes: "38",
    comments: "8",
    image: "/placeholder.svg?height=400&width=800",
    category: "JavaScript",
    trending: false,
    featured: false,
  },
]
