import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Terminal, Cpu, Globe, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const WebCryptoSpec = () => {
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
            <Globe className="h-3.5 w-3.5" /> Web Crypto API
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-cyan-400">
            Web Cryptography API
          </h1>
          <p className="text-sm text-muted-foreground">
            W3C Standard Browser Crypto Integration spec
          </p>
        </div>

        {/* Specs Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl space-y-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 w-max">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">Native Sandbox</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Executes within protected browser runtime sandboxes, isolated from regular user-land heap vulnerabilities.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl space-y-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 w-max">
              <Terminal className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">Crypto Subtle</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Provides direct asynchronous low-level APIs for premium cipher blocks, signatures, hashing, and key derivations.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl space-y-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 w-max">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">OS CSPRNG</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Taps directly into underlying operating system entropy loops for supreme cryptographic random parameter generation.
            </p>
          </div>
        </div>

        {/* Detailed Spec info */}
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">Advanced Web Security Architecture</h2>
            <p>
              By standardizing secure processes on standard W3C Web Cryptography APIs, the browser ensures high speed, low battery drain, and robust prevention of common side-channel memory leaks. Users get secure offline-ready cryptography without installing buggy third-party binary libraries.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WebCryptoSpec;
