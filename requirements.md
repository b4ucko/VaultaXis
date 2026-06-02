# Requirements Specification: Vault@Xis

This document outlines the functional, technical, and environment requirements for **Vault@Xis**—a client-side, zero-knowledge cryptographic dashboard and local storage engine.

---

## 1. System & Browser Requirements

Vault@Xis operates as a **100% client-side** application. It relies entirely on native browser features and hardware APIs for cryptography and storage.

### Supported Browsers
*   **Google Chrome** (v80 or later)
*   **Mozilla Firefox** (v75 or later)
*   **Microsoft Edge** (v80 or later)
*   **Safari** (v13.1 or later)
*   *Note: Private browsing mode (Incognito) may limit storage quotas or restrict persistent IndexedDB storage.*

### Hardware & API Requirements
*   **Web Crypto API**: The browser must support native hardware-accelerated cryptographic functions (for AES-GCM and PBKDF2).
*   **Web Storage APIs**: Support for `localStorage` and `IndexedDB` is required to store local vault items, audit logs, and configs.
*   **Web Workers / Timer APIs**: Required for background execution of the local cron scheduler.

---

## 2. Technical Dependencies & Environment

### Development Prerequisites
*   **Node.js**: Version `18.x` or later (LTS recommended)
*   **Package Manager**: `npm` (v9.x or later), `yarn`, `pnpm`, or `bun`

### Core Technologies
*   **Framework**: [React 18](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
*   **UI Components**: [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)

---

## 3. Project Dependencies (package.json)

Below are the primary packages utilized by the application:

### Runtime Dependencies
*   `react` & `react-dom` (`^18.3.1`) — Component rendering engine.
*   `react-router-dom` (`^6.26.2`) — Client-side page routing.
*   `framer-motion` (`^11.18.2`) — Dynamic fluid animations and micro-interactions.
*   `lucide-react` (`^0.462.0`) — Modern vector icons.
*   `zod` (`^3.23.8`) & `react-hook-form` (`^7.53.0`) — Form validation and input management.
*   `recharts` (`^2.12.7`) — Data visualization for dashboard metrics.
*   `@radix-ui/*` primitives — Accessible base interactive UI widgets.
*   `next-themes` (`^0.3.0`) — Theme state switcher (dark mode/light mode).

### Development Dependencies
*   `typescript` (`^5.5.3`) — Static typing configuration.
*   `vite` (`^5.4.1`) — High-performance frontend bundler.
*   `tailwindcss` (`^3.4.11`) — Utility-first CSS styling framework.
*   `eslint` (`^9.9.0`) — Code quality linter.

---

## 4. Functional Requirements

### 4.1 Cryptographic Engine
*   **AES-256-GCM Encryption/Decryption**: Secure local symmetric cryptography.
*   **PBKDF2 Key Derivation**: High-iteration key stretching (SHA-256) derived from user-defined master passwords.
*   **Entropy Generation**: Use `window.crypto.getRandomValues` for cryptographically strong pseudorandom iv/salts.

### 4.2 Security & Compliance (Zero-Knowledge Protocol)
*   **Heap Volatility**: Clear all derived cryptographic keys from memory when the workspace is locked or the tab is closed.
*   **Data Isolation**: Zero transmission of passwords, keys, or unencrypted payloads to external services.

### 4.3 Identity & Access Management (IAM)
*   **Local RBAC (Role-Based Access Control)**: Simulated permission controls (Admin, Auditor, Operator) restricting system views and settings.
*   **Hardware Key Management**: Rotation policies for local encryption keys.

### 4.4 Logging & Operations
*   **Tamper-Evident Ledger**: Chain-linked logs hash-chained via SHA-256 to record all file and system activities.
*   **Subnet Monitoring**: Track local subnet endpoints (e.g., storage targets, nodes) and report ping times/latencies.
*   **Cron Task Scheduler**: Configure automated periodic tasks (e.g., integrity checks, file rotations) entirely client-side.
*   **Terminal Interface**: Execute command-line instructions directly via a simulated interactive dashboard CLI.
