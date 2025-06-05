import { collection, doc, setDoc, addDoc } from "firebase/firestore"
import { db } from "../lib/firebase"

// Initialize Firebase with your data
export async function initializeFirebaseData() {
  try {
    // Personal Info
    await setDoc(doc(db, "personalInfo", "main"), {
      name: "Ethan Yu",
      title: "Full-Stack Developer",
      bio: "I'm Ethan Yu, a dedicated full-stack developer based in San Francisco, CA. I specialize in building modern web applications that combine beautiful design with robust functionality. My journey in tech started with curiosity and has evolved into a passion for creating solutions that make a real impact.",
      location: "San Francisco, CA",
      email: "ethan@example.com",
      phone: "+1 (555) 123-4567",
      profileImage: "/placeholder.svg?height=320&width=320",
      resumeUrl: "/ethan-yu-resume.pdf",
      socialLinks: {
        github: "https://github.com/ethanyu",
        linkedin: "https://linkedin.com/in/ethanyu",
        twitter: "https://twitter.com/ethanyu",
        website: "https://ethanyu.dev",
      },
      stats: {
        yearsExperience: "5+",
        projectsCompleted: "50+",
        happyClients: "30+",
        technologies: "15+",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Blog Posts
    const blogPosts = [
      {
        slug: "what-does-it-take-to-become-a-web-developer",
        title: "What does it take to become a web developer?",
        excerpt:
          "Web development encompasses a variety of tasks and processes involved in creating websites for the internet. It involves various specialized fields, each with its own set of skills and techniques.",
        content:
          "<p>Web development, also known as website development, encompasses a variety of tasks and processes involved in creating websites for the internet...</p>",
        author: "Ethan Yu",
        date: "16.03.2023",
        readTime: "4 Min",
        views: "2.1k",
        likes: "45",
        comments: "12",
        image: "/placeholder.svg?height=400&width=800",
        category: "Career",
        trending: true,
        featured: true,
        createdAt: new Date("2023-03-16"),
        updatedAt: new Date(),
      },
      {
        slug: "modern-javascript-frameworks-comparison",
        title: "Modern JavaScript Frameworks Comparison",
        excerpt:
          "Exploring the differences between React, Vue, and Angular to help you choose the right framework for your next project...",
        content:
          "<p>Choosing the right JavaScript framework for your project can be challenging with so many options available...</p>",
        author: "Ethan Yu",
        date: "12.03.2023",
        readTime: "6 Min",
        views: "1.8k",
        likes: "38",
        comments: "8",
        image: "/placeholder.svg?height=400&width=800",
        category: "JavaScript",
        trending: false,
        featured: false,
        createdAt: new Date("2023-03-12"),
        updatedAt: new Date(),
      },
    ]

    for (const post of blogPosts) {
      await addDoc(collection(db, "blogPosts"), post)
    }

    // Projects
    const projects = [
      {
        title: "E-Commerce Platform",
        description: "A modern e-commerce solution built with React and Node.js",
        image: "/placeholder.svg?height=200&width=300",
        technologies: ["React", "Node.js", "MongoDB"],
        githubUrl: "https://github.com/ethanyu/ecommerce-platform",
        liveUrl: "https://ecommerce-demo.ethanyu.dev",
        featured: true,
        order: 1,
        category: "Full-Stack",
        createdAt: new Date(),
      },
      {
        title: "Task Management App",
        description: "Collaborative project management tool with real-time updates",
        image: "/placeholder.svg?height=200&width=300",
        technologies: ["Next.js", "TypeScript", "PostgreSQL"],
        githubUrl: "https://github.com/ethanyu/task-manager",
        liveUrl: "https://tasks.ethanyu.dev",
        featured: true,
        order: 2,
        category: "Full-Stack",
        createdAt: new Date(),
      },
    ]

    for (const project of projects) {
      await addDoc(collection(db, "projects"), project)
    }

    // Skills
    const skills = [
      {
        category: "Frontend",
        items: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js"],
        order: 1,
        color: "blue",
      },
      {
        category: "Backend",
        items: ["Node.js", "Express", "Python", "PostgreSQL", "MongoDB"],
        order: 2,
        color: "green",
      },
      {
        category: "Tools",
        items: ["Git", "Docker", "AWS", "Figma", "VS Code"],
        order: 3,
        color: "purple",
      },
      {
        category: "Soft Skills",
        items: ["Leadership", "Communication", "Problem Solving", "Team Work"],
        order: 4,
        color: "orange",
      },
    ]

    for (const skill of skills) {
      await addDoc(collection(db, "skills"), skill)
    }

    // Experience
    const experiences = [
      {
        title: "Senior Full-Stack Developer",
        company: "Tech Solutions Inc.",
        location: "San Francisco, CA",
        startDate: "2022-01-01",
        current: true,
        description:
          "Leading development of scalable web applications using React, Node.js, and cloud technologies. Mentoring junior developers and implementing best practices.",
        achievements: [
          "Led a team of 5 developers on a major e-commerce platform",
          "Improved application performance by 40%",
          "Implemented CI/CD pipelines reducing deployment time by 60%",
        ],
        order: 1,
      },
      {
        title: "Full-Stack Developer",
        company: "Digital Agency",
        location: "San Francisco, CA",
        startDate: "2020-01-01",
        endDate: "2021-12-31",
        current: false,
        description:
          "Developed and maintained multiple client projects, focusing on responsive design and performance optimization.",
        achievements: [
          "Delivered 15+ client projects on time and within budget",
          "Reduced page load times by 50% through optimization",
          "Mentored 3 junior developers",
        ],
        order: 2,
      },
    ]

    for (const experience of experiences) {
      await addDoc(collection(db, "experience"), experience)
    }

    console.log("Firebase data initialized successfully!")
  } catch (error) {
    console.error("Error initializing Firebase data:", error)
  }
}
