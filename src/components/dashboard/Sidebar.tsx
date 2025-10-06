import { Home, MessageSquare, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'DM', href: '/dm', icon: MessageSquare },
  { name: 'Comentários', href: '/comentarios', icon: MessageCircle },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-white/5 border-r border-white/10 flex flex-col items-center py-6 z-50">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center mb-8">
        <span className="text-white font-bold text-xl">V</span>
      </div>
      
      <nav className="flex-1 flex flex-col gap-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                isActive
                  ? "bg-primary/20 text-primary shadow-[0_0_12px_rgba(124,77,255,0.4)]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
              title={item.name}
            >
              <Icon className="w-5 h-5" />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
