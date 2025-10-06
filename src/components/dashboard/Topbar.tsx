import { Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Topbar() {
  return (
    <header className="fixed top-0 left-16 right-0 h-16 bg-white/5 border-b border-white/10 backdrop-blur-sm z-40 flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
          Vólia Dashboard
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar globalmente..."
            className="w-80 h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-full text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        
        <Avatar className="w-9 h-9 border-2 border-white/10">
          <AvatarImage src="" />
          <AvatarFallback className="bg-gradient-to-br from-neon-purple to-neon-cyan text-white text-sm">
            AD
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
