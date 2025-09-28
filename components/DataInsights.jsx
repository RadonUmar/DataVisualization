import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, AlertTriangle, GitBranch } from 'lucide-react';

// --- MOCK LLM INSIGHTS LOGIC (In a real app, this is imported from llm_insights_logic.js) ---

// Mock function to simulate the LLM call and return structured data
const mockGenerateInsights = (data) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const columns = Object.keys(data[0] || {});
            resolve({
                recommendations: [
                    { xAxis: columns[0] || 'Time', yAxis: columns[1] || 'Torque', reason: "Reveals the primary performance curve over time." },
                    { xAxis: columns[0] || 'Time', yAxis: columns[2] || 'Voltage', reason: "Monitors battery health and power delivery stability." },
                    { xAxis: columns[3] || 'Speed', yAxis: columns[4] || 'Current', reason: "Shows the relationship between motor speed and required current draw." },
                ],
                analysis: `
# Anomaly Report

Based on the small sample, the following critical observations were made:

1.  **High Torque Command:** The \`${columns[1]}\` metric reached an unusually high **24.73 units** at the beginning of the sample, suggesting a hard launch or sudden acceleration demand.
2.  **Stable Voltage:** The \`${columns[2]}\` values remain stable around **516-517V**, indicating healthy DC Bus performance under initial load.
3.  **Energy Spike:** A noticeable spike in \`Total_Energy\` was detected between time stamps 4447 and 4448, which warrants closer inspection for potential regen events or data corruption.
`,
            });
        }, 1500); // Simulate API latency
    });
};

// --- START: DataInsights Component (Copied from your provided file) ---

const neonCyan = "oklch(0.8 0.25 195)";
const neonOrange = "oklch(0.75 0.3 30)";
const neonPurple = "oklch(0.7 0.25 300)";

// Custom Card Components
const CustomCard = ({ children, className = '' }) => (
    <div className={`p-6 bg-gray-50 rounded-xl shadow-lg backdrop-blur-sm ${className}`}>
        {children}
    </div>
);
const CustomCardHeader = ({ children }) => (
    <div className={`flex flex-col space-y-1.5 p-0`}>
        {children}
    </div>
);
const CustomCardTitle = ({ children, className = '' }) => (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
        {children}
    </h3>
);
const CustomCardDescription = ({ children, className = '' }) => (
    <p className={`text-sm ${className}`}>
        {children}
    </p>
);
const CustomCardContent = ({ children, className = '' }) => (
    <div className={`pt-4 ${className}`}>
        {children}
    </div>
);

// Component for a single clickable recommendation button
const VisualizeButton = ({ xAxis, yAxis, reason, onClick }) => (
    <button
        onClick={() => onClick(xAxis, yAxis)}
        className="flex flex-col text-left p-4 rounded-lg border-2 border-gray-300 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
    >
        <div className="flex items-center justify-between">
            <span className="font-bold text-base text-gray-900 uppercase">
                {yAxis} vs. {xAxis}
            </span>
            <GitBranch className="w-5 h-5 text-gray-600" />
        </div>
        <p className="text-xs mt-1 text-gray-700 font-sans italic">
            {reason}
        </p>
        <span className="text-xs mt-2 text-gray-600 font-mono self-end underline">
            [CLICK TO VISUALIZE]
        </span>
    </button>
);

// DataInsights component (Named export, same as your file)
export function DataInsights({ insights, isLoading, error, onVisualize }) {
  const analysisContent = insights?.analysis || null;
  const recommendations = insights?.recommendations || [];

  return (
    <CustomCard className="animate-fade-in-up glass-card border-neon-orange/20 mt-8">
      <CustomCardHeader>
        <CustomCardTitle className="flex items-center gap-3 text-gray-900 font-mono text-lg">
          <Brain className="h-6 w-6" />
          LLM DRIVEN DATA INSIGHTS
        </CustomCardTitle>
        <CustomCardDescription className="text-gray-700 font-mono">
          {">"} Auto-analysis for recommended graphs and performance anomalies
        </CustomCardDescription>
      </CustomCardHeader>
      <CustomCardContent className="p-6 rounded-lg bg-gray-100 border border-gray-300 shadow-lg">
        {isLoading && (
          <div className="flex items-center gap-4 py-8 justify-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: neonOrange }}></div>
              <div className="absolute inset-0 rounded-full border-2 border-neon-orange/20"></div>
            </div>
            <span className="font-mono text-lg text-gray-800">GENERATING INSIGHTS...</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg border-2 border-red-500 bg-red-900/30 flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-red-400 mt-0.5" />
            <div>
              <p className="font-bold text-red-400 font-mono">INSIGHT GENERATION FAILED</p>
              <p className="text-sm text-red-300 font-mono">{error}</p>
            </div>
          </div>
        )}

        {/* Display Recommendations Section */}
        {recommendations.length > 0 && !isLoading && (
            <div className="mb-8">
                <h4 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2 font-mono">
                    <Sparkles className="inline w-5 h-5 mr-2" />
                    Recommended Visualizations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.map((rec, index) => (
                        <VisualizeButton
                            key={index}
                            xAxis={rec.xAxis}
                            yAxis={rec.yAxis}
                            reason={rec.reason}
                            onClick={onVisualize}
                        />
                    ))}
                </div>
            </div>
        )}

        {/* Display Analysis Section */}
        {analysisContent && !isLoading && (
            <div>
                <h4 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2 font-mono">
                    <AlertTriangle className="inline w-5 h-5 mr-2" />
                    Anomaly & Performance Analysis
                </h4>
                <div className="prose max-w-none text-gray-700 font-mono">
                    <div dangerouslySetInnerHTML={{ __html: analysisContent }} />
                </div>
            </div>
        )}


        {!analysisContent && !isLoading && !error && (
          <div className="py-8 text-center text-gray-600 font-mono">
            <Sparkles className="h-6 w-6 mx-auto mb-2" />
            <p>Upload a CSV file to begin performance analysis.</p>
          </div>
        )}
      </CustomCardContent>
    </CustomCard>
  );
}
// --- END: DataInsights Component ---


// Mock CSV Data based on your earlier interaction
const mockCsvData = [
  { 'TimeStamp': 1718634563547, 'D1_Commanded_Torque': 24.73, 'D1_DC_Bus_Voltage': 517.17, 'D2_Motor_Speed': 310.05, 'IVT_Result_I': 2.15 },
  { 'TimeStamp': 1718634563556, 'D1_Commanded_Torque': 24.6, 'D1_DC_Bus_Voltage': 516.66, 'D2_Motor_Speed': 331.42, 'IVT_Result_I': 2.04 },
  { 'TimeStamp': 1718634563565, 'D1_Commanded_Torque': 24.5, 'D1_DC_Bus_Voltage': 517.15, 'D2_Motor_Speed': 350.11, 'IVT_Result_I': 2.05 },
  { 'TimeStamp': 1718634563574, 'D1_Commanded_Torque': 24.4, 'D1_DC_Bus_Voltage': 516.99, 'D2_Motor_Speed': 370.01, 'IVT_Result_I': 2.08 },
  { 'TimeStamp': 1718634563583, 'D1_Commanded_Torque': 24.3, 'D1_DC_Bus_Voltage': 517.05, 'D2_Motor_Speed': 385.05, 'IVT_Result_I': 2.10 },
];

// --- Mock Data Visualization Component (For full context) ---
const DataVisualization = ({ data, xAxis, yAxis }) => (
    <div className="h-64 bg-gray-800 rounded-xl p-4 flex flex-col justify-center items-center mt-4">
        <h3 className="text-xl font-mono" style={{ color: neonCyan }}>
            Chart Placeholder
        </h3>
        <p className="text-sm font-mono" style={{ color: neonOrange }}>
            Currently Visualizing: **{yAxis}** vs. **{xAxis}**
        </p>
        <p className="text-xs text-gray-500 mt-2">
            (In a real app, this area would render a chart library like Recharts or D3.)
        </p>
    </div>
);


// --- Main Application Component ---
const AppStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');
  :root {
    --neon-cyan: oklch(0.8 0.25 195);
    --neon-orange: oklch(0.75 0.3 30);
    --neon-purple: oklch(0.7 0.25 300);
  }
  body {
    background-color: #121212;
    font-family: 'Inter', sans-serif;
  }
  .font-mono {
    font-family: 'Space Mono', monospace;
  }
  .text-neon-cyan { color: var(--neon-cyan); }
  .text-neon-orange { color: var(--neon-orange); }
  .text-neon-purple { color: var(--neon-purple); }
  .border-neon-cyan\/30 { border-color: rgba(128, 255, 255, 0.3); }
  .bg-neon-cyan\/5 { background-color: rgba(128, 255, 255, 0.05); }
  .hover\:bg-neon-cyan\/10:hover { background-color: rgba(128, 255, 255, 0.1); }
  .border-neon-orange\/20 { border-color: rgba(255, 165, 0, 0.2); }
  .glass-card {
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  }
  .prose h1, .prose h2, .prose h3, .prose h4 { color: var(--neon-orange); border-bottom: 1px solid rgba(255, 165, 0, 0.3); padding-bottom: 0.5rem; }
  .prose strong { color: var(--neon-purple); }
`;


export default function App() {
    // Initial state based on mock CSV columns
    const columns = Object.keys(mockCsvData[0]);
    
    const [csvData, setCsvData] = useState(mockCsvData); 
    const [xAxis, setXAxis] = useState(columns[0]); 
    const [yAxis, setYAxis] = useState(columns[1]); 

    // State for LLM insights
    const [insights, setInsights] = useState(null); 
    const [isInsightsLoading, setIsInsightsLoading] = useState(false);
    const [insightsError, setInsightsError] = useState(null);

    // Effect to run the mock analysis on load
    useEffect(() => {
        const fetchInsights = async () => {
            if (csvData.length === 0) return;
            setIsInsightsLoading(true);
            setInsightsError(null);
            try {
                // In a real app, this would be imported generateInsights(csvData)
                const result = await mockGenerateInsights(csvData); 
                setInsights(result);
            } catch (error) {
                setInsightsError(error.message);
            } finally {
                setIsInsightsLoading(false);
            }
        };
        fetchInsights();
    }, [csvData]);


    const handleVisualize = (newXAxis, newYAxis) => {
        setXAxis(newXAxis);
        setYAxis(newYAxis);
    };
    
    // Renders the component now correctly
    return (
        <>
            <style>{AppStyles}</style>
            <div className="min-h-screen p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-6 text-white text-center">
                        Racecar Telemetry Dashboard
                    </h1>

                    {/* Data Visualization Component */}
                    {csvData.length > 0 && (
                        <DataVisualization 
                            data={csvData} 
                            xAxis={xAxis} 
                            yAxis={yAxis} 
                        />
                    )}

                    {/* LLM Insights Component - This is the fix, ensuring DataInsights is correctly defined and available */}
                    <DataInsights
                        insights={insights}
                        isLoading={isInsightsLoading}
                        error={insightsError}
                        onVisualize={handleVisualize}
                    />

                    {csvData.length === 0 && (
                        <div className="text-center mt-12 text-gray-500">
                            Please upload a CSV file to begin analysis.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
