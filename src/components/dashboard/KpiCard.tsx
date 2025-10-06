import { useId, useMemo } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Trend = 'up' | 'down' | 'neutral';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: Trend;
  /** Dados do sparkline (qualquer tamanho, só números >= 0) */
  sparklineData?: number[];
  /** Cores do “glow” do card */
  color?: 'purple' | 'cyan' | 'lime' | 'magenta';
  /** Ajuste fino do sparkline */
  sparklineHeight?: number; // default 56
  className?: string;
}

/* -------- helpers -------- */

/** Converte uma série em um path suave (Catmull-Rom -> Bézier) */
function toSmoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return '';
  const d: string[] = [];
  d.push(`M ${points[0].x} ${points[0].y}`);

  const cr = 0.2; // suavização
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) * cr;
    const cp1y = p1.y + (p2.y - p0.y) * cr;
    const cp2x = p2.x - (p3.x - p1.x) * cr;
    const cp2y = p2.y - (p3.y - p1.y) * cr;

    d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
  }
  return d.join(' ');
}

/** Normaliza os dados para caber no viewBox */
function buildPoints(data: number[], w: number, h: number) {
  const max = Math.max(1, ...data);
  const min = Math.min(...data);
  const range = Math.max(1, max - min);

  const stepX = data.length > 1 ? w / (data.length - 1) : w;
  return data.map((v, i) => {
    const x = i * stepX;
    // invertendo y (svg cresce pra baixo)
    const y = h - ((v - min) / range) * h;
    return { x, y };
  });
}

/* -------- componente -------- */

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = 'neutral',
  sparklineData,
  color = 'purple',
  sparklineHeight = 56,
  className,
}: KpiCardProps) {
  const gradientId = useId();

  const colorClasses: Record<NonNullable<KpiCardProps['color']>, string> = {
    purple: 'from-neon-purple/16 to-neon-purple/5',
    cyan: 'from-neon-cyan/16 to-neon-cyan/5',
    lime: 'from-neon-lime/16 to-neon-lime/5',
    magenta: 'from-neon-magenta/16 to-neon-magenta/5',
  };

  const strokeColor =
    trend === 'up' ? '#34d399' : trend === 'down' ? '#fb7185' : 'rgba(167,139,250,.9)'; // emerald / rose / violet

  const hasSpark = !!(sparklineData && sparklineData.length > 0);

  const { width, height, pathD, areaD } = useMemo(() => {
    if (!hasSpark) return { width: 0, height: 0, pathD: '', areaD: '' };
    const w = Math.max(80, (sparklineData!.length - 1) * 14); // largura responsiva
    const h = sparklineHeight;
    const pts = buildPoints(sparklineData!, w, h);
    const d = toSmoothPath(pts);
    const area = d + ` L ${w} ${h} L 0 ${h} Z`;
    return { width: w, height: h, pathD: d, areaD: area };
  }, [hasSpark, sparklineData, sparklineHeight]);

  return (
    <div className={cn('glass-card-hover relative overflow-hidden p-5 md:p-6', className)}>
      {/* glow de fundo */}
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50', colorClasses[color])} />

      <div className="relative z-10">
        {/* header */}
        <div className="mb-2 flex items-start justify-between">
          <p className="text-[11px] uppercase tracking-[.14em] text-white/70">{title}</p>
          <div className="flex items-center gap-2">
            {trend !== 'neutral' && (
              <span
                className={cn(
                  'inline-flex h-6 items-center rounded-full border px-2 text-xs',
                  trend === 'up'
                    ? 'border-emerald-300/30 bg-emerald-300/10 text-emerald-300'
                    : 'border-rose-300/30 bg-rose-300/10 text-rose-300',
                )}
                aria-label={`tendência ${trend === 'up' ? 'de alta' : 'de baixa'}`}
              >
                {trend === 'up' ? '▲' : '▼'}
              </span>
            )}
            {Icon && <Icon className="h-5 w-5 text-white/50" />}
          </div>
        </div>

        {/* valor */}
        <div className="mb-1">
          <p className="break-all tabular-nums text-[34px] font-semibold leading-none md:text-[42px]">
            {value}
          </p>
          {subtitle && <p className="mt-1 text-xs text-white/70">{subtitle}</p>}
        </div>

        {/* sparkline */}
        {hasSpark && (
          <div className="mt-5">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              width="100%"
              height={height}
              role="img"
              aria-label="tendência do indicador"
              className="block"
            >
              {/* gradient da área */}
              <defs>
                <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
                </linearGradient>
                <filter id={`${gradientId}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor={strokeColor} floodOpacity="0.35" />
                </filter>
              </defs>

              {/* área sob a curva */}
              <path d={areaD} fill={`url(#${gradientId})`} />

              {/* linha suave com leve glow */}
              <path
                d={pathD}
                fill="none"
                stroke={strokeColor}
                strokeWidth="2.25"
                shapeRendering="geometricPrecision"
                filter={`url(#${gradientId}-shadow)`}
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
