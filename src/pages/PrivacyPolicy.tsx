import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Lock, EyeOff, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#070b16] text-white font-outfit ambient-glow">
      <Header />
      
      <div className="container max-w-4xl mx-auto py-12 px-6 flex-1 space-y-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')} 
          className="text-muted-foreground hover:text-white hover:bg-white/5 gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>

        {/* Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            <Shield className="h-3.5 w-3.5" /> Zero-Knowledge Policy
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-cyan-400">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last Updated: June 2026 • Version 2.4.0 (Zero-Telemetry Active)
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl space-y-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 w-max">
              <EyeOff className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">No Client Telemetry</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We do not track, collect, or transmit any analytical data. Your encryption actions remain completely confidential.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl space-y-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 w-max">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">Zero-Server State</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All cryptographic operations occur inside your browser memory sandbox. Passwords never reach the cloud.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl space-y-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 w-max">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">Local Storage Encrypted</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Metadata, logs, and cache parameters reside inside client-side IndexedDB and localStorage arrays only.
            </p>
          </div>
        </div>

        {/* Policy Content */}
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" /> 1. Client-Side Cryptographic Isolation
            </h2>
            <p>
              Vault@Xis executes 100% of all Web Crypto pipelines directly inside the browser's JavaScript sandbox. The application uses hardware-accelerated <code>AES-256-GCM</code> and <code>PBKDF2</code> key-stretching libraries. At no point in the encryption or decryption cycle is file content or master passwords transmitted across external socket paths.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" /> 2. Local-Only Cookies & Storage Auditing
            </h2>
            <p>
              Vault@Xis uses browser <code>localStorage</code> solely to preserve the file operational logs and active ledger history blocks to support local workflows. No tracking pixels, marketing cookies, or external identity tracers are integrated or loaded. The database can be purged cleanly at any moment via the application settings or browser console clearance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-400" /> 3. High Integrity Data Responsibility
            </h2>
            <p>
              Because Vault@Xis operates on a strict zero-knowledge protocol, <strong>we cannot recover lost passwords or master keys</strong>. If a password is forgotten, the files encrypted with that key are mathematically impossible to decipher. Users are advised to preserve key manifests and keep offline backups of essential authentication credentials.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
