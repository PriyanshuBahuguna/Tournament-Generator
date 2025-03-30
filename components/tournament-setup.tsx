"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, RefreshCw, ChevronRight, AlertCircle, HelpCircle, Ban } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import CustomizationScreen from "@/components/customization-screen"
import FixtureDisplay from "@/components/fixture-display"
import type { Team, TournamentOptions } from "@/lib/types"

const VALID_TEAM_COUNTS = [2, 4, 8, 16, 32, 64, 128]

export default function TournamentSetup() {
  const [step, setStep] = useState<"setup" | "customization" | "display">("setup")
  const [numTeams, setNumTeams] = useState<number>(8)
  const [teams, setTeams] = useState<Team[]>([])
  const [tournamentType, setTournamentType] = useState<"knockout" | "roundRobin" | "hybridFixture">("knockout")
  const [teamEntryMethod, setTeamEntryMethod] = useState<"manual" | "file" | "random">("manual")
  const [rankingType, setRankingType] = useState<"higherBetter" | "lowerBetter">("higherBetter")
  const [error, setError] = useState<string | null>(null)
  // Add options state
  const [options, setOptions] = useState<TournamentOptions>({
    tournamentType: "knockout",
    seedingMethod: "random",
    schedulingMethod: "basic",
    numVenues: 1,
    avoidTopTeamClashes: false,
    enableDynamicReseeding: false,
    maxMatchesPerDay: 4,
  })

  useEffect(() => {
    generateEmptyTeams(numTeams)
  }, [])

  const generateEmptyTeams = (count: number) => {
    const newTeams = Array(count)
      .fill(null)
      .map((_, i) => ({
        id: i + 1,
        name: `Team ${i + 1}`,
        ranking: 0,
      }))
    setTeams(newTeams)
  }

  const handleNumTeamsChange = (value: string) => {
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

  const handleTeamChange = (index: number, field: "name" | "ranking", value: string) => {
    const newTeams = [...teams]
    if (field === "name") {
      newTeams[index].name = value
    } else {
      newTeams[index].ranking = Number.parseInt(value) || 0
    }
    setTeams(newTeams)
  }

  const generateRandomTeams = () => {
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        const lines = content.split("\n")
        const uploadedTeams = lines
          .map((line, index) => {
            const [name, rankingStr] = line.split(",")
            return {
              id: index + 1,
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

  const proceedToCustomization = () => {
    if (teams.length < 2) {
      setError("You need at least 2 teams to create a tournament")
      return
    }
    if (teams.length !== numTeams) {
      setError(`You need exactly ${numTeams} teams for this tournament`)
      return
    }
    if (teamEntryMethod === "manual" && teams.some((team) => !team.name)) {
      setError("All teams must have a name")
      return
    }
    setOptions((prev) => ({ ...prev, tournamentType })) // Sync tournamentType
    setStep("customization")
    setError(null)
  }

  return (
    <AnimatePresence mode="wait">
      {step === "setup" && (
        <motion.div
          key="setup"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="w-full max-w-4xl mx-auto bg-card">
            <CardHeader>
              <CardTitle>Tournament Setup</CardTitle>
              <CardDescription>Enter the basic details for your tournament</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="numTeams">Number of Teams</Label>
                  <Select value={numTeams.toString()} onValueChange={handleNumTeamsChange}>
                    <SelectTrigger id="numTeams" className="max-w-xs">
                      <SelectValue placeholder="Select number of teams" />
                    </SelectTrigger>
                    <SelectContent>
                      {VALID_TEAM_COUNTS.map((count) => (
                        <SelectItem key={count} value={count.toString()}>
                          {count} teams
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Tournament brackets work best with powers of 2 (2, 4, 8, 16, 32, 64, 128)
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label className="mr-2">Tournament Type</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm p-4">
                          <p className="font-medium mb-1">Tournament Types:</p>
                          <ul className="text-sm space-y-1 list-disc pl-4">
                            <li>
                              <span className="font-medium">Knockout:</span> Single elimination tournament.
                            </li>
                            <li>
                              <span className="font-medium">Round Robin:</span> Each team plays every other team (Not
                              implemented yet).
                            </li>
                            <li>
                              <span className="font-medium">Hybrid Fixture:</span> League + playoffs (Not implemented
                              yet).
                            </li>
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <RadioGroup
                    defaultValue={tournamentType}
                    onValueChange={(value) => setTournamentType(value as "knockout" | "roundRobin" | "hybridFixture")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="knockout" id="knockout" />
                      <Label htmlFor="knockout">Knockout</Label>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-2 relative">
                            <RadioGroupItem value="roundRobin" id="roundRobin" disabled />
                            <Label htmlFor="roundRobin" className="text-muted-foreground">
                              Round Robin
                            </Label>
                            <Ban className="h-4 w-4 text-red-500 absolute -left-1 top-0" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>To be implemented in future updates</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-2 relative">
                            <RadioGroupItem value="hybridFixture" id="hybridFixture" disabled />
                            <Label htmlFor="hybridFixture" className="text-muted-foreground">
                              Hybrid Fixture
                            </Label>
                            <Ban className="h-4 w-4 text-red-500 absolute -left-1 top-0" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>To be implemented in future updates</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Ranking Type</Label>
                  <RadioGroup
                    defaultValue={rankingType}
                    onValueChange={(value) => setRankingType(value as "higherBetter" | "lowerBetter")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="higherBetter" id="higherBetter" />
                      <Label htmlFor="higherBetter">Higher is Better (e.g., 1500, 1400...)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lowerBetter" id="lowerBetter" />
                      <Label htmlFor="lowerBetter">Lower is Better (e.g., 1, 2, 3...)</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-4">
                  <Label>Team Entry Method</Label>
                  <Tabs
                    defaultValue={teamEntryMethod}
                    onValueChange={(value) => setTeamEntryMethod(value as "manual" | "file" | "random")}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                      <TabsTrigger value="file">File Upload</TabsTrigger>
                      <TabsTrigger value="random">Random Generation</TabsTrigger>
                    </TabsList>
                    <TabsContent value="manual" className="mt-4">
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">Enter team names and rankings manually</p>
                        <div className="max-h-80 overflow-y-auto pr-2">
                          <table className="w-full">
                            <thead>
                              <tr>
                                <th className="text-left pb-2">Team Name</th>
                                <th className="text-left pb-2">Ranking</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Array(numTeams)
                                .fill(null)
                                .map((_, index) => (
                                  <tr key={index} className="border-b border-border">
                                    <td className="py-2 pr-4">
                                      <Input
                                        placeholder={`Team ${index + 1}`}
                                        value={teams[index]?.name || ""}
                                        onChange={(e) => handleTeamChange(index, "name", e.target.value)}
                                      />
                                    </td>
                                    <td className="py-2">
                                      <Input
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
                    </TabsContent>
                    <TabsContent value="file" className="mt-4">
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Upload a CSV file with team names and rankings (format: "Team Name, Ranking")
                        </p>
                        <div className="flex items-center justify-center w-full">
                          <label
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent/50"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground">CSV file with team data</p>
                            </div>
                            <input
                              id="file-upload"
                              type="file"
                              accept=".csv"
                              className="hidden"
                              onChange={handleFileUpload}
                            />
                          </label>
                        </div>
                        {teams.length > 0 && (
                          <div className="mt-4">
                            <p className="font-medium mb-2">Uploaded Teams:</p>
                            <div className="max-h-40 overflow-y-auto">
                              <ul className="space-y-1">
                                {teams.map((team, index) => (
                                  <li key={index} className="text-sm">
                                    {team.name} (Ranking: {team.ranking})
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="random" className="mt-4">
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">Generate random team names and rankings</p>
                        <Button onClick={generateRandomTeams} variant="outline" className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4" />
                          Generate Random Teams
                        </Button>
                        {teams.length > 0 && (
                          <div className="mt-4">
                            <p className="font-medium mb-2">Generated Teams:</p>
                            <div className="max-h-60 overflow-y-auto grid grid-cols-2 gap-2">
                              {teams.map((team, index) => (
                                <div key={index} className="text-sm p-2 bg-accent/20 rounded">
                                  {team.name} (Ranking: {team.ranking})
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={proceedToCustomization} className="flex items-center gap-2">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      {step === "customization" && (
        <CustomizationScreen
          teams={teams}
          tournamentType={tournamentType}
          rankingType={rankingType}
          options={options}
          setOptions={setOptions}
          onBack={() => setStep("setup")}
          setStep={setStep}
        />
      )}

      {step === "display" && (
        <FixtureDisplay
          teams={teams}
          options={options}
          rankingType={rankingType}
          onBack={() => setStep("customization")}
        />
      )}
    </AnimatePresence>
  )
}

