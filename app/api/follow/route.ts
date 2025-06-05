import { NextRequest, NextResponse } from "next/server"
import { followBlog, unfollowBlog, getFollowerCount, isFollowing } from "@/lib/firebase-services"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()
    if (!userId) {
      return NextResponse.json({ success: false, message: "Missing userId" }, { status: 400 })
    }
    await followBlog(userId)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error adding follower:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json()
    if (!userId) {
      return NextResponse.json({ success: false, message: "Missing userId" }, { status: 400 })
    }
    await unfollowBlog(userId)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error removing follower:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const count = await getFollowerCount()
    const following = userId ? await isFollowing(userId) : false
    return NextResponse.json({ success: true, count, isFollowing: following })
  } catch (error: any) {
    console.error("Error getting followers:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
