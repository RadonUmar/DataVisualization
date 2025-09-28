import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom cyberpunk colors
        "neon-cyan": "oklch(var(--neon-cyan))",
        "neon-orange": "oklch(var(--neon-orange))",
        "neon-purple": "oklch(var(--neon-purple))",
        "neon-pink": "oklch(var(--neon-pink))",
        "glass-bg": "oklch(var(--glass-bg))",
        "glass-border": "oklch(var(--glass-border))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "neon-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px var(--neon-cyan), 0 0 40px var(--neon-cyan), 0 0 60px var(--neon-cyan)" },
          "50%": { boxShadow: "0 0 30px var(--neon-cyan), 0 0 60px var(--neon-cyan), 0 0 90px var(--neon-cyan)" },
        },
        "grid-move": {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(50px, 50px)" },
        },
        "glitch": {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
        },
        "glitch-1": {
          "0%, 100%": { transform: "translate(0)" },
          "10%": { transform: "translate(-2px, -2px)" },
          "20%": { transform: "translate(2px, 2px)" },
        },
        "glitch-2": {
          "0%, 100%": { transform: "translate(0)" },
          "30%": { transform: "translate(2px, -2px)" },
          "60%": { transform: "translate(-2px, 2px)" },
        },
        "pulse-bg": {
          "0%": { filter: "brightness(1) saturate(1)" },
          "100%": { filter: "brightness(1.1) saturate(1.2)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 1s ease-out forwards",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "neon-pulse": "neon-pulse 2s ease-in-out infinite alternate",
        "grid-move": "grid-move 20s linear infinite",
        "glitch": "glitch 2s infinite",
        "glitch-1": "glitch-1 0.5s infinite",
        "glitch-2": "glitch-2 0.5s infinite",
        "pulse-bg": "pulse-bg 8s ease-in-out infinite alternate",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
