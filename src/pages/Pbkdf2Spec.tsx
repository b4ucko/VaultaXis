import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, KeyRound, Lock, ShieldCheck, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Pbkdf2Spec = () => {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider">
            <KeyRound className="h-3.5 w-3.5" /> PBKDF2 Spec
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-cyan-400">
            PBKDF2 Key Derivation
          </h1>
          <p className="text-sm text-muted-foreground">
            Password-Based Key Derivation Function 2 (RFC 8018) Specification
          </p>
        </div>

        {/* Core parameters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl space-y-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 w-max">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">100,000 Iterations</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Provides robust computational cost defense against high-throughput custom ASIC and GPU cracking attempts.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl space-y-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 w-max">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">HMAC-SHA256 Hash</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Uses cryptographically secure SHA-256 primitives inside the pseudorandom stretching loop for supreme entropy output.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl space-y-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 w-max">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">CSPRNG Salt</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every key is hardened against pre-computed table attacks (rainbow tables) by incorporating a unique cryptographically strong random salt.
            </p>
          </div>
        </div>

        {/* Detailed Spec info */}
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">Why Key Derivation is Essential</h2>
            <p>
              Human passwords rarely possess enough entropy for direct cryptographic operations. PBKDF2 stretches these passwords into highly secure 256-bit keys, ensuring the derived key has optimal mathematical density. This makes offline dictionary attacks highly impractical.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pbkdf2Spec;
