import { useMemo, useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { UsuarioRanking } from '@/types/instagram';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RankingTableProps {
  usuarios: UsuarioRanking[];
  /** Quantos itens exibir (padrão Top 5) */
  limit?: number;
}

export function RankingTable({ usuarios, limit = 5 }: RankingTableProps) {
  const [busca, setBusca] = useState('');

  const usuariosFiltrados = useMemo(() => {
    const q = (busca ?? '').toString().trim().toLowerCase();

    const list = (usuarios ?? []).filter((u) => {
      const handle = (u.handle ?? '').toString().toLowerCase();
      const id = (u.idPerfil ?? '').toString().toLowerCase();
      return q ? handle.includes(q) || id.includes(q) : true;
    });

    // já vêm ranqueados, mas garantimos consistência
    const ordenado = [...list].sort(
      (a, b) =>
        (b.totalInteracoes || 0) - (a.totalInteracoes || 0) ||
        (a.handle ?? a.idPerfil).localeCompare(b.handle ?? b.idPerfil),
    );

    return ordenado.slice(0, limit);
  }, [usuarios, busca, limit]);

  return (
    <div className="glass-card-hover p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-neon-cyan" />
          <h3 className="text-lg font-semibold">Ranking dos Usuários</h3>
          <span className="ml-2 rounded-full border border-white/10 bg-white/5 px-2 py-[2px] text-xs text-white/70">
            Top {limit}
          </span>
        </div>

        <div className="relative w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar usuário..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="h-9 w-full rounded-full border border-white/10 bg-white/5 pl-10 pr-4 text-sm placeholder:text-muted-foreground outline-none transition-colors focus:border-primary/50"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground opacity-60">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground opacity-60">
                Usuário
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground opacity-60">
                Interações
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground opacity-60">
                % Positivas
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground opacity-60">
                Última Interação
              </th>
            </tr>
          </thead>

          <tbody>
            {usuariosFiltrados.map((usuario, index) => {
              const rawHandle = (usuario.handle ?? '').toString().trim();
              const rawId = (usuario.idPerfil ?? '').toString().trim();
              const displayName = rawHandle ? `@${rawHandle}` : (rawId ? `ID #${rawId.slice(0, 8)}` : '—');

              const avatarUrl = rawHandle
                ? `https://unavatar.io/instagram/${encodeURIComponent(rawHandle)}`
                : '';

              // time-ago seguro
              let timeAgo = 'recentemente';
              try {
                const d = new Date(usuario.ultimaInteracao as any);
                if (!isNaN(+d)) {
                  timeAgo = formatDistanceToNow(d, { locale: ptBR, addSuffix: true });
                }
              } catch {/* noop */}

              const pct = Math.max(0, Math.min(100, Number(usuario.percentualPositivas) || 0));

              return (
                <tr
                  key={`${rawId || rawHandle || index}`}
                  className="border-b border-white/5 transition-colors hover:bg-white/5"
                >
                  <td className="px-4 py-4">
                    <span className="tabular-nums text-2xl font-bold text-muted-foreground/40">
                      {index + 1}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-white/10">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback className="bg-gradient-to-br from-neon-purple/30 to-neon-cyan/30 text-sm">
                          {(rawHandle || rawId || 'US')
                            .replace(/^@/, '')
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{displayName}</span>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <span className="tabular-nums text-lg font-semibold">
                      {usuario.totalInteracoes}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-2 w-16 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-neon-lime to-neon-cyan"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-12 tabular-nums text-sm font-medium">{pct.toFixed(0)}%</span>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-right text-sm text-muted-foreground">{timeAgo}</td>
                </tr>
              );
            })}

            {usuariosFiltrados.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
