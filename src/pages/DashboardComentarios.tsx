import * as React from 'react';
import { User, TrendingUp, Minus, TrendingDown, Clock } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import FiltersBar from '@/components/dashboard/FiltersBar'; // default export
import { KpiCard } from '@/components/dashboard/KpiCard';
import { SentimentGauge } from '@/components/dashboard/SentimentGauge';
import { SentimentFeed } from '@/components/dashboard/SentimentFeed';
import { RankingTable } from '@/components/dashboard/RankingTable';
import { useInteracoes } from '@/hooks/useInteracoes';
import { Periodo } from '@/types/instagram';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Sent = 'todos' | 'POSITIVO' | 'NEUTRO' | 'NEGATIVO';

export default function DashboardComentarios() {
  const {
    metricas,
    ranking,
    topicos,
    loading,
    ultimaAtualizacao,
    handleFilterChange,
    interacoes,
  } = useInteracoes('comentarios');

  // ---- estado local da barra de filtros ----
  const [busca, setBusca] = React.useState('');
  const [sent, setSent] = React.useState<Sent>('todos');
  const [range, setRange] = React.useState<0 | 7 | 30>(30);

  // tipar explicitamente como Periodo corrige erros ao passar para handleFilterChange
  const [periodo, setPeriodo] = React.useState<Periodo>({
    label: '30 dias',
    value: '30d' as Periodo['value'],
    dias: 30,
  });

  /** utilitário para mapear days -> value do tipo Periodo['value'] */
  const valueFromDays = (days: 0 | 7 | 30): Periodo['value'] =>
    (days === 0 ? '0d' : days === 7 ? '7d' : '30d') as Periodo['value'];

  /** utilitário para mapear days -> label amigável */
  const labelFromDays = (days: 0 | 7 | 30) => (days === 0 ? 'Hoje' : `${days} dias`);

  const quickRange = (days: 0 | 7 | 30) => {
    setRange(days);
    setPeriodo({
      label: labelFromDays(days),
      value: valueFromDays(days), // <-- assertion garante compatibilidade com o union do seu tipo
      dias: days,
    });
  };

  const aplicar = () => {
    handleFilterChange({
      busca,
      periodo,
      sentimento: sent === 'todos' ? null : (sent as any),
    });
  };

  const limpar = () => {
    setBusca('');
    setSent('todos');
    quickRange(30); // também atualiza 'periodo'
    handleFilterChange({
      busca: '',
      periodo: {
        label: '30 dias',
        value: '30d' as Periodo['value'],
        dias: 30,
      },
      sentimento: null,
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const vozDisplay = metricas.vozMaisAtiva?.handle
    ? `@${metricas.vozMaisAtiva.handle}`
    : metricas.vozMaisAtiva
    ? `ID #${(metricas.vozMaisAtiva.idPerfil ?? '').slice(0, 8)}`
    : 'N/A';

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        {/* Filtros */}
        <FiltersBar
          origem="Comentários"
          onOrigemChange={() => {}}
          search={busca}
          onSearch={setBusca}
          sentFiltro={sent}
          onSentFiltro={setSent}
          selectedRange={range}
          onQuickRange={quickRange}
          onLimpar={limpar}
          onAplicar={aplicar}
        />

        {/* KPIs */}
        <div className="grid grid-cols-12 gap-6">
          <KpiCard
            title="Voz mais ativa"
            value={vozDisplay}
            subtitle={`${metricas.vozMaisAtiva?.count || 0} interações`}
            icon={User}
            color="purple"
            className="col-span-12 md:col-span-3"
          />
          <KpiCard
            title="Positivas"
            value={metricas.positivas}
            icon={TrendingUp}
            color="lime"
            className="col-span-12 md:col-span-3"
            sparklineData={[10, 15, 18, 20, 22, 28, 25]}
          />
          <KpiCard
            title="Neutras"
            value={metricas.neutras}
            icon={Minus}
            color="cyan"
            className="col-span-12 md:col-span-3"
            sparklineData={[6, 8, 10, 7, 9, 8, 10]}
          />
          <KpiCard
            title="Negativas"
            value={metricas.negativas}
            icon={TrendingDown}
            color="magenta"
            className="col-span-12 md:col-span-3"
            sparklineData={[3, 5, 4, 6, 5, 3, 2]}
          />
        </div>

        {/* Gauge + Feed */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-7">
            <SentimentGauge
              score={metricas.indiceSentimento}
              positivas={metricas.positivas}
              neutras={metricas.neutras}
              negativas={metricas.negativas}
            />
          </div>
          <div className="col-span-12 md:col-span-5">
            <SentimentFeed interacoes={interacoes} topicos={topicos} />
          </div>
        </div>

        {/* Ranking */}
        <RankingTable usuarios={ranking} />

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            Última atualização:{' '}
            {formatDistanceToNow(ultimaAtualizacao, { locale: ptBR, addSuffix: true })}
          </span>
        </div>
      </div>
    </DashboardLayout>
  );
}
