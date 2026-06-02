# 🛡️ Vault@Xis — Cryptographic Dashboard & Storage Engine

Vault@Xis is a secure, client-side, zero-knowledge cryptographic dashboard and local storage engine. Running entirely in your web browser, it utilizes native hardware-accelerated APIs to encrypt, decrypt, and manage files without transmitting passwords or sensitive payloads to any remote database.

---

## ✨ Key Features

- **🔐 Cryptographic Engine**
  - **AES-256-GCM Encryption**: Secure file encryption using the native Web Crypto API.
  - **Key Derivation (PBKDF2/SHA-256)**: Safe key derivation using configurable iterations.
  - **100% Client-Side**: No private keys or unencrypted file chunks ever leave your machine.
- **💼 Identity & Access Suite**
  - **Hardware Key Rotation**: Manage and cycle keys locally.
  - **Role-Based Access Control (RBAC)**: Manage local simulated access controls.
  - **Tamper-Evident Ledger**: Audit logs cryptographically linked together via SHA-256 block chaining.
- **⚡ Advanced Automation & Subnets**
  - **Subnet Health Node Monitoring**: View status and network latency of active local subnet nodes (e.g., NAS storage drop targets).
  - **Local Cron Scheduler**: Dispatched automated file and verification tasks.
  - **Interactive CLI Terminal**: Execute cryptographic and vault commands directly.
- **✨ Premium UI/UX**
  - Modern, hardware-inspired cyber-theme with dynamic particle fields, ambient glows, responsive marquee tickers, and interactive accordions.

---

## 🛠️ Tech Stack

- **Core Framework**: React 18 & TypeScript
- **Bundler & Tooling**: Vite
- **Styling**: Tailwind CSS & Framer Motion
- **UI Components**: shadcn/ui & Lucide React
- **Package Manager**: npm (supports Bun/Yarn/pnpm)

---

## 🚀 Getting Started & Installation

Follow these steps to run the application locally on your machine.

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.x or later recommended)
- **npm** (comes packaged with Node.js)

### Setup Instructions

1. **Clone the Repository**
   ```sh
   git clone <YOUR_GITHUB_REPOSITORY_URL>
   cd OmniXFinal-main
   ```

2. **Install Dependencies**
   Install all required Node modules:
   ```sh
   npm install
   ```

3. **Start the Development Server**
   Launch Vite's hot-reloading development server:
   ```sh
   npm run dev
   ```
   Open your browser and navigate to the local URL (usually `http://localhost:5173`).

4. **Build for Production**
   To build the production-ready static assets:
   ```sh
   npm run build
   ```
   To preview the built production app locally:
   ```sh
   npm run preview
   ```

---

## 📂 Project Structure

```
OmniXFinal-main/
├── public/              # Static assets (icons, etc.)
├── src/
│   ├── components/      # UI components (Header, Footer, EncryptionCard, etc.)
│   ├── hooks/           # Custom React hooks (theme, toast)
│   ├── lib/             # Helper utilities, mock APIs, type definitions
│   ├── pages/           # Page layouts and workspace suites (Index, AuditLogs)
│   ├── App.tsx          # App root routing & providers
│   ├── main.tsx         # App entry point
│   └── index.css        # Global CSS & Tailwind variables
├── package.json         # Project scripts & dependencies
├── vite.config.ts       # Vite bundler configuration
└── tsconfig.json        # TypeScript configuration
```

---

## 🛡️ Security Disclaimer & Zero-Knowledge Protocol

Vault@Xis operates under a **Zero-Knowledge Architecture**:
- All keys derived from passwords are kept strictly inside the volatile heap memory of the browser.
- Encrypted payloads and file action logs are cached locally using the browser's `localStorage` and `IndexedDB`.
- Closing the tab or locking the workspace zeroes out the key states immediately.
