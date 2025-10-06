import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Interacao } from '@/types/instagram';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SentimentFeedProps {
  interacoes: Interacao[];
  topicos: string[];
}

export function SentimentFeed({ interacoes, topicos }: SentimentFeedProps) {
  const recentes = interacoes.slice(0, 5);

  const getSentimentoBadge = (sentimento: string | null) => {
    if (!sentimento) return null;
    
    const config = {
      POSITIVO: { label: 'Positivo', className: 'bg-neon-lime/20 text-neon-lime border-neon-lime/30' },
      NEUTRO: { label: 'Neutro', className: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' },
      NEGATIVO: { label: 'Negativo', className: 'bg-neon-magenta/20 text-neon-magenta border-neon-magenta/30' },
    };

    const item = config[sentimento as keyof typeof config];
    if (!item) return null;

    return (
      <Badge variant="outline" className={cn("text-xs", item.className)}>
        {item.label}
      </Badge>
    );
  };

  return (
    <div className="glass-card-hover p-6 h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-sm uppercase text-muted-foreground tracking-wider font-medium opacity-60 mb-3">
          O que estão falando de nós
        </h3>
        
        {topicos.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {topicos.map((topico) => (
              <span
                key={topico}
                className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-medium"
              >
                #{topico}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {recentes.map((interacao, index) => {
          const texto = 'mensagem' in interacao ? interacao.mensagem : interacao.conteudo;
          const displayName = interacao.handle ? `@${interacao.handle}` : `ID #${interacao.idPerfil.slice(0, 8)}`;
          const avatarUrl = interacao.handle ? `https://unavatar.io/instagram/${interacao.handle}` : '';
          
          let timeAgo = '';
          try {
            const timestamp = interacao.timestamp || `${interacao.data}T${interacao.hora}`;
            timeAgo = formatDistanceToNow(new Date(timestamp), { locale: ptBR, addSuffix: true });
          } catch {
            timeAgo = 'há pouco tempo';
          }

          return (
            <div key={index} className="flex gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <Avatar className="w-10 h-10 border border-white/10">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-gradient-to-br from-neon-purple/30 to-neon-cyan/30 text-xs">
                  {displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{displayName}</span>
                  {getSentimentoBadge(interacao.sentimento)}
                  <span className="text-xs text-muted-foreground ml-auto">
                    {timeAgo}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {texto.slice(0, 140)}
                  {texto.length > 140 && '...'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
