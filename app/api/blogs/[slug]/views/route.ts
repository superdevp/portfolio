import { NextRequest, NextResponse } from "next/server"
import { blogPostsService } from "@/lib/firebase-services"

export async function POST(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const views = await blogPostsService.incrementViews(params.slug)
    return NextResponse.json({ success: true, views })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
