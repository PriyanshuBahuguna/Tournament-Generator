"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Twitter, Code, BookOpen, Award, Users, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TeamMember {
  name: string
  role: string
  bio: string
  avatar: string
  social: {
    github?: string
    linkedin?: string
    twitter?: string
  }
}

const teamMembers: TeamMember[] = [
  {
    name: "Aditya Ghildiyal",
    role: "Team Lead & Algorithm Developer",
    bio: "Computer Science enthusiast with a passion for algorithm design and optimization. Specialized in tournament bracket generation algorithms and data structures.",
    avatar: "AG",
    social: {
      github: "https://github.com/adityaghildiyal",
      linkedin: "https://linkedin.com/in/adityaghildiyal",
    },
  },
  {
    name: "Varun Bahuguna",
    role: "Frontend Developer",
    bio: "Creative developer focused on building intuitive and responsive user interfaces. Implemented the interactive bracket visualization and tournament customization features.",
    avatar: "VB",
    social: {
      github: "https://github.com/varunbahuguna",
      linkedin: "https://linkedin.com/in/varunbahuguna",
    },
  },
  {
    name: "Shoubit Taragi",
    role: "Backend Developer",
    bio: "Specialized in system architecture and data management. Designed the tournament generation engine and scheduling algorithms for optimal tournament planning.",
    avatar: "ST",
    social: {
      github: "https://github.com/shoubittaragi",
      linkedin: "https://linkedin.com/in/shoubittaragi",
    },
  },
  {
    name: "Priyanshu",
    role: "UI/UX Designer",
    bio: "Passionate about creating seamless user experiences. Designed the intuitive interface for tournament creation and visualization, focusing on accessibility and usability.",
    avatar: "P",
    social: {
      github: "https://github.com/priyanshu",
      twitter: "https://twitter.com/priyanshu",
    },
  },
]

export default function AboutUs() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("team")
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }

  return (
    <>
      <Button variant="ghost" className="flex items-center gap-2" onClick={() => setIsOpen(true)}>
        <Users className="h-4 w-4" />
        About Us
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="w-full max-w-3xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="border-primary/20">
                <CardHeader className="relative pb-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <CardTitle className="text-2xl">About TourneyGen</CardTitle>
                  <CardDescription>
                    A project for 4th semester Design and Analysis of Algorithms (DAA) course
                  </CardDescription>
                </CardHeader>
                <Tabs
                  defaultValue="team"
                  value={activeTab}
                  onValueChange={(value) => {
                    setActiveTab(value)
                    scrollToTop()
                  }}
                  className="w-full"
                >
                  <div className="px-6">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="team">Our Team</TabsTrigger>
                      <TabsTrigger value="project">Project Details</TabsTrigger>
                    </TabsList>
                  </div>

                  <ScrollArea className="h-[60vh]" ref={scrollRef}>
                    <TabsContent value="team" className="mt-0 p-6">
                      <div className="space-y-6">
                        <p className="text-muted-foreground">
                          Meet the talented team behind TourneyGen, a tournament bracket generator created as part of
                          our 4th semester Design and Analysis of Algorithms course.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {teamMembers.map((member, index) => (
                            <motion.div
                              key={member.name}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Card>
                                <CardHeader className="pb-2">
                                  <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12 border-2 border-primary">
                                      <AvatarFallback className="bg-primary/10 text-primary">
                                        {member.avatar}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <CardTitle className="text-lg">{member.name}</CardTitle>
                                      <CardDescription>{member.role}</CardDescription>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                                </CardContent>
                                <CardFooter className="flex gap-2 pt-0">
                                  {member.social.github && (
                                    <Button variant="outline" size="icon" asChild className="h-8 w-8">
                                      <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                                        <Github className="h-4 w-4" />
                                      </a>
                                    </Button>
                                  )}
                                  {member.social.linkedin && (
                                    <Button variant="outline" size="icon" asChild className="h-8 w-8">
                                      <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                                        <Linkedin className="h-4 w-4" />
                                      </a>
                                    </Button>
                                  )}
                                  {member.social.twitter && (
                                    <Button variant="outline" size="icon" asChild className="h-8 w-8">
                                      <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                                        <Twitter className="h-4 w-4" />
                                      </a>
                                    </Button>
                                  )}
                                </CardFooter>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="project" className="mt-0 p-6">
                      <div className="space-y-6">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mb-6">
                            <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                              <BookOpen className="h-5 w-5 text-primary" />
                              Project Overview
                            </h3>
                            <p className="text-muted-foreground">
                              TourneyGen is an advanced tournament bracket generator that implements various algorithms
                              to create and manage different types of tournament formats. This project was developed as
                              part of our 4th semester Design and Analysis of Algorithms (DAA) course to demonstrate
                              practical applications of algorithm design and analysis.
                            </p>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                            <Code className="h-5 w-5 text-primary" />
                            Algorithms Implemented
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <Card className="bg-card/50">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Seeding Algorithms</CardTitle>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <ul className="space-y-1 text-sm">
                                  <li className="flex items-center gap-2">
                                    <Badge variant="outline">O(n log n)</Badge>
                                    Merge Sort Seeding
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <Badge variant="outline">O(n²)</Badge>
                                    Quick Sort Seeding
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <Badge variant="outline">O(n)</Badge>
                                    Random Seeding
                                  </li>
                                </ul>
                              </CardContent>
                            </Card>

                            <Card className="bg-card/50">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Scheduling Algorithms</CardTitle>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <ul className="space-y-1 text-sm">
                                  <li className="flex items-center gap-2">
                                    <Badge variant="outline">O(n²)</Badge>
                                    Graph Coloring
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <Badge variant="outline">O(n²)</Badge>
                                    Hamiltonian Path
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <Badge variant="outline">O(n)</Badge>
                                    Basic Scheduling
                                  </li>
                                </ul>
                              </CardContent>
                            </Card>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                            <Award className="h-5 w-5 text-primary" />
                            Key Features
                          </h3>

                          <div className="space-y-3 mb-6">
                            <div className="bg-card/50 p-3 rounded-lg border">
                              <h4 className="font-medium mb-1">Multiple Tournament Formats</h4>
                              <p className="text-sm text-muted-foreground">
                                Support for Knockout, Round Robin, and Hybrid tournament formats with customizable
                                options.
                              </p>
                            </div>

                            <div className="bg-card/50 p-3 rounded-lg border">
                              <h4 className="font-medium mb-1">Advanced Scheduling</h4>
                              <p className="text-sm text-muted-foreground">
                                Date-based scheduling with rest days, venue allocation, and maximum matches per day
                                constraints.
                              </p>
                            </div>

                            <div className="bg-card/50 p-3 rounded-lg border">
                              <h4 className="font-medium mb-1">Interactive Visualization</h4>
                              <p className="text-sm text-muted-foreground">
                                Dynamic bracket views, standings tables, and schedule displays with real-time updates.
                              </p>
                            </div>

                            <div className="bg-card/50 p-3 rounded-lg border">
                              <h4 className="font-medium mb-1">Dynamic Reseeding</h4>
                              <p className="text-sm text-muted-foreground">
                                Priority queue-based dynamic bracket updates when teams withdraw from the tournament.
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                            <h3 className="text-lg font-medium mb-2">Academic Significance</h3>
                            <p className="text-muted-foreground">
                              This project demonstrates practical applications of various algorithms and data structures
                              studied in our DAA course, including sorting algorithms, graph algorithms, and priority
                              queues. The implementation showcases algorithm analysis, time complexity considerations,
                              and optimization techniques in a real-world application.
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </TabsContent>
                  </ScrollArea>
                </Tabs>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

