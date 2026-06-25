import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, HardDrive, HelpCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileCategory } from '@/lib/types';
import { useTheme } from '@/hooks/use-theme';

interface HeaderProps {
  onSelectFileCategory?: (category: FileCategory) => void;
  selectedCategory?: FileCategory;
}

export function Header({ onSelectFileCategory, selectedCategory }: HeaderProps) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10 shadow-sm backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="Vault@Xis Logo" className="h-7 w-7 object-contain" />
          <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">
            Vault@Xis
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => navigate('/supported-formats')}
          >
            <HelpCircle className="h-4 w-4 text-cyan-400" /> Supported File Types
          </Button>

          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => navigate('/converter')}
          >
            <RefreshCw className="h-4 w-4 text-primary" /> Convert Files
          </Button>

          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => navigate('/nas-setup')}
          >
            <HardDrive className="h-4 w-4" />
            NAS Setup
          </Button>
        </div>
      </div>
    </header>
  );
}
