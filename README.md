🏎 Racecar Data Analysis Website
A lightweight web app for uploading, parsing, and visualizing racecar telemetry data. Built with Next.js, shadcn/ui + TailwindCSS, PapaParse, and Chart.js. Enhanced with Gemini API for LLM-driven insights into useful visualizations, anomalies, and key data patterns.

✨ Features
Upload CSV files directly in the browser

Parse and process telemetry data with PapaParse

Interactive graphs with Chart.js (line, scatter, time-series, etc.)

Clean, modern UI with shadcn/ui and TailwindCSS

Gemini API integration for:

Recommended graphs based on data columns

Anomaly detection (spikes, drops, flatlines)

Insights into key ranges and trends

Fully client-side (no backend or database required)

🖼 Screenshots
<img width="2560" height="1251" alt="Screenshot 2025-09-28 at 1 32 48 PM" src="https://github.com/user-attachments/assets/b91a3397-8081-470b-8acc-8197f55b978b" />
<img width="2553" height="1253" alt="Screenshot 2025-09-28 at 1 33 03 PM" src="https://github.com/user-attachments/assets/ac67df31-b280-443a-9ce7-2cd41c46a38a" />
<img width="2556" height="1256" alt="Screenshot 2025-09-28 at 1 33 13 PM" src="https://github.com/user-attachments/assets/b41e3685-6294-41b1-89eb-1d1cf7ac1482" />

🚀 Tech Stack
Next.js – modern React framework, easy deployment, fast UI

shadcn/ui + TailwindCSS – clean, professional styling

PapaParse – reliable CSV parsing in-browser

Chart.js – versatile graphing library for interactive charts

Gemini API – LLM-driven insights for graphs, anomalies, and key trends

No backend / no storage – keeps project simple, avoids overengineering

⚙️ Getting Started
1. Clone the repo
[git clone [https://github.com/your-username/racecar-data-website.git](https://github.com/your-username/Data.git)
](https://github.com/RadonUmar/DataVisualization.git)cd DataVisualization


2. Install dependencies
npm install


3. Add your Gemini API key
Create a .env.local file in the project root:

NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here


4. Run the development server
npm run dev


Open http://localhost:3000 in your browser.

☁️ Deployment
This app can be deployed easily on Vercel (recommended for Next.js apps).

Push this repo to GitHub

Import into Vercel

Add your environment variable (NEXT_PUBLIC_GEMINI_API_KEY)

Deploy 🚀

📂 Project Structure
.
├── components/          # UI components (Upload, Chart, Insights Panel)
├── pages/               # Next.js pages
├── public/images/       # Screenshots for README
├── lib/                 # Gemini API wrapper
├── styles/              # Tailwind + shadcn styles
└── package.json


📹 Demo
(Add link to a short video demo if you have one)

🤝 Contributing
PRs and issues welcome! Feel free to fork and build on this project.
