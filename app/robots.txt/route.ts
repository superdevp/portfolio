const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ethanyu.dev"

export async function GET() {
  const body = `User-agent: *\nAllow: /\nSitemap: ${BASE_URL}/sitemap.xml`
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
