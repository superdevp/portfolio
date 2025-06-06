import { blogPostsService, projectsService } from "@/lib/firebase-services"
import { fallbackBlogPosts, fallbackProjects } from "@/lib/fallback-data"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ethanyu.dev"

function generateSiteMap(urls: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((url) => `  <url><loc>${url}</loc></url>`) 
    .join("\n")}\n</urlset>`
}

export async function GET() {
  let posts = []
  let projects = []
  try {
    posts = await blogPostsService.getAll()
  } catch {
    posts = []
  }
  if (posts.length === 0) posts = fallbackBlogPosts
  try {
    projects = await projectsService.getAll()
  } catch {
    projects = []
  }
  if (projects.length === 0) projects = fallbackProjects

  const staticPages = ["", "/about", "/blogs", "/projects", "/chat"]

  const urls = [
    ...staticPages.map((p) => `${BASE_URL}${p}`),
    ...posts.map((post) => `${BASE_URL}/blogs/${post.slug}`),
    ...projects.map((proj) => `${BASE_URL}/projects/${proj.id}`),
  ]

  const body = generateSiteMap(urls)

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml",
    },
  })
}
