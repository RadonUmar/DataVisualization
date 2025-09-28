"use client"

import React, { useRef, useMemo } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"
import { Line } from "react-chartjs-2"
import { Zap } from 'lucide-react';

// Register all necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface DataVisualizationProps {
  data: Array<{ [key: string]: string | number }>
  xAxis: string
  yAxis: string
}

/**
 * Renders a neon-themed line chart visualization using Chart.js and React-Chartjs-2.
 * It expects data as an array of objects and the keys for the X and Y axes.
 */
export function DataVisualization({ data, xAxis, yAxis }: DataVisualizationProps) {
  const chartRef = useRef<ChartJS<"line">>(null)

  // Define neon colors using oklch for better CSS variable usage
  const neonCyan = "oklch(0.8 0.25 195)"
  const neonOrange = "oklch(0.75 0.3 30)"
  const neonPurple = "oklch(0.7 0.25 300)"
  const neonPink = "oklch(0.75 0.25 330)"

  // 1. Prepare chart data and memoize for performance and stability
  const chartDataPoints = useMemo(() => {
    return data.map((row) => {
      const xVal = row[xAxis];
      const yVal = row[yAxis];

      // Robust parsing: convert to string first, then float. Check if the result is a finite number.
      const xValue = xVal != null ? parseFloat(String(xVal)) : NaN;
      const yValue = yVal != null ? parseFloat(String(yVal)) : NaN;

      if (!isFinite(xValue) || !isFinite(yValue)) {
        return null; // Skip invalid or non-existent data points
      }
      return { x: xValue, y: yValue };
    }).filter(Boolean) as { x: number; y: number }[];
  }, [data, xAxis, yAxis]);

  // 2. Handle empty data state (e.g., if columns don't exist or contain no numbers)
  if (chartDataPoints.length === 0) {
    return (
      <div 
        className="w-full h-96 flex flex-col items-center justify-center p-6 rounded-xl font-mono transition-all duration-500"
        style={{
          backgroundColor: 'oklch(0.05 0.01 240)', // Very dark blue/black background
          border: `2px dashed ${neonPink}`,
          boxShadow: `0 0 15px ${neonPink}80`
        }}
      >
        <Zap color={neonPink} size={48} className="animate-pulse mb-4" />
        <p className="text-xl font-bold mb-2" style={{ color: neonOrange }}>DATA VISUALIZATION ERROR</p>
        <p className="text-sm text-center" style={{ color: neonCyan }}>
          No valid numerical data points found for X: **"{xAxis}"** and Y: **"{yAxis}"**.
          <br />
          Please verify that both columns exist and contain numerical values.
        </p>
      </div>
    );
  }

  const chartData = {
    datasets: [
      {
        label: yAxis.toUpperCase(),
        data: chartDataPoints,
        borderColor: neonCyan,
        backgroundColor: `${neonCyan}20`,
        borderWidth: 3,
        pointRadius: 4, 
        pointHoverRadius: 8,
        pointBackgroundColor: neonCyan,
        pointBorderColor: neonOrange,
        pointBorderWidth: 2,
        pointHoverBackgroundColor: neonOrange,
        pointHoverBorderColor: neonCyan,
        pointHoverBorderWidth: 3,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // 3. Calculate dynamic Y scale range with padding
  const yValues = chartDataPoints.map(point => point.y);
  let minY = 0;
  let maxY = 1;

  if (yValues.length > 0) {
    minY = Math.min(...yValues);
    maxY = Math.max(...yValues);

    const yRange = maxY - minY;

    if (yRange === 0) {
      // If all y values are the same, expand range slightly
      minY = minY - 1 > 0 ? minY - 1 : 0; 
      maxY += 1;
    } else {
      // Add padding to y-axis (15% padding)
      const padding = yRange * 0.15;
      minY = minY - padding > 0 ? minY - padding : 0; 
      maxY += padding;
    }
  }

  // 4. Memoize chart options (including dynamic min/max)
  const options: ChartOptions<"line"> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: neonCyan,
          font: {
            family: "Inter, monospace",
            size: 14,
            weight: "bold" as const,
          },
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
        },
      },
      title: {
        display: true,
        text: `${yAxis.toUpperCase()} vs ${xAxis.toUpperCase()}`,
        color: neonOrange,
        font: {
          family: "Inter, monospace",
          size: 18,
          weight: "bold" as const,
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        backgroundColor: "oklch(0.1 0.04 240 / 0.95)",
        titleColor: neonCyan,
        bodyColor: neonOrange,
        borderColor: neonCyan,
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: true,
        titleFont: {
          family: "Inter, monospace",
          size: 14,
          weight: "bold" as const,
        },
        bodyFont: {
          family: "Inter, monospace",
          size: 13,
        },
        padding: 12,
        callbacks: {
          title: (context) => {
            if (context.length > 0 && context[0].parsed) {
              return `>> X (${xAxis.toUpperCase()}): ${Number(context[0].parsed.x).toLocaleString()}`;
            }
            return `>> X (${xAxis.toUpperCase()}): N/A`;
          },
          label: (context) => {
            if (context.parsed) {
              return `   Y (${yAxis.toUpperCase()}): ${Number(context.parsed.y).toLocaleString()}`;
            }
            return `   Y (${yAxis.toUpperCase()}): N/A`;
          },
          beforeBody: () => "--- Data Point Analysis ---",
        },
      },
    },
    scales: {
      x: {
        type: "linear",
        display: true,
        title: {
          display: true,
          text: `>> X-Axis: ${xAxis.toUpperCase()}`,
          color: neonPurple,
          font: {
            family: "Inter, monospace",
            weight: "bold" as const,
            size: 14,
          },
        },
        ticks: {
          color: neonCyan,
          font: {
            family: "Inter, monospace",
            size: 11,
          },
          maxTicksLimit: 10,
        },
        grid: {
          color: `${neonCyan}30`,
          lineWidth: 1,
          drawTicks: true,
        },
        border: {
          color: neonCyan,
          width: 2,
        },
      },
      y: {
        min: minY, 
        max: maxY, 
        display: true,
        title: {
          display: true,
          text: `>> Y-Axis: ${yAxis.toUpperCase()}`,
          color: neonOrange,
          font: {
            family: "Inter, monospace",
            weight: "bold" as const,
            size: 14,
          },
        },
        ticks: {
          color: neonOrange,
          font: {
            family: "Inter, monospace",
            size: 11,
          },
          callback: (value) => Number(value).toLocaleString(),
        },
        grid: {
          color: `${neonOrange}30`,
          lineWidth: 1,
          drawTicks: true,
        },
        border: {
          color: neonOrange,
          width: 2,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    elements: {
      point: {
        hoverBackgroundColor: neonPink,
        hoverBorderColor: neonCyan,
        hoverBorderWidth: 3,
      },
      line: {
        borderJoinStyle: "round",
        borderCapStyle: "round",
      },
    },
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
    },
    animations: {
      tension: {
        duration: 1000,
        easing: "linear",
        from: 1,
        to: 0.4,
        loop: false,
      },
    },
  }), [xAxis, yAxis, neonCyan, neonOrange, neonPurple, neonPink, minY, maxY]);

  return (
    <div 
        className="w-full h-96 animate-fade-in relative p-6 font-mono rounded-xl transition-all duration-500"
        style={{
            // Set up a dark background for the neon effect
            backgroundColor: 'oklch(0.05 0.01 240)', 
            // Set CSS variables for container effects
            '--neon-cyan': neonCyan,
            '--neon-orange': neonOrange,
            border: `1px solid ${neonCyan}50`,
            boxShadow: `0 0 30px ${neonCyan}30`
        }}
    >
      {/* Background radial glow effect */}
      <div 
        className="absolute inset-0 rounded-lg" 
        style={{
            background: `radial-gradient(circle at center, var(--neon-cyan) 0%, transparent 70%)`,
            opacity: 0.05
        }}
      />

      {/* Pulsing scan line effect */}
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        <div
          className="absolute top-0 left-0 w-full h-0.5"
          style={{
            animation: "scan-line 5s linear infinite",
            backgroundColor: neonCyan,
            boxShadow: `0 0 10px ${neonCyan}`,
          }}
        />
      </div>

      <div className="relative z-10 w-full h-full">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>

      {/* Decorative Corner Borders */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2" style={{ borderColor: neonCyan }} />
      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2" style={{ borderColor: neonCyan }} />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2" style={{ borderColor: neonOrange }} />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2" style={{ borderColor: neonOrange }} />

      {/* Custom CSS for the scan line animation */}
      <style jsx>{`
        @keyframes scan-line {
          0% { transform: translateY(0); opacity: 0.5; }
          50% { opacity: 1; }
          100% { transform: translateY(calc(384px - 2px)); opacity: 0.5; } /* 384px is h-96 */
        }
      `}</style>
    </div>
  )
}
