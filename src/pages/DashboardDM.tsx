import { User, TrendingUp, Minus, TrendingDown, Clock } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { FiltersBar } from '@/components/dashboard/FiltersBar';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { SentimentGauge } from '@/components/dashboard/SentimentGauge';
import { SentimentFeed } from '@/components/dashboard/SentimentFeed';
import { RankingTable } from '@/components/dashboard/RankingTable';
import { useInteracoes } from '@/hooks/useInteracoes';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function DashboardDM() {
  const { metricas, ranking, topicos, loading, ultimaAtualizacao, handleFilterChange, interacoes } =
    useInteracoes('dm');

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const vozDisplay = metricas.vozMaisAtiva?.handle
    ? `@${metricas.vozMaisAtiva.handle}`
    : metricas.vozMaisAtiva
    ? `ID #${metricas.vozMaisAtiva.idPerfil.slice(0, 8)}`
    : 'N/A';

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Filtros */}
        <FiltersBar origem="DM" onFilterChange={handleFilterChange} />

        {/* KPIs */}
        <div className="grid grid-cols-12 gap-6">
          <KpiCard
            title="Voz mais ativa"
            value={vozDisplay}
            subtitle={`${metricas.vozMaisAtiva?.count || 0} interações`}
            icon={User}
            color="purple"
            className="col-span-3"
          />
          <KpiCard
            title="Positivas"
            value={metricas.positivas}
            icon={TrendingUp}
            color="lime"
            className="col-span-3"
            sparklineData={[12, 19, 15, 22, 18, 25, 20]}
          />
          <KpiCard
            title="Neutras"
            value={metricas.neutras}
            icon={Minus}
            color="cyan"
            className="col-span-3"
            sparklineData={[8, 10, 12, 9, 11, 10, 12]}
          />
          <KpiCard
            title="Negativas"
            value={metricas.negativas}
            icon={TrendingDown}
            color="magenta"
            className="col-span-3"
            sparklineData={[5, 7, 4, 8, 6, 5, 4]}
          />
        </div>

        {/* Gauge + Feed */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-7">
            <SentimentGauge
              score={metricas.indiceSentimento}
              positivas={metricas.positivas}
              neutras={metricas.neutras}
              negativas={metricas.negativas}
            />
          </div>
          <div className="col-span-5">
            <SentimentFeed interacoes={interacoes} topicos={topicos} />
          </div>
        </div>

        {/* Ranking */}
        <RankingTable usuarios={ranking} />

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>
            Última atualização:{' '}
            {formatDistanceToNow(ultimaAtualizacao, { locale: ptBR, addSuffix: true })}
          </span>
        </div>
      </div>
    </DashboardLayout>
  );
}
