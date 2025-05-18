"use client"

import { useState, useEffect } from "react"
import CustomizationScreen from "@/components/customization-screen"
import FixtureDisplay from "@/components/fixture-display"
import { AlertCircle, Upload, RefreshCw, ChevronRight } from "lucide-react"

const VALID_TEAM_COUNTS = [2, 4, 8, 16, 32, 64, 128]

export default function TournamentSetup() {
  const [step, setStep] = useState("setup")
  const [numTeams, setNumTeams] = useState(8)
  const [teams, setTeams] = useState([])
  const [teamEntryMethod, setTeamEntryMethod] = useState("manual")
  const [rankingType, setRankingType] = useState("higherBetter")
  const [error, setError] = useState(null)

  const [options, setOptions] = useState({
    seedingMethod: "random",
    schedulingMethod: "basic",
    numVenues: 1,
    avoidTopTeamClashes: false,
    enableDynamicReseeding: false,
    maxMatchesPerDay: 2,
    withdrawnTeams: [],
    startDate: "",
    endDate: "",
    enableRestDays: false,
    restDayInterval: 2,
  })

  useEffect(() => {
    generateEmptyTeams(numTeams)

    const today = new Date()
    const twoWeeksLater = new Date()
    twoWeeksLater.setDate(today.getDate() + 14)

    setOptions((prev) => ({
      ...prev,
      startDate: formatDate(today),
      endDate: formatDate(twoWeeksLater),
    }))
  }, [])

  function formatDate(date) {
    return date.toISOString().split("T")[0]
  }

  function generateEmptyTeams(count) {
    const newTeams = Array(count)
      .fill(null)
      .map((_, i) => ({
        id: i + 1,
        name: `Team ${i + 1}`,
        ranking: 0,
      }))
    setTeams(newTeams)
  }

  function handleNumTeamsChange(value) {
    const teamCount = Number.parseInt(value)
    if (VALID_TEAM_COUNTS.includes(teamCount)) {
      setNumTeams(teamCount)
      setError(null)
      if (teamEntryMethod === "manual") {
        generateEmptyTeams(teamCount)
      }
    } else {
      setError("Please select a valid number of teams (powers of 2: 2, 4, 8, 16, 32, 64, 128)")
    }
  }

  function handleTeamChange(index, field, value) {
    const newTeams = [...teams]
    if (field === "name") {
      newTeams[index].name = value
    } else {
      newTeams[index].ranking = Number.parseInt(value) || 0
    }
    setTeams(newTeams)
  }

  function generateRandomTeams() {
    const randomTeams = Array(numTeams)
      .fill(null)
      .map((_, i) => {
        let ranking
        if (rankingType === "higherBetter") {
          ranking = Math.floor(Math.random() * 1000) + 1000
        } else {
          ranking = i + 1
        }
        return { id: i + 1, name: `Team ${i + 1}`, ranking }
      })
    setTeams(randomTeams)
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result
        const lines = content.split("\n")
        const uploadedTeams = lines
          .map((line, index) => {
            const [name, rankingStr] = line.split(",")
            return {
              id: index + 1, // Ensure each team has a unique ID
              name: name?.trim() || `Team ${index + 1}`,
              ranking: Number.parseInt(rankingStr?.trim() || "0") || 0,
            }
          })
          .slice(0, numTeams)
        if (uploadedTeams.length !== numTeams) {
          setError(`Your file contains ${uploadedTeams.length} teams, but you need exactly ${numTeams} teams.`)
          return
        }
        setTeams(uploadedTeams)
        setError(null)
      }
      reader.readAsText(file)
    }
  }

  function proceedToCustomization() {
    if (teams.length < 2) {
      setError("You need at least 2 teams to create a tournament")
      return
    }
    if (teams.length !== numTeams) {
      setError(`You need exactly ${numTeams} teams for this tournament`)
      return
    }

    // Validate that all teams have an ID
    const invalidTeams = teams.filter((team) => !team || team.id === undefined)
    if (invalidTeams.length > 0) {
      setError("Some teams are missing required ID. Please regenerate teams or fix the data.")
      return
    }

    if (teamEntryMethod === "manual" && teams.some((team) => !team.name)) {
      setError("All teams must have a name")
      return
    }

    setStep("customization")
    setError(null)
  }

  if (step === "customization") {
    return (
      <CustomizationScreen
        teams={teams}
        rankingType={rankingType}
        options={options}
        setOptions={setOptions}
        onBack={() => setStep("setup")}
        setStep={setStep}
      />
    )
  }

  if (step === "display") {
    return (
      <FixtureDisplay
        teams={teams}
        options={options}
        rankingType={rankingType}
        onBack={() => setStep("customization")}
      />
    )
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "64rem",
        margin: "0 auto",
        backgroundColor: "#111",
        borderRadius: "0.5rem",
        border: "1px solid #333",
      }}
    >
      <div style={{ padding: "1rem", borderBottom: "1px solid #333" }}>
        <div style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.25rem" }}>Tournament Setup</div>
        <div style={{ fontSize: "0.875rem", color: "#999" }}>Enter the basic details for your tournament</div>
      </div>
      <div style={{ padding: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {error && (
            <div
              style={{
                padding: "0.75rem",
                backgroundColor: "rgba(220, 38, 38, 0.1)",
                borderRadius: "0.25rem",
                color: "#ef4444",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <AlertCircle size={16} />
                <div>{error}</div>
              </div>
            </div>
          )}

          <div>
            <label
              style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}
              htmlFor="numTeams"
            >
              Number of Teams
            </label>
            <select
              id="numTeams"
              value={numTeams.toString()}
              onChange={(e) => handleNumTeamsChange(e.target.value)}
              style={{
                maxWidth: "16rem",
                padding: "0.5rem",
                backgroundColor: "#222",
                border: "1px solid #333",
                borderRadius: "0.25rem",
                color: "white",
              }}
            >
              {VALID_TEAM_COUNTS.map((count) => (
                <option key={count} value={count.toString()}>
                  {count} teams
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
              Ranking Type
            </label>
            <div style={{ display: "flex", gap: "1rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="radio"
                  name="rankingType"
                  value="higherBetter"
                  checked={rankingType === "higherBetter"}
                  onChange={() => setRankingType("higherBetter")}
                />
                Higher is Better (e.g., 1500, 1400...)
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="radio"
                  name="rankingType"
                  value="lowerBetter"
                  checked={rankingType === "lowerBetter"}
                  onChange={() => setRankingType("lowerBetter")}
                />
                Lower is Better (e.g., 1, 2, 3...)
              </label>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
              Team Entry Method
            </label>
            <div>
              <div style={{ display: "flex", borderBottom: "1px solid #333" }}>
                <button
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: teamEntryMethod === "manual" ? "#222" : "transparent",
                    border: "none",
                    borderBottom: teamEntryMethod === "manual" ? "2px solid white" : "none",
                    color: teamEntryMethod === "manual" ? "white" : "#999",
                    cursor: "pointer",
                  }}
                  onClick={() => setTeamEntryMethod("manual")}
                >
                  Manual Entry
                </button>
                <button
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: teamEntryMethod === "file" ? "#222" : "transparent",
                    border: "none",
                    borderBottom: teamEntryMethod === "file" ? "2px solid white" : "none",
                    color: teamEntryMethod === "file" ? "white" : "#999",
                    cursor: "pointer",
                  }}
                  onClick={() => setTeamEntryMethod("file")}
                >
                  File Upload
                </button>
                <button
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: teamEntryMethod === "random" ? "#222" : "transparent",
                    border: "none",
                    borderBottom: teamEntryMethod === "random" ? "2px solid white" : "none",
                    color: teamEntryMethod === "random" ? "white" : "#999",
                    cursor: "pointer",
                  }}
                  onClick={() => setTeamEntryMethod("random")}
                >
                  Random Generation
                </button>
              </div>

              <div style={{ marginTop: "1rem" }}>
                {teamEntryMethod === "manual" && (
                  <div>
                    <div style={{ maxHeight: "20rem", overflowY: "auto", paddingRight: "0.5rem" }}>
                      <table style={{ width: "100%" }}>
                        <thead>
                          <tr>
                            <th style={{ textAlign: "left", paddingBottom: "0.5rem" }}>Team Name</th>
                            <th style={{ textAlign: "left", paddingBottom: "0.5rem" }}>Ranking</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array(numTeams)
                            .fill(null)
                            .map((_, index) => (
                              <tr key={index} style={{ borderBottom: "1px solid #333" }}>
                                <td style={{ paddingRight: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem" }}>
                                  <input
                                    style={{
                                      width: "100%",
                                      padding: "0.5rem",
                                      backgroundColor: "#222",
                                      border: "1px solid #333",
                                      borderRadius: "0.25rem",
                                      color: "white",
                                    }}
                                    placeholder={`Team ${index + 1}`}
                                    value={teams[index]?.name || ""}
                                    onChange={(e) => handleTeamChange(index, "name", e.target.value)}
                                  />
                                </td>
                                <td style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}>
                                  <input
                                    style={{
                                      width: "100%",
                                      padding: "0.5rem",
                                      backgroundColor: "#222",
                                      border: "1px solid #333",
                                      borderRadius: "0.25rem",
                                      color: "white",
                                    }}
                                    type="number"
                                    placeholder="0"
                                    value={teams[index]?.ranking || 0}
                                    onChange={(e) => handleTeamChange(index, "ranking", e.target.value)}
                                  />
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {teamEntryMethod === "file" && (
                  <div>
                    <p style={{ fontSize: "0.875rem", color: "#999", marginBottom: "1rem" }}>
                      Upload a CSV file with team names and rankings (format: "Team Name, Ranking")
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                      <label
                        htmlFor="file-upload"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                          height: "8rem",
                          border: "2px dashed #333",
                          borderRadius: "0.25rem",
                          cursor: "pointer",
                          backgroundColor: "#222",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "1.25rem 0 1.5rem",
                          }}
                        >
                          <Upload size={32} style={{ marginBottom: "0.5rem", color: "#999" }} />
                          <p style={{ marginBottom: "0.5rem", fontSize: "0.875rem", color: "#999" }}>
                            <span style={{ fontWeight: "600" }}>Click to upload</span> or drag and drop
                          </p>
                          <p style={{ fontSize: "0.75rem", color: "#999" }}>CSV file with team data</p>
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          accept=".csv"
                          style={{ display: "none" }}
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                    {teams.length > 0 && (
                      <div style={{ marginTop: "1rem" }}>
                        <p style={{ fontWeight: "500", marginBottom: "0.5rem" }}>Uploaded Teams:</p>
                        <div style={{ maxHeight: "10rem", overflowY: "auto" }}>
                          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                            {teams.map((team, index) => (
                              <li key={index} style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                                {team.name} (Ranking: {team.ranking})
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {teamEntryMethod === "random" && (
                  <div>
                    <p style={{ fontSize: "0.875rem", color: "#999", marginBottom: "1rem" }}>
                      Generate random team names and rankings
                    </p>
                    <button
                      onClick={generateRandomTeams}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 1rem",
                        backgroundColor: "transparent",
                        color: "white",
                        borderRadius: "0.25rem",
                        border: "1px solid #333",
                        cursor: "pointer",
                      }}
                    >
                      <RefreshCw size={16} />
                      Generate Random Teams
                    </button>
                    {teams.length > 0 && (
                      <div style={{ marginTop: "1rem" }}>
                        <p style={{ fontWeight: "500", marginBottom: "0.5rem" }}>Generated Teams:</p>
                        <div
                          style={{
                            maxHeight: "15rem",
                            overflowY: "auto",
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: "0.5rem",
                          }}
                        >
                          {teams.map((team, index) => (
                            <div
                              key={index}
                              style={{
                                fontSize: "0.875rem",
                                padding: "0.5rem",
                                backgroundColor: "#222",
                                borderRadius: "0.25rem",
                              }}
                            >
                              {team.name} (Ranking: {team.ranking})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          padding: "1rem",
          display: "flex",
          justifyContent: "flex-end",
          borderTop: "1px solid #333",
        }}
      >
        <button
          onClick={proceedToCustomization}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            backgroundColor: "white",
            color: "black",
            borderRadius: "0.25rem",
            fontWeight: "500",
            cursor: "pointer",
            border: "none",
          }}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
