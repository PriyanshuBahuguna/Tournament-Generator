"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Github, Linkedin, Twitter, Code, BookOpen, Award, Users, X } from "lucide-react"

const teamMembers = [
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
  const scrollRef = useRef(null)

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }

  return (
    <>
      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "none",
          border: "none",
          color: "white",
          cursor: "pointer",
          padding: "0.5rem",
        }}
        onClick={() => setIsOpen(true)}
      >
        <Users size={16} />
        About Us
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              style={{
                width: "100%",
                maxWidth: "48rem",
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  backgroundColor: "#080808",
                  borderRadius: "0.5rem",
                  border: "1px solid #333",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    padding: "1.5rem",
                    borderBottom: "1px solid #333",
                  }}
                >
                  <button
                    style={{
                      position: "absolute",
                      right: "1rem",
                      top: "1rem",
                      background: "none",
                      border: "none",
                      color: "#999",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "0.25rem",
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    <X size={16} />
                  </button>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>About TourneyGen</h2>
                  <p style={{ fontSize: "0.875rem", color: "#999" }}>
                    A project for 4th semester Design and Analysis of Algorithms (DAA) course
                  </p>
                </div>

                <div style={{ width: "100%" }}>
                  <div style={{ padding: "0 1.5rem" }}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        width: "100%",
                        borderBottom: "1px solid #333",
                      }}
                    >
                      <button
                        style={{
                          padding: "0.75rem 0",
                          background: "none",
                          border: "none",
                          borderBottom: activeTab === "team" ? "2px solid white" : "none",
                          color: activeTab === "team" ? "white" : "#999",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setActiveTab("team")
                          scrollToTop()
                        }}
                      >
                        Our Team
                      </button>
                      <button
                        style={{
                          padding: "0.75rem 0",
                          background: "none",
                          border: "none",
                          borderBottom: activeTab === "project" ? "2px solid white" : "none",
                          color: activeTab === "project" ? "white" : "#999",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setActiveTab("project")
                          scrollToTop()
                        }}
                      >
                        Project Details
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      height: "60vh",
                      overflowY: "auto",
                      padding: "1.5rem",
                    }}
                    ref={scrollRef}
                  >
                    {activeTab === "team" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <p style={{ color: "#999" }}>
                          Meet the talented team behind TourneyGen, a tournament bracket generator created as part of
                          our 4th semester Design and Analysis of Algorithms course.
                        </p>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr",
                            gap: "1.5rem",
                            "@media(minWidth: 768px)": { gridTemplateColumns: "1fr 1fr" },
                          }}
                        >
                          {teamMembers.map((member, index) => (
                            <motion.div
                              key={member.name}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div
                                style={{
                                  backgroundColor: "#111",
                                  borderRadius: "0.5rem",
                                  border: "1px solid #333",
                                  overflow: "hidden",
                                }}
                              >
                                <div style={{ padding: "1rem", borderBottom: "1px solid #333" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <div
                                      style={{
                                        height: "3rem",
                                        width: "3rem",
                                        borderRadius: "50%",
                                        border: "2px solid white",
                                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                                        color: "white",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {member.avatar}
                                    </div>
                                    <div>
                                      <h3 style={{ fontSize: "1.125rem", fontWeight: "bold" }}>{member.name}</h3>
                                      <p style={{ fontSize: "0.875rem", color: "#999" }}>{member.role}</p>
                                    </div>
                                  </div>
                                </div>
                                <div style={{ padding: "1rem" }}>
                                  <p style={{ fontSize: "0.875rem", color: "#999" }}>{member.bio}</p>
                                </div>
                                <div
                                  style={{
                                    padding: "1rem",
                                    display: "flex",
                                    gap: "0.5rem",
                                    borderTop: "1px solid #333",
                                  }}
                                >
                                  {member.social.github && (
                                    <a
                                      href={member.social.github}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "2rem",
                                        height: "2rem",
                                        borderRadius: "0.25rem",
                                        border: "1px solid #333",
                                        color: "white",
                                      }}
                                    >
                                      <Github size={16} />
                                    </a>
                                  )}
                                  {member.social.linkedin && (
                                    <a
                                      href={member.social.linkedin}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "2rem",
                                        height: "2rem",
                                        borderRadius: "0.25rem",
                                        border: "1px solid #333",
                                        color: "white",
                                      }}
                                    >
                                      <Linkedin size={16} />
                                    </a>
                                  )}
                                  {member.social.twitter && (
                                    <a
                                      href={member.social.twitter}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "2rem",
                                        height: "2rem",
                                        borderRadius: "0.25rem",
                                        border: "1px solid #333",
                                        color: "white",
                                      }}
                                    >
                                      <Twitter size={16} />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === "project" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                          <div
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.05)",
                              padding: "1rem",
                              borderRadius: "0.5rem",
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                              marginBottom: "1.5rem",
                            }}
                          >
                            <h3
                              style={{
                                fontSize: "1.125rem",
                                fontWeight: "500",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                marginBottom: "0.5rem",
                              }}
                            >
                              <BookOpen size={20} style={{ color: "white" }} />
                              Project Overview
                            </h3>
                            <p style={{ color: "#999" }}>
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
                          <h3
                            style={{
                              fontSize: "1.125rem",
                              fontWeight: "500",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              marginBottom: "1rem",
                            }}
                          >
                            <Code size={20} style={{ color: "white" }} />
                            Algorithms Implemented
                          </h3>

                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr",
                              gap: "1rem",
                              marginBottom: "1.5rem",
                              "@media(minWidth: 768px)": { gridTemplateColumns: "1fr 1fr" },
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: "rgba(0, 0, 0, 0.3)",
                                borderRadius: "0.5rem",
                                border: "1px solid #333",
                              }}
                            >
                              <div style={{ padding: "1rem", borderBottom: "1px solid #333" }}>
                                <h4 style={{ fontSize: "1rem", fontWeight: "500" }}>Seeding Algorithms</h4>
                              </div>
                              <div style={{ padding: "1rem" }}>
                                <ul
                                  style={{
                                    listStyleType: "none",
                                    padding: 0,
                                    margin: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.25rem",
                                  }}
                                >
                                  <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <span
                                      style={{
                                        fontSize: "0.75rem",
                                        padding: "0.125rem 0.5rem",
                                        borderRadius: "9999px",
                                        border: "1px solid #333",
                                      }}
                                    >
                                      O(n log n)
                                    </span>
                                    Merge Sort Seeding
                                  </li>
                                  <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <span
                                      style={{
                                        fontSize: "0.75rem",
                                        padding: "0.125rem 0.5rem",
                                        borderRadius: "9999px",
                                        border: "1px solid #333",
                                      }}
                                    >
                                      O(n²)
                                    </span>
                                    Quick Sort Seeding
                                  </li>
                                  <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <span
                                      style={{
                                        fontSize: "0.75rem",
                                        padding: "0.125rem 0.5rem",
                                        borderRadius: "9999px",
                                        border: "1px solid #333",
                                      }}
                                    >
                                      O(n)
                                    </span>
                                    Random Seeding
                                  </li>
                                </ul>
                              </div>
                            </div>

                            <div
                              style={{
                                backgroundColor: "rgba(0, 0, 0, 0.3)",
                                borderRadius: "0.5rem",
                                border: "1px solid #333",
                              }}
                            >
                              <div style={{ padding: "1rem", borderBottom: "1px solid #333" }}>
                                <h4 style={{ fontSize: "1rem", fontWeight: "500" }}>Scheduling Algorithms</h4>
                              </div>
                              <div style={{ padding: "1rem" }}>
                                <ul
                                  style={{
                                    listStyleType: "none",
                                    padding: 0,
                                    margin: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.25rem",
                                  }}
                                >
                                  <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <span
                                      style={{
                                        fontSize: "0.75rem",
                                        padding: "0.125rem 0.5rem",
                                        borderRadius: "9999px",
                                        border: "1px solid #333",
                                      }}
                                    >
                                      O(n²)
                                    </span>
                                    Graph Coloring
                                  </li>
                                  <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <span
                                      style={{
                                        fontSize: "0.75rem",
                                        padding: "0.125rem 0.5rem",
                                        borderRadius: "9999px",
                                        border: "1px solid #333",
                                      }}
                                    >
                                      O(n²)
                                    </span>
                                    Hamiltonian Path
                                  </li>
                                  <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <span
                                      style={{
                                        fontSize: "0.75rem",
                                        padding: "0.125rem 0.5rem",
                                        borderRadius: "9999px",
                                        border: "1px solid #333",
                                      }}
                                    >
                                      O(n)
                                    </span>
                                    Basic Scheduling
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h3
                            style={{
                              fontSize: "1.125rem",
                              fontWeight: "500",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              marginBottom: "1rem",
                            }}
                          >
                            <Award size={20} style={{ color: "white" }} />
                            Key Features
                          </h3>

                          <div
                            style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}
                          >
                            <div
                              style={{
                                backgroundColor: "rgba(0, 0, 0, 0.3)",
                                padding: "0.75rem",
                                borderRadius: "0.5rem",
                                border: "1px solid #333",
                              }}
                            >
                              <h4 style={{ fontWeight: "500", marginBottom: "0.25rem" }}>
                                Multiple Tournament Formats
                              </h4>
                              <p style={{ fontSize: "0.875rem", color: "#999" }}>
                                Support for Knockout, Round Robin, and Hybrid tournament formats with customizable
                                options.
                              </p>
                            </div>

                            <div
                              style={{
                                backgroundColor: "rgba(0, 0, 0, 0.3)",
                                padding: "0.75rem",
                                borderRadius: "0.5rem",
                                border: "1px solid #333",
                              }}
                            >
                              <h4 style={{ fontWeight: "500", marginBottom: "0.25rem" }}>Advanced Scheduling</h4>
                              <p style={{ fontSize: "0.875rem", color: "#999" }}>
                                Date-based scheduling with rest days, venue allocation, and maximum matches per day
                                constraints.
                              </p>
                            </div>

                            <div
                              style={{
                                backgroundColor: "rgba(0, 0, 0, 0.3)",
                                padding: "0.75rem",
                                borderRadius: "0.5rem",
                                border: "1px solid #333",
                              }}
                            >
                              <h4 style={{ fontWeight: "500", marginBottom: "0.25rem" }}>Interactive Visualization</h4>
                              <p style={{ fontSize: "0.875rem", color: "#999" }}>
                                Dynamic bracket views, standings tables, and schedule displays with real-time updates.
                              </p>
                            </div>

                            <div
                              style={{
                                backgroundColor: "rgba(0, 0, 0, 0.3)",
                                padding: "0.75rem",
                                borderRadius: "0.5rem",
                                border: "1px solid #333",
                              }}
                            >
                              <h4 style={{ fontWeight: "500", marginBottom: "0.25rem" }}>Dynamic Reseeding</h4>
                              <p style={{ fontSize: "0.875rem", color: "#999" }}>
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
                          <div
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.05)",
                              padding: "1rem",
                              borderRadius: "0.5rem",
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                            }}
                          >
                            <h3 style={{ fontSize: "1.125rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                              Academic Significance
                            </h3>
                            <p style={{ color: "#999" }}>
                              This project demonstrates practical applications of various algorithms and data structures
                              studied in our DAA course, including sorting algorithms, graph algorithms, and priority
                              queues. The implementation showcases algorithm analysis, time complexity considerations,
                              and optimization techniques in a real-world application.
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

