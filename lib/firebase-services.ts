import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, setDoc, query, where } from "firebase/firestore"
import { db } from "./firebase"
import type { BlogPost, PersonalInfo, Project, Skill, Experience } from "./types"

// Collections
const COLLECTIONS = {
  BLOG_POSTS: "blogPosts",
  PERSONAL_INFO: "personalInfo",
  PROJECTS: "projects",
  SKILLS: "skills",
  EXPERIENCE: "experience",
  ACHIEVEMENTS: "achievements",
  INTERESTS: "interests",
  FOLLOWERS: "followers",
}

// Blog Posts Services
export const blogPostsService = {
  // Get all blog posts
  async getAll(): Promise<BlogPost[]> {
    try {
      const q = query(collection(db, COLLECTIONS.BLOG_POSTS))
      const querySnapshot = await getDocs(q)
      const posts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BlogPost[]

      // Sort by date on the client side
      return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      return []
    }
  },

  // Get blog post by slug
  async getBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const q = query(collection(db, COLLECTIONS.BLOG_POSTS), where("slug", "==", slug))
      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty) return null

      const doc = querySnapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data(),
      } as BlogPost
    } catch (error) {
      console.error("Error fetching blog post:", error)
      return null
    }
  },

  // Get featured posts
  async getFeatured(): Promise<BlogPost[]> {
    try {
      // Get all posts and filter on client side to avoid composite index
      const q = query(collection(db, COLLECTIONS.BLOG_POSTS))
      const querySnapshot = await getDocs(q)
      const posts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BlogPost[]

      // Filter featured posts and sort by date on client side
      return posts
        .filter((post) => post.featured)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } catch (error) {
      console.error("Error fetching featured posts:", error)
      return []
    }
  },

  // Get recent posts
  async getRecent(limitCount = 2): Promise<BlogPost[]> {
    try {
      const q = query(collection(db, COLLECTIONS.BLOG_POSTS))
      const querySnapshot = await getDocs(q)
      const posts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BlogPost[]

      // Sort by date and limit on client side
      return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limitCount)
    } catch (error) {
      console.error("Error fetching recent posts:", error)
      return []
    }
  },

  // Add new blog post
  async add(post: Omit<BlogPost, "id">): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.BLOG_POSTS), post)
      return docRef.id
    } catch (error) {
      console.error("Error adding blog post:", error)
      return null
    }
  },

  // Update blog post
  async update(id: string, post: Partial<BlogPost>): Promise<boolean> {
    try {
      await updateDoc(doc(db, COLLECTIONS.BLOG_POSTS, id), post)
      return true
    } catch (error) {
      console.error("Error updating blog post:", error)
      return false
    }
  },

  // Delete blog post
  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.BLOG_POSTS, id))
      return true
    } catch (error) {
      console.error("Error deleting blog post:", error)
      return false
    }
  },
}

// Personal Info Services
export const personalInfoService = {
  // Get personal info
  async get(): Promise<PersonalInfo | null> {
    try {
      const docRef = doc(db, COLLECTIONS.PERSONAL_INFO, "main")
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as PersonalInfo
      }
      return null
    } catch (error) {
      console.error("Error fetching personal info:", error)
      return null
    }
  },

  // Update personal info
  async update(info: Partial<PersonalInfo>): Promise<boolean> {
    try {
      await updateDoc(doc(db, COLLECTIONS.PERSONAL_INFO, "main"), info)
      return true
    } catch (error) {
      console.error("Error updating personal info:", error)
      return false
    }
  },
}

// Projects Services
export const projectsService = {
  // Get all projects
  async getAll(): Promise<Project[]> {
    try {
      const q = query(collection(db, COLLECTIONS.PROJECTS))
      const querySnapshot = await getDocs(q)
      const projects = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[]

      // Sort by order on client side
      return projects.sort((a, b) => (a.order || 0) - (b.order || 0))
    } catch (error) {
      console.error("Error fetching projects:", error)
      return []
    }
  },

  // Get featured projects
  async getFeatured(): Promise<Project[]> {
    try {
      // Get all projects and filter on client side to avoid composite index
      const q = query(collection(db, COLLECTIONS.PROJECTS))
      const querySnapshot = await getDocs(q)
      const projects = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[]

      // Filter featured projects and sort by order on client side
      return projects.filter((project) => project.featured).sort((a, b) => (a.order || 0) - (b.order || 0))
    } catch (error) {
      console.error("Error fetching featured projects:", error)
      return []
    }
  },

  // Add new project
  async add(project: Omit<Project, "id">): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.PROJECTS), project)
      return docRef.id
    } catch (error) {
      console.error("Error adding project:", error)
      return null
    }
  },

  // Update project
  async update(id: string, project: Partial<Project>): Promise<boolean> {
    try {
      await updateDoc(doc(db, COLLECTIONS.PROJECTS, id), project)
      return true
    } catch (error) {
      console.error("Error updating project:", error)
      return false
    }
  },

  // Delete project
  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.PROJECTS, id))
      return true
    } catch (error) {
      console.error("Error deleting project:", error)
      return false
    }
  },
}

// Skills Services
export const skillsService = {
  // Get all skills grouped by category
  async getAll(): Promise<Skill[]> {
    try {
      const q = query(collection(db, COLLECTIONS.SKILLS))
      const querySnapshot = await getDocs(q)
      const skills = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Skill[]

      // Sort by order on client side
      return skills.sort((a, b) => (a.order || 0) - (b.order || 0))
    } catch (error) {
      console.error("Error fetching skills:", error)
      return []
    }
  },

  async add(skill: Omit<Skill, "id">): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.SKILLS), skill)
      return docRef.id
    } catch (error) {
      console.error("Error adding skill:", error)
      return null
    }
  },

  async update(id: string, skill: Partial<Skill>): Promise<boolean> {
    try {
      await updateDoc(doc(db, COLLECTIONS.SKILLS, id), skill)
      return true
    } catch (error) {
      console.error("Error updating skill:", error)
      return false
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.SKILLS, id))
      return true
    } catch (error) {
      console.error("Error deleting skill:", error)
      return false
    }
  },
}

// Experience Services
export const experienceService = {
  // Get all experience
  async getAll(): Promise<Experience[]> {
    try {
      const q = query(collection(db, COLLECTIONS.EXPERIENCE))
      const querySnapshot = await getDocs(q)
      const experiences = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Experience[]

      // Sort by order if present
      return experiences.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    } catch (error) {
      console.error("Error fetching experience:", error)
      return []
    }
  },

  async add(experience: Omit<Experience, "id">): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.EXPERIENCE), experience)
      return docRef.id
    } catch (error) {
      console.error("Error adding experience:", error)
      return null
    }
  },

  async update(id: string, experience: Partial<Experience>): Promise<boolean> {
    try {
      await updateDoc(doc(db, COLLECTIONS.EXPERIENCE, id), experience)
      return true
    } catch (error) {
      console.error("Error updating experience:", error)
      return false
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.EXPERIENCE, id))
      return true
    } catch (error) {
      console.error("Error deleting experience:", error)
      return false
    }
  },
}

// Generic service for achievements and interests
export const genericService = {
  async getCollection(collectionName: string): Promise<any[]> {
    try {
      const q = query(collection(db, collectionName))
      const querySnapshot = await getDocs(q)
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      // Sort by order on client side if order field exists
      return items.sort((a, b) => ((a as any).order || 0) - ((b as any).order || 0))
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error)
      return []
    }
  },
}

// Achievements Services
export const achievementsService = {
  async getAll(): Promise<any[]> {
    try {
      const q = query(collection(db, COLLECTIONS.ACHIEVEMENTS))
      const querySnapshot = await getDocs(q)
      const achievements = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      return achievements.sort((a, b) => ((a as any).order || 0) - ((b as any).order || 0))
    } catch (error) {
      console.error("Error fetching achievements:", error)
      return []
    }
  },

  async add(achievement: any): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.ACHIEVEMENTS), achievement)
      return docRef.id
    } catch (error) {
      console.error("Error adding achievement:", error)
      return null
    }
  },

  async update(id: string, achievement: any): Promise<boolean> {
    try {
      await updateDoc(doc(db, COLLECTIONS.ACHIEVEMENTS, id), achievement)
      return true
    } catch (error) {
      console.error("Error updating achievement:", error)
      return false
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.ACHIEVEMENTS, id))
      return true
    } catch (error) {
      console.error("Error deleting achievement:", error)
      return false
    }
  },
}

// Interests Services
export const interestsService = {
  async getAll(): Promise<any[]> {
    try {
      const q = query(collection(db, COLLECTIONS.INTERESTS))
      const querySnapshot = await getDocs(q)
      const interests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      return interests.sort((a, b) => ((a as any).order || 0) - ((b as any).order || 0))
    } catch (error) {
      console.error("Error fetching interests:", error)
      return []
    }
  },

  async add(interest: any): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.INTERESTS), interest)
      return docRef.id
    } catch (error) {
      console.error("Error adding interest:", error)
      return null
    }
  },

  async update(id: string, interest: any): Promise<boolean> {
    try {
      await updateDoc(doc(db, COLLECTIONS.INTERESTS, id), interest)
      return true
    } catch (error) {
      console.error("Error updating interest:", error)
      return false
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.INTERESTS, id))
      return true
    } catch (error) {
      console.error("Error deleting interest:", error)
      return false
    }
  },
}

// Followers Service
export async function followBlog(userId: string): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.FOLLOWERS, userId), {
      userId,
      followedAt: new Date(),
    })
  } catch (error) {
    console.error("Error recording follower:", error)
    throw error
  }
}

export async function unfollowBlog(userId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.FOLLOWERS, userId))
  } catch (error) {
    console.error("Error removing follower:", error)
    throw error
  }
}

export async function getFollowerCount(): Promise<number> {
  try {
    const snapshot = await getDocs(collection(db, COLLECTIONS.FOLLOWERS))
    return snapshot.size
  } catch (error) {
    console.error("Error fetching followers:", error)
    return 0
  }
}

export async function isFollowing(userId: string): Promise<boolean> {
  try {
    const docSnap = await getDoc(doc(db, COLLECTIONS.FOLLOWERS, userId))
    return docSnap.exists()
  } catch (error) {
    console.error("Error checking follower:", error)
    return false
  }
}
