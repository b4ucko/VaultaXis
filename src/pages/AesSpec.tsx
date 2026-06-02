import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Cpu, Binary, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const AesSpec = () => {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Cpu className="h-3.5 w-3.5" /> AES Spec
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-cyan-400">
            AES-256-GCM Specification
          </h1>
          <p className="text-sm text-muted-foreground">
            Galois/Counter Mode Symmetric Authenticated Encryption Standard
          </p>
        </div>

        {/* Technical Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl space-y-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 w-max">
              <Binary className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">256-bit Key Strength</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Resilient against all current brute-force vectors and offers maximum defense against future quantum cryptanalysis.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl space-y-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 w-max">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">Authenticated Data</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Provides both confidentiality and integrity authentication in a single high-efficiency pass using GMAC verification.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl space-y-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 w-max">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">Hardware Acceleration</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Leverages direct CPU registers (AES-NI) inside browser execution sandboxes for blazing performance.
            </p>
          </div>
        </div>

        {/* Informational Text */}
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">Why AES-256-GCM?</h2>
            <p>
              Advanced Encryption Standard (AES) combined with Galois/Counter Mode (GCM) is the premium choice for modern Web applications. It offers Authenticated Encryption with Associated Data (AEAD). If an attacker alters even a single bit of the encrypted payload, GCM verification fails instantly on decryption, discarding the payload without exposing any side-channel data.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AesSpec;
