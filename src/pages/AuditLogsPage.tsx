import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Activity, ShieldCheck, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AuditLogViewer } from '@/components/AuditLogViewer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AuditLogsPage = () => {
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
            <Activity className="h-3.5 w-3.5 animate-pulse" /> Cryptographic Ledger
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-cyan-400">
            System Audit Logs
          </h1>
          <p className="text-sm text-muted-foreground">
            Immutable client-side operation log history chained with SHA-256 integrity checks.
          </p>
        </div>

        {/* Table/Viewer Card */}
        <Card className="glass border-white/10 dark:text-white shadow-2xl glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-bold">
              <Database className="h-5 w-5 text-cyan-400" /> Active Operations Logs
            </CardTitle>
            <CardDescription className="text-xs">
              This log tracks cryptographic actions triggered in this browser session.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuditLogViewer />
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default AuditLogsPage;
