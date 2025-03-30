"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Info, Ban } from "lucide-react"
import type { Team, TournamentOptions } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CustomizationScreenProps {
  teams: Team[]
  tournamentType: "knockout" | "roundRobin" | "hybridFixture"
  rankingType: "higherBetter" | "lowerBetter"
  options: TournamentOptions
  setOptions: (options: TournamentOptions) => void
  onBack: () => void
  setStep: (step: "setup" | "customization" | "display") => void
}

export default function CustomizationScreen({
  teams,
  tournamentType,
  rankingType,
  options,
  setOptions,
  onBack,
  setStep,
}: CustomizationScreenProps) {
  const handleOptionChange = (key: keyof TournamentOptions, value: any) => {
    setOptions({ ...options, [key]: value })
  }

  const generateFixture = () => {
    setStep("display")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Customize Tournament</CardTitle>
          <CardDescription>Configure how the tournament fixture is generated</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {tournamentType !== "knockout" && (
            <Alert>
              <AlertTitle>Feature Not Available</AlertTitle>
              <AlertDescription>
                {tournamentType === "roundRobin"
                  ? "Round Robin tournaments are not implemented yet."
                  : "Hybrid Fixture tournaments are not implemented yet."}
                Please select Knockout tournament type.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-medium">Knockout Tournament Options</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm p-4">
                    <p className="font-medium mb-1">Knockout Tournament:</p>
                    <ul className="text-sm space-y-1 list-disc pl-4">
                      <li>Single elimination format.</li>
                      <li>Teams are seeded based on the selected method.</li>
                      <li>Top teams can be placed on opposite ends.</li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="seedingMethod">Seeding Method</Label>
                <Select
                  value={options.seedingMethod}
                  onValueChange={(value) => handleOptionChange("seedingMethod", value)}
                >
                  <SelectTrigger id="seedingMethod">
                    <SelectValue placeholder="Select seeding method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="random">Random Seeding</SelectItem>
                    <SelectItem value="mergeSort">Ranked Seeding (Merge Sort)</SelectItem>
                    <SelectItem value="quickSort">Ranked Seeding (Quick Sort)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Choose how teams are seeded in the tournament</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="avoidTopTeamClashes"
                    checked={options.avoidTopTeamClashes}
                    onCheckedChange={(checked) => handleOptionChange("avoidTopTeamClashes", checked === true)}
                    disabled={true}
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label htmlFor="avoidTopTeamClashes" className="text-muted-foreground flex items-center gap-2">
                          Avoid early top-team clashes
                          <Ban className="h-4 w-4 text-red-500" />
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>To be implemented in future updates</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground pl-6">This feature is not available yet</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-medium">Venue Options</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm p-4">
                    <p className="font-medium mb-1">Scheduling Methods:</p>
                    <ul className="text-sm space-y-1 list-disc pl-4">
                      <li>
                        <span className="font-medium">Basic:</span> Assigns matches sequentially without optimization.
                      </li>
                      <li>
                        <span className="font-medium">Graph Coloring:</span> Not implemented yet.
                      </li>
                      <li>
                        <span className="font-medium">Hamiltonian Path:</span> Not implemented yet.
                      </li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="schedulingMethod">Scheduling Method</Label>
                <Select
                  value={options.schedulingMethod}
                  onValueChange={(value) => handleOptionChange("schedulingMethod", value)}
                >
                  <SelectTrigger id="schedulingMethod">
                    <SelectValue placeholder="Select scheduling method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic Scheduling</SelectItem>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SelectItem
                            value="graphColoring"
                            disabled
                            className="flex items-center gap-2 text-muted-foreground"
                          >
                            <span>Graph Coloring</span>
                            <Ban className="h-4 w-4 text-red-500" />
                          </SelectItem>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>To be implemented in future updates</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SelectItem
                            value="hamiltonianPath"
                            disabled
                            className="flex items-center gap-2 text-muted-foreground"
                          >
                            <span>Hamiltonian Path</span>
                            <Ban className="h-4 w-4 text-red-500" />
                          </SelectItem>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>To be implemented in future updates</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Only Basic Scheduling is available</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numVenues">Number of Venues</Label>
                <Input
                  id="numVenues"
                  type="number"
                  min="1"
                  value={options.numVenues}
                  onChange={(e) => handleOptionChange("numVenues", Number.parseInt(e.target.value) || 1)}
                  disabled={true}
                  className="max-w-xs"
                />
                <p className="text-sm text-muted-foreground">This feature is not available yet</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-medium">Dynamic Updates</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm p-4">
                    <p className="font-medium mb-1">Dynamic Updates:</p>
                    <ul className="text-sm space-y-1 list-disc pl-4">
                      <li>
                        <span className="font-medium">Priority Queue:</span> Not implemented yet.
                      </li>
                      <li>Allows simulation of team withdrawals.</li>
                      <li>Automatically adjusts the schedule.</li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableDynamicReseeding"
                  checked={options.enableDynamicReseeding}
                  onCheckedChange={(checked) => handleOptionChange("enableDynamicReseeding", checked === true)}
                  disabled={true}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label htmlFor="enableDynamicReseeding" className="text-muted-foreground flex items-center gap-2">
                        Enable Dynamic Reseeding
                        <Ban className="h-4 w-4 text-red-500" />
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>To be implemented in future updates</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm text-muted-foreground pl-6">Automatically adjust brackets when teams withdraw</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={generateFixture}
            className="flex items-center gap-2"
            disabled={tournamentType !== "knockout"}
          >
            Generate Fixture
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

