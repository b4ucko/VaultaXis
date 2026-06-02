import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, ShieldCheck, Key, RefreshCw, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const SecurityManifest = () => {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified Security Architecture
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-cyan-400">
            Security Manifest
          </h1>
          <p className="text-sm text-muted-foreground">
            Cryptographic Integrity and Compliance Standards Profile
          </p>
        </div>

        {/* Security Parameters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Key className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-sm text-white">Cipher Specifications</h3>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground font-mono">
              <div className="flex justify-between border-b border-white/5 py-1">
                <span>Standard Cipher:</span>
                <span className="text-white">AES-256-GCM (Galois Counter Mode)</span>
              </div>
              <div className="flex justify-between border-b border-white/5 py-1">
                <span>Key Stretching KDF:</span>
                <span className="text-white">PBKDF2-HMAC-SHA256</span>
              </div>
              <div className="flex justify-between border-b border-white/5 py-1">
                <span>Default Iterations:</span>
                <span className="text-white">100,000 Rounds</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Salt Length:</span>
                <span className="text-white">128-bit Random CSPRNG</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <RefreshCw className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-sm text-white">Memory Lifecycle</h3>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground font-mono">
              <div className="flex justify-between border-b border-white/5 py-1">
                <span>Key Retention:</span>
                <span className="text-white">In-Memory Sandbox Only</span>
              </div>
              <div className="flex justify-between border-b border-white/5 py-1">
                <span>Zero-Out Interval:</span>
                <span className="text-white">Immediate on Task Completion</span>
              </div>
              <div className="flex justify-between border-b border-white/5 py-1">
                <span>Heap Leak Safeguard:</span>
                <span className="text-white">Enabled via Garbage Cleanup</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Local Session Cache:</span>
                <span className="text-white">IndexedDB AES Wrapped</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Details */}
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-cyan-400" /> Hardened Defense Vectors
            </h2>
            <p>
              Vault@Xis eliminates single points of failure by routing all operations through standard Web Cryptography APIs provided directly by the client browser engine. This mitigates traditional backend vulnerability vectors such as remote SQL injections, cloud storage breaches, and man-in-the-middle credential interceptions.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SecurityManifest;
