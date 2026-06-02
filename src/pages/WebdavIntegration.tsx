import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, HardDrive, Network, Settings, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const WebdavIntegration = () => {
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
            <Network className="h-3.5 w-3.5" /> WebDAV Setup
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-cyan-400">
            WebDAV Network Integration
          </h1>
          <p className="text-sm text-muted-foreground">
            Distributed Authoring and Versioning Protocol Integration
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl space-y-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 w-max">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">HTTP Standard</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Integrate with any Synology, Nextcloud, QNAP, or ownCloud instance through standard port mappings cleanly.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl space-y-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 w-max">
              <HardDrive className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">Direct Local Mount</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sync files directly with active network subnets without leaving the client-side cryptographic dashboard view.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl space-y-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 w-max">
              <Settings className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">Automated Sync</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Define target backup shared directory structures to push and pull encrypted blocks automatically on scheduler beats.
            </p>
          </div>
        </div>

        {/* Detailed Spec info */}
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">How WebDAV Works on Vault@Xis</h2>
            <p>
              WebDAV provides direct HTTP interfaces to easily read and write files on external drives. By configuring server URLs, shared folders, and network authentication credentials, you establish a direct synchronization channel that encrypts every byte locally *before* transmission, ensuring optimal zero-knowledge cloud cloud setups.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WebdavIntegration;
