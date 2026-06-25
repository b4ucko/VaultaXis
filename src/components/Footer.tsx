import React from 'react';
import { Linkedin, Shield, HardDrive, Cpu, Terminal, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-black/5 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl text-foreground transition-all duration-300">
      {/* Upper Rich Footer Sections */}
      <div className="container max-w-5xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Block */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Vault@Xis Logo" className="h-6 w-6 object-contain" />
            <span className="font-extrabold tracking-wider text-base bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">
              Vault@Xis
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Next-generation secure client-side file cryptography. Leverages native hardware-accelerated Web Crypto Permutation pipelines.
          </p>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full w-max border border-emerald-500/20">
            <Shield className="h-3.5 w-3.5" /> Zero-Knowledge Verified
          </div>
        </div>

        {/* Column 1: Crypto Suite */}
        <div className="space-y-3.5">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-primary" /> Crypto Suite
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/spec/aes-256-gcm" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span> AES-256-GCM Spec
              </Link>
            </li>
            <li>
              <Link to="/spec/pbkdf2" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span> PBKDF2 Derivation
              </Link>
            </li>
            <li>
              <Link to="/spec/web-crypto" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span> Web Crypto API
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Storage & Clouds */}
        <div className="space-y-3.5">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <HardDrive className="h-3.5 w-3.5 text-cyan-400" /> Storage & Cloud
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/nas-setup" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span> NAS Setup Guide
              </Link>
            </li>
            <li>
              <Link to="/webdav" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span> WebDAV Integration
              </Link>
            </li>
            <li>
              <Link to="/cloud-sync" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span> Cloud Storage Sync
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Developer */}
        <div className="space-y-3.5">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-purple-400" /> Developer
          </h3>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Click profile to connect:</p>
            <div className="pt-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="h-10 px-3 py-1.5 rounded-2xl group hover:scale-[1.03] transition-all bg-white/5 border border-white/5 hover:border-primary/30 flex items-center gap-3 text-left w-full justify-start"
                      onClick={() => window.open('https://linkedin.com/saikatxbhattacharya', '_blank')}
                    >
                      <Avatar className="h-7 w-7 border border-white/10 group-hover:border-primary transition-all">
                        <AvatarImage src="/saikat.jpg" alt="Saikat Bhattacharya" className="object-cover" />
                        <AvatarFallback className="bg-primary/20">
                          <Linkedin className="h-3.5 w-3.5 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">Saikat Bhattacharya</span>
                        <span className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
                          <Linkedin className="h-2.5 w-2.5 text-sky-500" /> saikatxbhattacharya
                        </span>
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">
                    Connect on LinkedIn
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Copyright Bar */}
      <div className="border-t border-black/5 dark:border-white/5 py-6 bg-black/5 dark:bg-black/30">
        <div className="container max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 Vault@Xis System. Local client-side operations only. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/security-manifest" className="hover:text-primary transition-colors">Security Manifest</Link>
            <Link to="/audit-logs" className="hover:text-primary transition-colors">Audit Logs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
