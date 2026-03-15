# Courel Energy ⚡

Courel Energy is a specialized, open-source web application designed to help consumers in the regulated and free energy markets accurately simulate and compare their electricity bills. By leveraging real consumption data, users can understand the true impact of their contracted power terms, energy usage patterns (Punta, Llana, Valle), surplus solar generation, and specific utility pricing structures.

**[Try the Live App Here (Example URL)]()**

## 🎯 Purpose and Mission
The energy market can be confusing due to complex billing periods, varying margins on regulated BOE costs, and opaque surplus compensation mechanics. 

Courel Energy aims to provide a **100% transparent and non-profit tool** where users can:
- Store their historic monthly energy consumption and surplus data.
- Manage custom tariff configurations (including power terms per kW/year or kW/day).
- Generate side-by-side invoice simulations to identify the most cost-effective provider (e.g., Octopus, Repsol, Curenergía).
- Demystify the "Margen s/BOE" (commercial margin over regulated costs).

> **Disclaimer:** This tool is developed for educational and personal use. While we strive for exact mathematical parity with utility companies, minor rounding differences may occur.

## ✨ Key Features
- 📊 **Consumption Tracking:** Log your monthly energy usage (kWh) across different periods (P1, P2, P3) and track solar surplus.
- 💶 **Advanced Bill Simulation:** Calculates exact power terms (considering the exact number of billing days), energy costs, tolls (Peajes), electrical tax, and VAT.
- ⚙️ **Custom Tariff Builder:** Input custom prices for power terms and energy.
- 🏛️ **Regulated Costs Calibration:** Pre-configured with the latest BOE (Boletín Oficial del Estado) regulated costs to accurately calculate the commercial margins applied by providers.
- 🔐 **Secure Authentication:** Integrated with NextAuth for seamless Google OAuth and standard credential login.

## 🛠️ Technology Stack
- **Frontend/Framework:** [Next.js 16](https://nextjs.org/) (App Router, React 19)
- **Styling:** CSS Modules / Global CSS
- **Database:** PostgreSQL
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [NextAuth.js v5 (Auth.js)](https://authjs.dev/)
- **Deployment:** Docker, GitHub Actions

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v20+)
- PostgreSQL database

### 1. Clone the repository
```bash
git clone https://github.com/xantygc/courel_energy.git
cd courel_energy
```

### 2. Environment Variables
Create a `.env` file in the root directory and populate it with your credentials:
```env
DATABASE_URL="postgresql://courel_admin:your_password@localhost:5432/courel_energy?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_super_secret_string"

# Optional: For Google OAuth Registration
GOOGLE_CLIENT_ID="your_google_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_secret"
```

### 3. Install Dependencies & Setup Database
```bash
npm install
npx prisma generate
npx prisma db push
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🐳 Docker Deployment

The application is fully containerized using a multi-stage build process optimized for production (Next.js `standalone` mode).

### Using Docker Compose
The easiest way to run the app alongside a PostgreSQL database is using the provided `docker-compose.yml`.

Ensure you have your `.env` file created, then run:

```bash
docker-compose up -d --build
```
The app will be available at port `3000`.

### CI/CD Pipeline
This repository includes a GitHub Actions workflow (`.github/workflows/docker-publish.yml`). On every push to `develop` or `main`, it automatically builds the Docker image and pushes it to **GitHub Container Registry (GHCR)**.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is open-source and free to use.
