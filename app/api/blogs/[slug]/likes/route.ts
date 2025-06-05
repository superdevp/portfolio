import { NextRequest, NextResponse } from "next/server"
import { blogPostsService } from "@/lib/firebase-services"

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { userId } = await req.json()
    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 })
    }
    const result = await blogPostsService.toggleLike(params.slug, userId)
    return NextResponse.json({ success: true, ...result })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
