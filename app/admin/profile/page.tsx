"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/loading-spinner"
import { personalInfoService } from "@/lib/firebase-services"
import { fallbackPersonalInfo } from "@/lib/fallback-data"
import { AlertCircle, CheckCircle, Save } from "lucide-react"
import type { PersonalInfo } from "@/lib/types"

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<PersonalInfo>(fallbackPersonalInfo)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true)
        const data = await personalInfoService.get()
        if (data) {
          console.log("Data ===========>>>>>", data)
          setProfile(data)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    console.log("data => ", name, value)

    if (name.includes(".")) {
      // Handle nested properties (e.g., socialLinks.github)
      const [parent, child] = name.split(".")
      setProfile((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof PersonalInfo] as any,
          [child]: value,
        },
      }))
    } else {
      // Handle top-level properties
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleStatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [name]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSaving(true)

    try {
      // Update the updatedAt timestamp
      const updatedProfile = {
        ...profile,
        updatedAt: new Date(),
      }

      const success = await personalInfoService.update(updatedProfile)
      if (success) {
        setSuccess("Profile updated successfully!")
      } else {
        setError("Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setError("An error occurred while updating the profile")
    } finally {
      setSaving(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Profile</h1>
            <p className="text-muted-foreground">Update your personal information and social links.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-md mb-6 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-md mb-6 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>{success}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-foreground">
                      Professional Title
                    </label>
                    <Input
                      id="title"
                      name="title"
                      value={profile.title}
                      onChange={handleChange}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="bio" className="text-sm font-medium text-foreground">
                      Bio
                    </label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      rows={5}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium text-foreground">
                      Location
                    </label>
                    <Input
                      id="location"
                      name="location"
                      value={profile.location}
                      onChange={handleChange}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleChange}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Phone
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profile.phone || ""}
                      onChange={handleChange}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="profileImage" className="text-sm font-medium text-foreground">
                      Profile Image URL
                    </label>
                    <Input
                      id="profileImage"
                      name="profileImage"
                      value={profile.profileImage}
                      onChange={handleChange}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="resumeUrl" className="text-sm font-medium text-foreground">
                      Resume URL
                    </label>
                    <Input
                      id="resumeUrl"
                      name="resumeUrl"
                      value={profile.resumeUrl || ""}
                      onChange={handleChange}
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-8">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Social Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="socialLinks.github" className="text-sm font-medium text-foreground">
                        GitHub
                      </label>
                      <Input
                        id="socialLinks.github"
                        name="socialLinks.github"
                        value={profile.socialLinks?.github || ""}
                        onChange={handleChange}
                        className="bg-background border-border text-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="socialLinks.linkedin" className="text-sm font-medium text-foreground">
                        LinkedIn
                      </label>
                      <Input
                        id="socialLinks.linkedin"
                        name="socialLinks.linkedin"
                        value={profile.socialLinks?.linkedin || ""}
                        onChange={handleChange}
                        className="bg-background border-border text-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="socialLinks.telegram" className="text-sm font-medium text-foreground">
                        Telegram
                      </label>
                      <Input
                        id="socialLinks.telegram"
                        name="socialLinks.telegram"
                        value={profile.socialLinks?.telegram || ""}
                        onChange={handleChange}
                        className="bg-background border-border text-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="socialLinks.website" className="text-sm font-medium text-foreground">
                        Personal Website
                      </label>
                      <Input
                        id="socialLinks.website"
                        name="socialLinks.website"
                        value={profile.socialLinks?.website || ""}
                        onChange={handleChange}
                        className="bg-background border-border text-foreground"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="yearsExperience" className="text-sm font-medium text-foreground">
                        Years Experience
                      </label>
                      <Input
                        id="yearsExperience"
                        name="yearsExperience"
                        value={profile.stats?.yearsExperience || ""}
                        onChange={handleStatsChange}
                        className="bg-background border-border text-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="projectsCompleted" className="text-sm font-medium text-foreground">
                        Projects Completed
                      </label>
                      <Input
                        id="projectsCompleted"
                        name="projectsCompleted"
                        value={profile.stats?.projectsCompleted || ""}
                        onChange={handleStatsChange}
                        className="bg-background border-border text-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="happyClients" className="text-sm font-medium text-foreground">
                        Happy Clients
                      </label>
                      <Input
                        id="happyClients"
                        name="happyClients"
                        value={profile.stats?.happyClients || ""}
                        onChange={handleStatsChange}
                        className="bg-background border-border text-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="technologies" className="text-sm font-medium text-foreground">
                        Technologies
                      </label>
                      <Input
                        id="technologies"
                        name="technologies"
                        value={profile.stats?.technologies || ""}
                        onChange={handleStatsChange}
                        className="bg-background border-border text-foreground"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button type="submit" disabled={saving} className="bg-teal-400 text-gray-900 hover:bg-teal-500 px-8">
                {saving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </ProtectedRoute>
  )
}
