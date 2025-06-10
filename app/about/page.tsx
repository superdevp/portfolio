"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { LoadingSection } from "@/components/loading-spinner"
import {
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin,
  Twitter,
  Send,
  Download,
  Award,
  Calendar,
  Code,
  Users,
  Coffee,
  Zap,
  Target,
  Heart,
  BookOpen,
  Briefcase,
} from "lucide-react"
import { usePersonalInfo, useSkills, useExperience, useAchievements, useInterests } from "@/hooks/useFirebaseData"
import type { JSX } from "react"

export default function AboutPage() {
  const { info: personalInfo, loading: infoLoading } = usePersonalInfo()
  const { skills, loading: skillsLoading } = useSkills()
  const { experience, loading: experienceLoading } = useExperience()
  const { achievements, loading: achievementsLoading } = useAchievements()
  const { interests, loading: interestsLoading } = useInterests()

  // Default stats if not available in personalInfo
  const stats = [
    {
      number: personalInfo?.stats?.projectsCompleted || "50+",
      label: "Projects Completed",
      icon: <Briefcase className="w-6 h-6" />,
    },
    {
      number: personalInfo?.stats?.yearsExperience || "5+",
      label: "Years Experience",
      icon: <Calendar className="w-6 h-6" />,
    },
    { number: personalInfo?.stats?.happyClients || "30+", label: "Happy Clients", icon: <Users className="w-6 h-6" /> },
    { number: personalInfo?.stats?.technologies || "15+", label: "Technologies", icon: <Zap className="w-6 h-6" /> },
  ]

  // Fallback skills if not available from Firebase
  const skillsData = skills.length > 0 ? skills : []

  // Fallback experience if not available from Firebase
  const experienceData =
    experience.length > 0
      ? experience
      : []

  // Fallback achievements if not available from Firebase
  const achievementsData = achievements.length > 0 ? achievements : []

  // Fallback interests if not available from Firebase
  const interestsData = interests.length > 0 ? interests : []

  // Map icons for achievements and interests
  const getIconComponent = (iconName: string): JSX.Element => {
    const iconMap: Record<string, JSX.Element> = {
      Award: <Award className="w-6 h-6" />,
      Code: <Code className="w-6 h-6" />,
      Users: <Users className="w-6 h-6" />,
      Target: <Target className="w-6 h-6" />,
      BookOpen: <BookOpen className="w-8 h-8" />,
      Coffee: <Coffee className="w-8 h-8" />,
      Heart: <Heart className="w-8 h-8" />,
      Briefcase: <Briefcase className="w-8 h-8" />,
      Calendar: <Calendar className="w-8 h-8" />,
      Zap: <Zap className="w-8 h-8" />,
    }
    return iconMap[iconName] || <Code className="w-6 h-6" />
  }

  if (infoLoading || skillsLoading || experienceLoading || achievementsLoading || interestsLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <LoadingSection>Loading about page...</LoadingSection>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-cyan-500/10"></div>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                  About <span className="text-teal-400">Me</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  {personalInfo?.title &&
                    `Passionate ${personalInfo.title} with ${personalInfo?.stats?.yearsExperience || "5+"} years of experience creating exceptional digital experiences.`}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {personalInfo?.bio ||
                    `I'm ${personalInfo?.name || "Kei Nishikori"}, a dedicated full-stack developer based in ${personalInfo?.location || "San Francisco, CA"}. I specialize in building modern web applications that combine beautiful design with robust functionality. My journey in tech started with curiosity and has evolved into a passion for creating solutions that make a real impact.`}
                </p>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{personalInfo?.location || "San Francisco, CA"}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{personalInfo?.email || "kei@asvinfomedia.com"}</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative w-80 h-80 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-2xl blur-3xl opacity-20"></div>
                <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-teal-400 shadow-2xl">
                  <Image
                    src={personalInfo?.profileImage || "/placeholder.svg?height=320&width=320"}
                    alt={`${personalInfo?.name || "Kei Nishikori"} - ${personalInfo?.title || "Full-Stack Developer"}`}
                    width={320}
                    height={320}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-6 -right-6 bg-card rounded-xl p-4 border border-border shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-400">
                      {personalInfo?.stats?.yearsExperience || "5+"}
                    </div>
                    <div className="text-xs text-muted-foreground">Years Exp.</div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 border border-border shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-400">
                      {personalInfo?.stats?.projectsCompleted || "50+"}
                    </div>
                    <div className="text-xs text-muted-foreground">Projects</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {
        stats.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <Card key={index} className="bg-card border-border text-center">
                    <CardContent className="p-6">
                      <div className="text-teal-400 mb-3 flex justify-center">{stat.icon}</div>
                      <div className="text-3xl font-bold text-foreground mb-2">{stat.number}</div>
                      <div className="text-muted-foreground text-sm">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )
      }

      {/* Experience Section */}
      {
        experienceData.length > 0 && (
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Professional Experience</h2>
                <p className="text-muted-foreground text-lg">My journey in the tech industry</p>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-teal-400/30"></div>

                  <div className="space-y-12">
                    {experienceData.map((exp, index) => (
                      <div key={index} className="relative flex items-start space-x-8">
                        {/* Timeline dot */}
                        <div
                          className={`relative z-10 w-16 h-16 rounded-full border-4 flex items-center justify-center ${
                            exp.current ? "bg-teal-400 border-teal-400" : "bg-card border-border"
                          }`}
                        >
                          <Briefcase className={`w-6 h-6 ${exp.current ? "text-gray-900" : "text-teal-400"}`} />
                        </div>

                        {/* Content */}
                        <Card className="flex-1 bg-card border-border hover:border-teal-400 transition-colors">
                          <CardContent className="p-8">
                            <div className="flex flex-wrap items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-teal-400 mb-1">{exp.title}</h3>
                                <p className="text-lg font-semibold text-foreground">{exp.company}</p>
                                <p className="text-muted-foreground text-sm">{exp.location}</p>
                              </div>
                              <div
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  exp.current ? "bg-teal-400/20 text-teal-400" : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {exp.period}
                              </div>
                            </div>

                            <p className="text-muted-foreground mb-6">{exp.description}</p>

                            <div>
                              <h4 className="font-semibold mb-3 text-foreground">Key Achievements:</h4>
                              <ul className="space-y-2">
                                {exp.achievements.map((achievement, achIndex) => (
                                  <li key={achIndex} className="flex items-start space-x-2 text-muted-foreground">
                                    <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>{achievement}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      }

      {/* Skills Section */}
      {
        skillsData.length > 0 && (
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Technical Skills</h2>
                <p className="text-muted-foreground text-lg">Technologies and tools I work with</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {skillsData.map((skillGroup, index) => (
                  <Card key={index} className="bg-card border-border hover:border-teal-400 transition-colors">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4 text-teal-400">{skillGroup.category}</h3>
                      <div className="space-y-3">
                        {skillGroup.items.map((skill, skillIndex) => (
                          <div key={skillIndex} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                            <span className="text-muted-foreground">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )
      }

      {/* Achievements Section */}
      {
        achievementsData.length > 0 && (
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Achievements & Certifications</h2>
                <p className="text-muted-foreground text-lg">Recognition and continuous learning</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {achievementsData.map((achievement, index) => (
                  <Card
                    key={index}
                    className="bg-card border-border hover:border-teal-400 transition-all duration-300 hover:transform hover:scale-105"
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-teal-400 mb-4 flex justify-center">
                        {achievement.icon || getIconComponent(achievement.iconName || "Award")}
                      </div>
                      <h3 className="font-semibold mb-2 text-foreground">{achievement.title}</h3>
                      <p className="text-muted-foreground text-sm">{achievement.year}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )
      }

      {/* Interests Section */}
      {
        interestsData.length > 0 && (
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Beyond Code</h2>
                <p className="text-muted-foreground text-lg">What I'm passionate about outside of work</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {interestsData.map((interest, index) => (
                  <Card
                    key={index}
                    className="bg-card border-border hover:border-teal-400 transition-all duration-300 hover:transform hover:scale-105"
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-teal-400 mb-4 flex justify-center">
                        {interest.icon || getIconComponent(interest.iconName || "Code")}
                      </div>
                      <h3 className="font-semibold mb-2 text-foreground">{interest.title}</h3>
                      <p className="text-muted-foreground text-sm">{interest.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )
      }

      {/* Contact CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-teal-400 max-w-4xl mx-auto">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold mb-6">Let's Create Something Amazing Together</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                I'm always excited to work on new projects and collaborate with talented people. Whether you have a
                project in mind or just want to chat about technology, I'd love to hear from you.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Button className="bg-teal-400 text-gray-900 hover:bg-teal-500 text-lg px-8 py-3">
                  <Mail className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
                {/* <Button
                  variant="outline"
                  className="border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-gray-900 text-lg px-8 py-3"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Schedule Call
                </Button> */}
              </div>

              <div className="flex justify-center space-x-6">
                {personalInfo?.socialLinks?.github && (
                  <a href={personalInfo.socialLinks.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-6 h-6 text-muted-foreground hover:text-teal-400 cursor-pointer transition-colors" />
                  </a>
                )}
                {personalInfo?.socialLinks?.telegram && (
                  <a href={personalInfo.socialLinks.telegram} target="_blank" rel="noopener noreferrer">
                    <Send className="w-6 h-6 text-muted-foreground hover:text-teal-400 cursor-pointer transition-colors" />
                  </a>
                )}
                {/* {personalInfo?.socialLinks?.linkedin && (
                  <a href={personalInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-6 h-6 text-muted-foreground hover:text-teal-400 cursor-pointer transition-colors" />
                  </a>
                )}
                {personalInfo?.socialLinks?.twitter && (
                  <a href={personalInfo.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-6 h-6 text-muted-foreground hover:text-teal-400 cursor-pointer transition-colors" />
                  </a>
                )} */}
                {personalInfo?.email && (
                  <a href={`mailto:${personalInfo.email}`}>
                    <Mail className="w-6 h-6 text-muted-foreground hover:text-teal-400 cursor-pointer transition-colors" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
