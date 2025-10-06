import { MessageSquare, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export default function Home() {
  return (
    <DashboardLayout>
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-neon-purple via-neon-magenta to-neon-cyan bg-clip-text text-transparent">
            Vólia Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Monitore suas interações do Instagram em tempo real
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          <Link
            to="/dm"
            className="glass-card-hover p-8 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-neon-purple/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-8 h-8 text-neon-purple" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Direct Messages</h2>
              <p className="text-muted-foreground mb-6">
                Monitore e analise todas as mensagens diretas recebidas
              </p>
              
              <div className="flex items-center text-neon-purple group-hover:gap-3 gap-2 transition-all">
                <span className="font-medium">Acessar Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>

          <Link
            to="/comentarios"
            className="glass-card-hover p-8 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-neon-cyan/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-8 h-8 text-neon-cyan" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Comentários</h2>
              <p className="text-muted-foreground mb-6">
                Acompanhe todos os comentários em suas publicações
              </p>
              
              <div className="flex items-center text-neon-cyan group-hover:gap-3 gap-2 transition-all">
                <span className="font-medium">Acessar Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-12 glass-card p-6 max-w-2xl">
          <p className="text-sm text-muted-foreground text-center">
            <span className="text-neon-cyan font-medium">Atualização automática</span> a cada 30 segundos •{' '}
            <span className="text-neon-purple font-medium">Dados em tempo real</span> via Google Sheets
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
