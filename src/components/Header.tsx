
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Sun, Moon, HardDrive, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { FileCategory, ThemeMode } from '@/lib/types';
import { useTheme } from '@/hooks/use-theme';

interface HeaderProps {
  onSelectFileCategory: (category: FileCategory) => void;
  selectedCategory: FileCategory;
}

export function Header({ onSelectFileCategory, selectedCategory }: HeaderProps) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  const fileCategories = [
    { value: 'all', label: 'All Files' },
    { value: 'document', label: 'Documents' },
    { value: 'image', label: 'Images' },
    { value: 'video', label: 'Videos' },
    { value: 'audio', label: 'Audio' },
    { value: 'archive', label: 'Archives' },
    { value: 'executable', label: 'Executables' },
    { value: 'system', label: 'System Files' },
    { value: 'programming', label: 'Programming Files' },
    { value: 'security', label: 'Security Files' }
  ];
  
  const getCategoryLabel = (category: FileCategory) => {
    const found = fileCategories.find(cat => cat.value === category);
    return found ? found.label : 'All Files';
  };

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                {getCategoryLabel(selectedCategory)} <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>File Categories</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {fileCategories.map((category) => (
                <DropdownMenuItem 
                  key={category.value}
                  onClick={() => onSelectFileCategory(category.value as FileCategory)}
                  className={category.value === selectedCategory ? "bg-accent" : ""}
                >
                  {category.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
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
