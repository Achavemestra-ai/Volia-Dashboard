import * as React from 'react';
import { Search, Calendar, Filter, X } from 'lucide-react';
import { Periodo, Sentimento } from '@/types/instagram';
import { cn } from '@/lib/utils';

type Sent = 'todos' | 'POSITIVO' | 'NEUTRO' | 'NEGATIVO';

type Props = {
  origem: 'DM' | 'Comentários';
  /** Busca (texto livre) */
  search: string;
  onSearch: (v: string) => void;

  /** Filtro de sentimento */
  sentFiltro: Sent;
  onSentFiltro: (v: Sent) => void;

  /** Períodos rápidos (0 = hoje) */
  selectedRange?: 0 | 7 | 30;
  onQuickRange: (days: 0 | 7 | 30) => void;

  /** Ações */
  onAplicar: () => void;
  onLimpar: () => void;

  /** Alternar origem (opcional) */
  onOrigemChange?: (o: 'DM' | 'Comentários') => void;
};

function Chip({
  active,
  children,
  onClick,
  className,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-9 rounded-full border px-3 text-sm transition-colors',
        active
          ? 'border-violet-400/30 bg-violet-500/15 text-white shadow-[0_0_0_1px_rgba(168,85,247,.15)_inset]'
          : 'border-white/10 bg-white/5 text-white/80 hover:border-white/20',
        className
      )}
    >
      {children}
    </button>
  );
}

function FiltersBarInternal({
  origem,
  onOrigemChange,
  search,
  onSearch,
  sentFiltro,
  onSentFiltro,
  selectedRange = 30,
  onQuickRange,
  onAplicar,
  onLimpar,
}: Props) {
  const [localSearch, setLocalSearch] = React.useState(search);
  React.useEffect(() => setLocalSearch(search), [search]);

  return (
    <div className="glass-card-hover sticky top-0 z-40 flex flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center md:justify-between">
      {/* Esquerda: busca + chips */}
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {/* Busca */}
        <div className="relative mr-1 w-full max-w-[360px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              onSearch(e.target.value);
            }}
            placeholder="Buscar por @ ou ID..."
            className="h-10 w-full rounded-full border border-white/10 bg-white/5 pl-10 pr-4 text-sm outline-none placeholder:text-white/40 focus:border-white/20"
          />
        </div>

        {/* Ícone “filtro” */}
        <span className="mx-1 hidden h-9 items-center rounded-full border border-white/10 bg-white/5 px-2 text-white/60 md:inline-flex">
          <Filter className="h-4 w-4" />
        </span>

        {/* Períodos rápidos */}
        <Chip active={selectedRange === 0} onClick={() => onQuickRange(0)}>
          Hoje
        </Chip>
        <Chip active={selectedRange === 7} onClick={() => onQuickRange(7)}>
          7 dias
        </Chip>
        <Chip active={selectedRange === 30} onClick={() => onQuickRange(30)}>
          30 dias
        </Chip>

        {/* Sentimento */}
        <Chip active={sentFiltro === 'todos'} onClick={() => onSentFiltro('todos')}>
          Todos
        </Chip>
        <Chip active={sentFiltro === 'POSITIVO'} onClick={() => onSentFiltro('POSITIVO')}>
          Positivo
        </Chip>
        <Chip active={sentFiltro === 'NEUTRO'} onClick={() => onSentFiltro('NEUTRO')}>
          Neutro
        </Chip>
        <Chip active={sentFiltro === 'NEGATIVO'} onClick={() => onSentFiltro('NEGATIVO')}>
          Negativo
        </Chip>

        {/* Origem (toggle) */}
        <Chip
          className="ml-1"
          onClick={() => onOrigemChange?.(origem === 'DM' ? 'Comentários' : 'DM')}
          active
        >
          {origem}
        </Chip>

        {/* Limpar / Aplicar */}
        <button
          type="button"
          onClick={onLimpar}
          className="ml-2 h-9 rounded-full px-3 text-sm text-white/80 hover:text-white/95"
          title="Limpar filtros"
        >
          <X className="mr-1 inline h-3 w-3" />
          Limpar
        </button>
        <button
          type="button"
          onClick={onAplicar}
          className="h-9 rounded-full bg-violet-600 px-4 text-sm font-medium text-white hover:bg-violet-500"
        >
          Aplicar
        </button>
      </div>
    </div>
  );
}

/** default export */
export default FiltersBarInternal;
/** named export para compatibilidade (quem usar `{ FiltersBar }` também funciona) */
export const FiltersBar = FiltersBarInternal;
