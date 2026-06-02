import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, RefreshCw, HardDrive, ShieldAlert, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const CloudSync = () => {
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
            <RefreshCw className="h-3.5 w-3.5" /> Cloud Storage Sync
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-cyan-400">
            Cloud Storage Synchronization
          </h1>
          <p className="text-sm text-muted-foreground">
            Zero-Knowledge Automated Cloud Sync specification
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl space-y-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 w-max">
              <RefreshCw className="h-5 w-5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <h3 className="font-bold text-sm">Pre-Upload Encryption</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every file byte is completely serialized and locked with your strong password key before sending it to the cloud.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl space-y-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 w-max">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">Zero Knowledge</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Cloud hosts see only standard `.encrypted` byte packets. Original file names, categories, and keys remain hidden.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl space-y-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 w-max">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">Hardware Secured</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Integrates seamlessly with local NAS servers, WebDAV subnets, and local sync folders for resilient backup matrices.
            </p>
          </div>
        </div>

        {/* Detailed Spec info */}
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">Automated Sync Redundancy</h2>
            <p>
              Vault@Xis supports multi-destination sync topologies. By configuring automated crons, you can instruct the engine to automatically dump state records or encrypted backups directly into local storage, WebDAV shares, or syncd subnets without interrupting active developer workflows.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CloudSync;
