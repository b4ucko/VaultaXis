import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Image, 
  Video, 
  Music, 
  FolderArchive, 
  Terminal, 
  Cpu, 
  Code, 
  Shield, 
  Search, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface FormatCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  borderColor: string;
  badgeColor: string;
  extensions: string[];
}

const CATEGORIES: FormatCategory[] = [
  {
    id: 'document',
    name: 'Documents',
    description: 'Text, spreadsheets, presentations, and e-books',
    icon: FileText,
    color: 'from-blue-500/20 to-indigo-500/5',
    borderColor: 'border-blue-500/30',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    extensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'csv', 'tex', 'md', 'epub', 'mobi', 'xps']
  },
  {
    id: 'image',
    name: 'Images',
    description: 'Photos, vector graphics, and design project files',
    icon: Image,
    color: 'from-emerald-500/20 to-teal-500/5',
    borderColor: 'border-emerald-500/30',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'heif', 'heic', 'raw', 'cr2', 'nef', 'arw', 'dng', 'psd', 'ai', 'eps', 'indd', 'webp', 'ico']
  },
  {
    id: 'video',
    name: 'Videos',
    description: 'Standard and high-definition video formats',
    icon: Video,
    color: 'from-cyan-500/20 to-blue-500/5',
    borderColor: 'border-cyan-500/30',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    extensions: ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'mpg', 'mpeg', '3gp', 'webm', 'ogv', 'vob', 'swf', 'mts']
  },
  {
    id: 'audio',
    name: 'Audio',
    description: 'Lossless and compressed sound and music tracks',
    icon: Music,
    color: 'from-pink-500/20 to-rose-500/5',
    borderColor: 'border-pink-500/30',
    badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    extensions: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'aiff', 'opus', 'mid']
  },
  {
    id: 'archive',
    name: 'Archives',
    description: 'Compressed bundles and system disk images',
    icon: FolderArchive,
    color: 'from-amber-500/20 to-orange-500/5',
    borderColor: 'border-amber-500/30',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    extensions: ['zip', 'rar', '7z', 'tar', 'gz', 'iso', 'dmg', 'cab', 'xz', 'bz2']
  },
  {
    id: 'executable',
    name: 'Executables',
    description: 'Application bundles, scripts, and installer binaries',
    icon: Terminal,
    color: 'from-violet-500/20 to-purple-500/5',
    borderColor: 'border-violet-500/30',
    badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    extensions: ['exe', 'msi', 'app', 'apk', 'ipa', 'sh', 'bat', 'bin', 'cmd']
  },
  {
    id: 'system',
    name: 'System Files',
    description: 'Configuration, registry, and shared system libraries',
    icon: Cpu,
    color: 'from-red-500/20 to-orange-500/5',
    borderColor: 'border-red-500/30',
    badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
    extensions: ['dll', 'sys', 'cfg', 'ini', 'plist', 'reg', 'dat', 'pkg']
  },
  {
    id: 'programming',
    name: 'Programming',
    description: 'Source code, configuration, and structural data files',
    icon: Code,
    color: 'from-teal-500/20 to-emerald-500/5',
    borderColor: 'border-teal-500/30',
    badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    extensions: ['py', 'js', 'html', 'css', 'c', 'cpp', 'java', 'php', 'json', 'xml', 'yaml', 'yml', 'sql', 'r', 'm', 'pl', 'rb']
  },
  {
    id: 'security',
    name: 'Security & Keys',
    description: 'Private keys, certificates, and secure credentials',
    icon: Shield,
    color: 'from-purple-500/20 to-indigo-500/5',
    borderColor: 'border-purple-500/30',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    extensions: ['pem', 'pfx', 'key', 'csr', 'crt', 'asc', 'p12', 'encrypted']
  }
];

export default function SupportedFormats() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const cleanQuery = searchQuery.trim().toLowerCase().replace(/^\./, '');

  const filteredCategories = CATEGORIES.map(category => {
    const matchingExtensions = category.extensions.filter(ext => 
      ext.includes(cleanQuery)
    );
    return {
      ...category,
      matchingExtensions,
      hasMatch: matchingExtensions.length > 0 || category.name.toLowerCase().includes(cleanQuery)
    };
  }).filter(category => category.hasMatch);

  const totalExtensions = CATEGORIES.reduce((acc, cat) => acc + cat.extensions.length, 0);

  return (
    <div className="flex flex-col min-h-screen bg-[#070b16] text-white font-outfit ambient-glow">
      <Header />
      
      <div className="container max-w-5xl mx-auto py-12 px-6 flex-1 space-y-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')} 
          className="text-muted-foreground hover:text-white hover:bg-white/5 gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>

        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <CheckCircle className="h-3.5 w-3.5" /> High Compatibility Suite
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-cyan-400">
              Supported File Types
            </h1>
            <p className="text-sm text-muted-foreground">
              Vault@Xis runs client-side zero-knowledge encryption on {totalExtensions} distinct formats across 9 structural categories.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text"
              placeholder="Search file extension (e.g. pdf, png)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-white rounded-xl focus:border-primary/50 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Grid of Categories */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div 
                  key={category.id} 
                  className={`p-6 border rounded-3xl bg-gradient-to-br ${category.color} ${category.borderColor} shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${category.badgeColor}`}>
                        {category.extensions.length} Formats
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-1">{category.name}</h3>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{category.description}</p>
                  </div>

                  {/* List of Extensions */}
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                    {category.extensions.map((ext) => {
                      const isHighlighted = cleanQuery !== '' && ext.includes(cleanQuery);
                      return (
                        <span 
                          key={ext} 
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            isHighlighted 
                              ? 'bg-primary text-white scale-105 shadow-md shadow-primary/20' 
                              : 'bg-white/5 text-muted-foreground border border-white/5'
                          }`}
                        >
                          .{ext}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center space-y-4 glass border border-white/5 rounded-3xl">
            <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground animate-bounce" />
            <div>
              <p className="font-medium text-lg text-white">No matching extensions found</p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                Vault@Xis can encrypt any file binary payload. Unlisted extensions will fall back to the Security or Unknown cipher block pipeline.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setSearchQuery('')}
              className="mt-2 text-xs"
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
