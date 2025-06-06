"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LoadingSpinner } from "@/components/loading-spinner"
import { skillsService, experienceService, genericService } from "@/lib/firebase-services"
import { Plus, X, Edit, Trash2, CheckCircle, AlertCircle } from "lucide-react"
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Skill, Experience, Achievement, Interest } from "@/lib/types"

export default function AdminSettingsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [experience, setExperience] = useState<Experience[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [interests, setInterests] = useState<Interest[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"skills" | "experience" | "achievements" | "interests">("skills")
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // New item states
  const [newSkill, setNewSkill] = useState({ category: "", items: [""], order: 1, color: "blue" })
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    location: "",
    period: "",
    current: false,
    description: "",
    achievements: [""],
    order: 1,
  })
  const [newAchievement, setNewAchievement] = useState({ title: "", year: "", icon: "Award", order: 1 })
  const [newInterest, setNewInterest] = useState({ title: "", description: "", icon: "Code", order: 1 })
  const [editExperience, setEditExperience] = useState<Experience | null>(null)
  const [editData, setEditData] = useState<Experience | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [skillsData, experienceData, achievementsData, interestsData] = await Promise.all([
        skillsService.getAll(),
        experienceService.getAll(),
        genericService.getCollection("achievements"),
        genericService.getCollection("interests"),
      ])
      setSkills(skillsData)
      setExperience(experienceData)
      setAchievements(achievementsData)
      setInterests(interestsData)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Failed to load settings data")
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (message: string, isError = false) => {
    if (isError) {
      setError(message)
      setSuccess(null)
    } else {
      setSuccess(message)
      setError(null)
    }
    setTimeout(() => {
      setError(null)
      setSuccess(null)
    }, 3000)
  }

  // Skills Management
  const addSkill = async () => {
    if (!newSkill.category.trim()) return

    setSaving(true)
    try {
      const docRef = await addDoc(collection(db, "skills"), newSkill)
      const addedSkill = { id: docRef.id, ...newSkill }
      setSkills([...skills, addedSkill])
      setNewSkill({ category: "", items: [""], order: 1, color: "blue" })
      showMessage("Skill category added successfully!")
    } catch (error) {
      console.error("Error adding skill:", error)
      showMessage("Failed to add skill category", true)
    } finally {
      setSaving(false)
    }
  }

  const updateSkill = async (id: string, updatedSkill: Partial<Skill>) => {
    setSaving(true)
    try {
      await updateDoc(doc(db, "skills", id), updatedSkill)
      setSkills(skills.map((skill) => (skill.id === id ? { ...skill, ...updatedSkill } : skill)))
      setEditingItem(null)
      showMessage("Skill category updated successfully!")
    } catch (error) {
      console.error("Error updating skill:", error)
      showMessage("Failed to update skill category", true)
    } finally {
      setSaving(false)
    }
  }

  const deleteSkill = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill category?")) return

    setSaving(true)
    try {
      await deleteDoc(doc(db, "skills", id))
      setSkills(skills.filter((skill) => skill.id !== id))
      showMessage("Skill category deleted successfully!")
    } catch (error) {
      console.error("Error deleting skill:", error)
      showMessage("Failed to delete skill category", true)
    } finally {
      setSaving(false)
    }
  }

  // Experience Management
  const addExperience = async () => {
    if (!newExperience.title.trim() || !newExperience.company.trim() || !newExperience.period.trim()) return

    setSaving(true)
    try {
      const docRef = await addDoc(collection(db, "experience"), newExperience)
      const addedExperience = { id: docRef.id, ...newExperience }
      setExperience([...experience, addedExperience])
      setNewExperience({
        title: "",
        company: "",
        location: "",
        period: "",
        current: false,
        description: "",
        achievements: [""],
        order: 1,
      })
      showMessage("Experience added successfully!")
    } catch (error) {
      console.error("Error adding experience:", error)
      showMessage("Failed to add experience", true)
    } finally {
      setSaving(false)
    }
  }

  const updateExperience = async (id: string, updatedExperience: Partial<Experience>) => {
    setSaving(true)
    try {
      await updateDoc(doc(db, "experience", id), updatedExperience)
      setExperience(experience.map((exp) => (exp.id === id ? { ...exp, ...updatedExperience } : exp)))
      setEditingItem(null)
      showMessage("Experience updated successfully!")
    } catch (error) {
      console.error("Error updating experience:", error)
      showMessage("Failed to update experience", true)
    } finally {
      setSaving(false)
    }
  }

  const openEditExperience = (exp: Experience) => {
    setEditExperience(exp)
    setEditData(exp)
  }

  const handleEditChange = (field: keyof Experience, value: any) => {
    if (!editData) return
    setEditData({ ...editData, [field]: value })
  }

  const saveEditExperience = async () => {
    if (!editData || !editExperience?.id) return
    await updateExperience(editExperience.id, editData)
    setEditExperience(null)
    setEditData(null)
  }

  const deleteExperience = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return

    setSaving(true)
    try {
      await deleteDoc(doc(db, "experience", id))
      setExperience(experience.filter((exp) => exp.id !== id))
      showMessage("Experience deleted successfully!")
    } catch (error) {
      console.error("Error deleting experience:", error)
      showMessage("Failed to delete experience", true)
    } finally {
      setSaving(false)
    }
  }

  // Achievement Management
  const addAchievement = async () => {
    if (!newAchievement.title.trim()) return

    setSaving(true)
    try {
      const docRef = await addDoc(collection(db, "achievements"), newAchievement)
      const addedAchievement = { id: docRef.id, ...newAchievement }
      setAchievements([...achievements, addedAchievement])
      setNewAchievement({ title: "", year: "", icon: "Award", order: 1 })
      showMessage("Achievement added successfully!")
    } catch (error) {
      console.error("Error adding achievement:", error)
      showMessage("Failed to add achievement", true)
    } finally {
      setSaving(false)
    }
  }

  const updateAchievement = async (id: string, updatedAchievement: Partial<Achievement>) => {
    setSaving(true)
    try {
      await updateDoc(doc(db, "achievements", id), updatedAchievement)
      setAchievements(achievements.map((ach) => (ach.id === id ? { ...ach, ...updatedAchievement } : ach)))
      setEditingItem(null)
      showMessage("Achievement updated successfully!")
    } catch (error) {
      console.error("Error updating achievement:", error)
      showMessage("Failed to update achievement", true)
    } finally {
      setSaving(false)
    }
  }

  const deleteAchievement = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return

    setSaving(true)
    try {
      await deleteDoc(doc(db, "achievements", id))
      setAchievements(achievements.filter((ach) => ach.id !== id))
      showMessage("Achievement deleted successfully!")
    } catch (error) {
      console.error("Error deleting achievement:", error)
      showMessage("Failed to delete achievement", true)
    } finally {
      setSaving(false)
    }
  }

  // Interest Management
  const addInterest = async () => {
    if (!newInterest.title.trim()) return

    setSaving(true)
    try {
      const docRef = await addDoc(collection(db, "interests"), newInterest)
      const addedInterest = { id: docRef.id, ...newInterest }
      setInterests([...interests, addedInterest])
      setNewInterest({ title: "", description: "", icon: "Code", order: 1 })
      showMessage("Interest added successfully!")
    } catch (error) {
      console.error("Error adding interest:", error)
      showMessage("Failed to add interest", true)
    } finally {
      setSaving(false)
    }
  }

  const updateInterest = async (id: string, updatedInterest: Partial<Interest>) => {
    setSaving(true)
    try {
      await updateDoc(doc(db, "interests", id), updatedInterest)
      setInterests(interests.map((int) => (int.id === id ? { ...int, ...updatedInterest } : int)))
      setEditingItem(null)
      showMessage("Interest updated successfully!")
    } catch (error) {
      console.error("Error updating interest:", error)
      showMessage("Failed to update interest", true)
    } finally {
      setSaving(false)
    }
  }

  const deleteInterest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this interest?")) return

    setSaving(true)
    try {
      await deleteDoc(doc(db, "interests", id))
      setInterests(interests.filter((int) => int.id !== id))
      showMessage("Interest deleted successfully!")
    } catch (error) {
      console.error("Error deleting interest:", error)
      showMessage("Failed to delete interest", true)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="p-8 flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your skills, experience, achievements, and interests.</p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-md mb-6 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-md mb-6 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-muted p-1 rounded-lg">
          {[
            { key: "skills", label: "Skills" },
            { key: "experience", label: "Experience" },
            { key: "achievements", label: "Achievements" },
            { key: "interests", label: "Interests" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Skills Tab */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Add New Skill Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Category name (e.g., Frontend)"
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                    className="bg-background border-border"
                  />
                  <select
                    value={newSkill.color}
                    onChange={(e) => setNewSkill({ ...newSkill, color: e.target.value })}
                    className="px-3 py-2 bg-background border border-border rounded-md text-foreground"
                  >
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                    <option value="orange">Orange</option>
                    <option value="red">Red</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Skills in this category:</label>
                  {newSkill.items.map((item, index) => (
                    <div key={index} className="flex space-x-2">
                      <Input
                        placeholder="Skill name"
                        value={item}
                        onChange={(e) => {
                          const updatedItems = [...newSkill.items]
                          updatedItems[index] = e.target.value
                          setNewSkill({ ...newSkill, items: updatedItems })
                        }}
                        className="bg-background border-border"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updatedItems = newSkill.items.filter((_, i) => i !== index)
                          setNewSkill({ ...newSkill, items: updatedItems })
                        }}
                        className="border-border"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setNewSkill({ ...newSkill, items: [...newSkill.items, ""] })}
                    className="border-border"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                </div>
                <Button onClick={addSkill} disabled={saving} className="bg-teal-400 text-gray-900 hover:bg-teal-500">
                  {saving ? <LoadingSpinner size="sm" className="mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  Add Category
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skills.map((skillGroup) => (
                <Card key={skillGroup.id} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">{skillGroup.category}</h3>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingItem(skillGroup.id || "")}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => skillGroup.id && deleteSkill(skillGroup.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-teal-400/20 text-teal-400 text-sm rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === "experience" && (
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Add New Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Job title"
                    value={newExperience.title}
                    onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                    className="bg-background border-border"
                  />
                  <Input
                    placeholder="Company name"
                    value={newExperience.company}
                    onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                    className="bg-background border-border"
                  />
                  <Input
                    placeholder="Location"
                    value={newExperience.location}
                    onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                    className="bg-background border-border"
                  />
                  <Input
                    placeholder="Period (e.g., 2022 - Present)"
                    value={newExperience.period}
                    onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })}
                    className="bg-background border-border"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="current"
                      checked={newExperience.current}
                      onChange={(e) => setNewExperience({ ...newExperience, current: e.target.checked })}
                      className="rounded border-border"
                    />
                    <label htmlFor="current" className="text-sm font-medium">
                      Current position
                    </label>
                  </div>
                </div>
                <Textarea
                  placeholder="Job description"
                  value={newExperience.description}
                  onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                  rows={3}
                  className="bg-background border-border"
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium">Achievements:</label>
                  {newExperience.achievements.map((ach, index) => (
                    <div key={index} className="flex space-x-2">
                      <Input
                        placeholder="Achievement"
                        value={ach}
                        onChange={(e) => {
                          const items = [...newExperience.achievements]
                          items[index] = e.target.value
                          setNewExperience({ ...newExperience, achievements: items })
                        }}
                        className="bg-background border-border"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const items = newExperience.achievements.filter((_, i) => i !== index)
                          setNewExperience({ ...newExperience, achievements: items })
                        }}
                        className="border-border"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setNewExperience({ ...newExperience, achievements: [...newExperience.achievements, ""] })}
                    className="border-border"
                  >
                    <Plus className="w-4 h-4 mr-2" />Add Achievement
                  </Button>
                </div>
                <Button
                  onClick={addExperience}
                  disabled={saving}
                  className="bg-teal-400 text-gray-900 hover:bg-teal-500"
                >
                  {saving ? <LoadingSpinner size="sm" className="mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  Add Experience
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {experience.map((exp) => (
                <Card key={exp.id} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-teal-400">{exp.title}</h3>
                        <p className="text-foreground font-medium">{exp.company}</p>
                        <p className="text-muted-foreground text-sm">{exp.location}</p>
                        <p className="text-muted-foreground text-sm">{exp.period}</p>
                        <p className="text-muted-foreground mt-2">{exp.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => exp && openEditExperience(exp)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => exp.id && deleteExperience(exp.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Dialog open={!!editExperience} onOpenChange={(open) => !open && setEditExperience(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Experience</DialogTitle>
                </DialogHeader>
                {editData && (
                  <div className="space-y-4">
                    <Input
                      placeholder="Job title"
                      value={editData.title}
                      onChange={(e) => handleEditChange("title", e.target.value)}
                      className="bg-background border-border"
                    />
                    <Input
                      placeholder="Company name"
                      value={editData.company}
                      onChange={(e) => handleEditChange("company", e.target.value)}
                      className="bg-background border-border"
                    />
                    <Input
                      placeholder="Location"
                      value={editData.location}
                      onChange={(e) => handleEditChange("location", e.target.value)}
                      className="bg-background border-border"
                    />
                    <Input
                      placeholder="Period"
                      value={editData.period}
                      onChange={(e) => handleEditChange("period", e.target.value)}
                      className="bg-background border-border"
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="edit-current"
                        checked={editData.current}
                        onChange={(e) => handleEditChange("current", e.target.checked)}
                        className="rounded border-border"
                      />
                      <label htmlFor="edit-current" className="text-sm font-medium">
                        Current position
                      </label>
                    </div>
                    <Textarea
                      placeholder="Job description"
                      value={editData.description}
                      onChange={(e) => handleEditChange("description", e.target.value)}
                      rows={3}
                      className="bg-background border-border"
                    />
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Achievements:</label>
                      {editData.achievements.map((ach, index) => (
                        <div key={index} className="flex space-x-2">
                          <Input
                            placeholder="Achievement"
                            value={ach}
                            onChange={(e) => {
                              const items = [...editData.achievements]
                              items[index] = e.target.value
                              handleEditChange("achievements", items)
                            }}
                            className="bg-background border-border"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const items = editData.achievements.filter((_, i) => i !== index)
                              handleEditChange("achievements", items)
                            }}
                            className="border-border"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditChange("achievements", [...editData.achievements, ""]) }
                        className="border-border"
                      >
                        <Plus className="w-4 h-4 mr-2" />Add Achievement
                      </Button>
                    </div>
                    <div className="flex justify-end pt-2 space-x-2">
                      <Button variant="outline" onClick={() => setEditExperience(null)}>
                        Cancel
                      </Button>
                      <Button onClick={saveEditExperience}>Save</Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Add New Achievement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Achievement title"
                    value={newAchievement.title}
                    onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                    className="bg-background border-border"
                  />
                  <Input
                    placeholder="Year"
                    value={newAchievement.year}
                    onChange={(e) => setNewAchievement({ ...newAchievement, year: e.target.value })}
                    className="bg-background border-border"
                  />
                  <select
                    value={newAchievement.icon}
                    onChange={(e) => setNewAchievement({ ...newAchievement, icon: e.target.value })}
                    className="px-3 py-2 bg-background border border-border rounded-md text-foreground"
                  >
                    <option value="Award">Award</option>
                    <option value="Code">Code</option>
                    <option value="Users">Users</option>
                    <option value="Target">Target</option>
                    <option value="Star">Star</option>
                  </select>
                </div>
                <Button
                  onClick={addAchievement}
                  disabled={saving}
                  className="bg-teal-400 text-gray-900 hover:bg-teal-500"
                >
                  {saving ? <LoadingSpinner size="sm" className="mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  Add Achievement
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="bg-card border-border">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                        <p className="text-muted-foreground text-sm">{achievement.year}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingItem(achievement.id || "")}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => achievement.id && deleteAchievement(achievement.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Interests Tab */}
        {activeTab === "interests" && (
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Add New Interest</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Interest title"
                    value={newInterest.title}
                    onChange={(e) => setNewInterest({ ...newInterest, title: e.target.value })}
                    className="bg-background border-border"
                  />
                  <Input
                    placeholder="Description"
                    value={newInterest.description}
                    onChange={(e) => setNewInterest({ ...newInterest, description: e.target.value })}
                    className="bg-background border-border"
                  />
                  <select
                    value={newInterest.icon}
                    onChange={(e) => setNewInterest({ ...newInterest, icon: e.target.value })}
                    className="px-3 py-2 bg-background border border-border rounded-md text-foreground"
                  >
                    <option value="Code">Code</option>
                    <option value="BookOpen">BookOpen</option>
                    <option value="Coffee">Coffee</option>
                    <option value="Heart">Heart</option>
                    <option value="Music">Music</option>
                    <option value="Camera">Camera</option>
                  </select>
                </div>
                <Button onClick={addInterest} disabled={saving} className="bg-teal-400 text-gray-900 hover:bg-teal-500">
                  {saving ? <LoadingSpinner size="sm" className="mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  Add Interest
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interests.map((interest) => (
                <Card key={interest.id} className="bg-card border-border">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{interest.title}</h3>
                        <p className="text-muted-foreground text-sm">{interest.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingItem(interest.id || "")}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => interest.id && deleteInterest(interest.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
