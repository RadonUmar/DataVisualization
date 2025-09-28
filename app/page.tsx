"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react" // <-- Added useEffect
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, BarChart3, Zap, Activity, Database, TrendingUp } from "lucide-react"
import Papa from "papaparse"
import { DataVisualization } from "@/components/data-visualization"

// New Imports for LLM Feature
import { generateInsights } from "@/utils//llm_insights_logic.js" // <-- FIX: Changed import path to relative path
import { DataInsights } from "@/components/DataInsights" // <-- Import the new component

// Define the shape of your data
interface CSVData {
  [key: string]: string | number
}

// Define the shape of the LLM response data (must match the structure in lib/llm-analysis.ts)
interface InsightRecommendation {
    xAxis: string;
    yAxis: string;
    reason: string;
}

interface InsightsData {
    recommendations: InsightRecommendation[];
    analysis: string;
}


export default function RacecarDataVisualizer() {
  const [csvData, setCsvData] = useState<CSVData[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [numericColumns, setNumericColumns] = useState<string[]>([])
  const [xAxis, setXAxis] = useState<string>("")
  const [yAxis, setYAxis] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false) // For CSV parsing
  const [fileName, setFileName] = useState<string>("")

  // --- LLM State ---
  const [insights, setInsights] = useState<InsightsData | null>(null) 
  const [isInsightsLoading, setIsInsightsLoading] = useState(false)
  const [insightsError, setInsightsError] = useState<string | null>(null)
  // --- End LLM State ---


  // Function to handle the visualization click from the insights component
  const handleVisualize = (newXAxis: string, newYAxis: string) => {
    setXAxis(newXAxis)
    setYAxis(newYAxis)
  }


  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    // IMPORTANT: Clear old insights when a new file is uploaded
    setInsights(null);
    setInsightsError(null); 
    setFileName(file.name)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as CSVData[]
        const headerKeys = Object.keys(data[0] || {})

        // Convert numeric strings to numbers and identify numeric columns
        const processedData = data.map((row) => {
          const processedRow: CSVData = {}
          Object.entries(row).forEach(([key, value]) => {
            const numValue = parseFloat(String(value))
            // Only convert if it's a valid number and not an empty string
            processedRow[key] = !isNaN(numValue) && value !== "" ? numValue : value
          })
          return processedRow
        })

        // Identify numeric columns
        const numericCols = headerKeys.filter((header) => {
          return processedData.some((row) => typeof row[header] === "number")
        })

        setCsvData(processedData)
        setHeaders(headerKeys)
        setNumericColumns(numericCols)

        // Set default axes if available
        if (numericCols.includes("TimeStamp")) {
          setXAxis("TimeStamp")
        } else if (numericCols.length > 0) {
          setXAxis(numericCols[0])
        }

        if (numericCols.includes("D1_Commanded_Torque")) {
          setYAxis("D1_Commanded_Torque")
        } else if (numericCols.length > 1) {
          setYAxis(numericCols[1])
        }

        setIsLoading(false)
      },
      error: (error) => {
        console.error("Error parsing CSV:", error)
        setIsLoading(false)
      },
    })
  }, [])

  // --- LLM Insight Generation Effect ---
  useEffect(() => {
    const fetchInsights = async () => {
      // Only run analysis if we have data and CSV parsing is complete
      if (csvData.length === 0 || isLoading) return 

      setIsInsightsLoading(true)
      setInsightsError(null)

      try {
        const result = await generateInsights(csvData)
        setInsights(result)
      } catch (error) {
        // Handle API/network errors
        console.error("LLM Insight Error:", error)
        setInsightsError(error instanceof Error ? error.message : "An unknown error occurred during analysis.")
      } finally {
        setIsInsightsLoading(false)
      }
    }
    
    // Trigger analysis when the data is loaded
    if (csvData.length > 0) {
        fetchInsights()
    }
  }, [csvData, isLoading]) // Dependency array: Re-run when csvData or CSV loading status changes


  const previewData = csvData.slice(0, 10)

  return (
    <div className="min-h-screen cyberpunk-bg relative overflow-hidden">
      <div className="absolute inset-0 grid-lines pointer-events-none" />

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 glass-card rounded-2xl neon-glow">
              <Zap className="h-10 w-10 text-neon-cyan" />
            </div>
            <h1
              className="text-6xl font-bold text-balance bg-gradient-to-r from-gray-600 via-gray-900 to-black bg-clip-text text-transparent glitch-text"
              data-text="RACECAR DATA VISUALIZER"
            >
              DATA VISUALIZER
            </h1>
          </div>
          <p className="text-xl text-neon-cyan/80 text-pretty max-w-3xl mx-auto font-mono">
            {">"} Upload telemetry data and visualize performance metrics with real-time analytics
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground font-mono">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-neon-orange" />
              <span>REAL-TIME</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-neon-purple" />
              <span>CSV PARSING</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-neon-cyan" />
              <span>ANALYTICS</span>
            </div>
          </div>
        </div>


        <Card className="mb-8 animate-fade-in-up glass-card border-neon-cyan/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-neon-cyan font-mono text-lg">
              <Upload className="h-6 w-6" />
              DATA UPLOAD INTERFACE
            </CardTitle>
            <CardDescription className="text-muted-foreground font-mono">
              {">"} Initialize CSV telemetry data stream
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-neon-cyan/30 rounded-xl cursor-pointer glass-card hover:border-neon-cyan/50 transition-all duration-300 group py-6">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Upload className="w-12 h-12 text-neon-cyan group-hover:scale-110 transition-transform duration-300" />
                  <p className="text-lg text-neon-cyan font-mono">
                    <span className="font-bold">DRAG & DROP</span> or click to upload
                  </p>
                  <p className="text-sm text-muted-foreground font-mono">CSV files only • Max 10MB</p>
                </div>
                {fileName && (
                  <div className="mt-4 px-4 py-2 bg-neon-cyan/10 rounded-lg border border-neon-cyan/20">
                    <p className="text-sm text-neon-cyan font-mono">{fileName}</p>
                  </div>
                )}
                <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} disabled={isLoading} />
              </label>
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <Card className="mb-8 glass-card border-neon-orange/20">
            <CardContent className="flex items-center justify-center py-12">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-orange"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-neon-orange/20"></div>
                </div>
                <span className="text-neon-orange font-mono text-lg">PROCESSING DATA STREAM...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {csvData.length > 0 && (
          <>
            <Card className="mb-8 animate-fade-in-up glass-card border-neon-purple/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-neon-purple font-mono text-lg">
                  <Database className="h-6 w-6" />
                  DATA PREVIEW MATRIX
                </CardTitle>
                <CardDescription className="text-muted-foreground font-mono">
                  {">"} Displaying first 10 rows • Total records: {csvData.length.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-neon-purple/20 overflow-hidden glass-card">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-neon-purple/5 border-neon-purple/20">
                          {headers.map((header) => (
                            <TableHead key={header} className="font-mono font-bold text-neon-purple whitespace-nowrap">
                              {header.toUpperCase()}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.map((row, index) => (
                          <TableRow
                            key={index}
                            className="hover:bg-neon-purple/5 border-neon-purple/10 transition-colors"
                          >
                            {headers.map((header) => (
                              <TableCell key={header} className="font-mono text-sm text-foreground/90">
                                {typeof row[header] === "number" ? (
                                  <span className="text-neon-cyan">{row[header].toLocaleString()}</span>
                                ) : (
                                  <span className="text-muted-foreground">{String(row[header])}</span>
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8 animate-fade-in-up glass-card border-neon-orange/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-neon-orange font-mono text-lg">
                  <BarChart3 className="h-6 w-6" />
                  VISUALIZATION PARAMETERS
                </CardTitle>
                <CardDescription className="text-muted-foreground font-mono">
                  {">"} Configure axis mapping for data visualization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-mono font-bold text-neon-cyan">X-AXIS PARAMETER</label>
                    <Select value={xAxis} onValueChange={setXAxis}>
                      <SelectTrigger className="glass-card border-neon-cyan/20 font-mono">
                        <SelectValue placeholder="Select X-axis column" />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-neon-cyan/20">
                        {numericColumns
                          .filter((column) => column !== "")
                          .map((column) => (
                            <SelectItem key={column} value={column} className="font-mono">
                              {column.toUpperCase()}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-mono font-bold text-neon-orange">Y-AXIS PARAMETER</label>
                    <Select value={yAxis} onValueChange={setYAxis}>
                      <SelectTrigger className="glass-card border-neon-orange/20 font-mono">
                        <SelectValue placeholder="Select Y-axis column" />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-neon-orange/20">
                        {numericColumns
                          .filter((column) => column !== "")
                          .map((column) => (
                            <SelectItem key={column} value={column} className="font-mono">
                              {column.toUpperCase()}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* --- NEW: Data Insights Component is placed here, before the main graph --- */}
            {xAxis && yAxis && (
              <>
                <Card className="animate-fade-in-up glass-card border-neon-cyan/20 neon-glow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-neon-cyan font-mono text-lg">
                      <TrendingUp className="h-6 w-6" />
                      REAL-TIME ANALYTICS DISPLAY
                    </CardTitle>
                    <CardDescription className="text-muted-foreground font-mono">
                      {">"} {yAxis.toUpperCase()} vs {xAxis.toUpperCase()} • Live data visualization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DataVisualization data={csvData} xAxis={xAxis} yAxis={yAxis} />
                  </CardContent>
                </Card>
                <DataInsights
                    insights={insights}
                    isLoading={isInsightsLoading}
                    error={insightsError}
                    onVisualize={handleVisualize}
                />
              </>
            )}
            {/* ----------------------------------- */}
          </>
        )}
      </div>
    </div>
  )
}