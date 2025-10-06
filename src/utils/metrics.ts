import { Interacao, MetricasGerais, UsuarioRanking, Sentimento } from '@/types/instagram';
import { differenceInDays, parseISO } from 'date-fns';

export function calcularMetricas(interacoes: Interacao[]): MetricasGerais {
  const positivas = interacoes.filter(i => i.sentimento === 'POSITIVO').length;
  const neutras = interacoes.filter(i => i.sentimento === 'NEUTRO').length;
  const negativas = interacoes.filter(i => i.sentimento === 'NEGATIVO').length;
  
  const indiceSentimento = interacoes.length > 0
    ? ((positivas * 1 + neutras * 0.5) / interacoes.length) * 100
    : 0;

  // Voz mais ativa
  const contagemPorUsuario = new Map<string, { handle?: string; count: number }>();
  interacoes.forEach(i => {
    const key = i.idPerfil;
    const existing = contagemPorUsuario.get(key) || { count: 0 };
    contagemPorUsuario.set(key, {
      handle: i.handle || existing.handle,
      count: existing.count + 1,
    });
  });

  let vozMaisAtiva = null;
  let maxCount = 0;
  contagemPorUsuario.forEach((value, idPerfil) => {
    if (value.count > maxCount) {
      maxCount = value.count;
      vozMaisAtiva = { idPerfil, handle: value.handle, count: value.count };
    }
  });

  return {
    totalInteracoes: interacoes.length,
    positivas,
    neutras,
    negativas,
    vozMaisAtiva,
    indiceSentimento,
  };
}

export function gerarRanking(interacoes: Interacao[]): UsuarioRanking[] {
  const usuariosMap = new Map<string, {
    handle?: string;
    total: number;
    positivas: number;
    ultimaInteracao: Date;
  }>();

  interacoes.forEach(i => {
    const key = i.idPerfil;
    const existing = usuariosMap.get(key) || {
      total: 0,
      positivas: 0,
      ultimaInteracao: new Date(0),
    };

    const dataInteracao = parseISO(i.timestamp || `${i.data}T${i.hora}`);

    usuariosMap.set(key, {
      handle: i.handle || existing.handle,
      total: existing.total + 1,
      positivas: existing.positivas + (i.sentimento === 'POSITIVO' ? 1 : 0),
      ultimaInteracao: dataInteracao > existing.ultimaInteracao ? dataInteracao : existing.ultimaInteracao,
    });
  });

  const ranking: UsuarioRanking[] = [];
  usuariosMap.forEach((value, idPerfil) => {
    ranking.push({
      idPerfil,
      handle: value.handle,
      totalInteracoes: value.total,
      positivas: value.positivas,
      percentualPositivas: (value.positivas / value.total) * 100,
      ultimaInteracao: value.ultimaInteracao.toISOString(),
    });
  });

  return ranking.sort((a, b) => b.totalInteracoes - a.totalInteracoes).slice(0, 10);
}

export function filtrarPorPeriodo(interacoes: Interacao[], dias?: number): Interacao[] {
  if (!dias) return interacoes;

  const hoje = new Date();
  return interacoes.filter(i => {
    try {
      const dataInteracao = parseISO(i.timestamp || `${i.data}T${i.hora}`);
      return differenceInDays(hoje, dataInteracao) <= dias;
    } catch {
      return true;
    }
  });
}

export function filtrarPorSentimento(interacoes: Interacao[], sentimento?: Sentimento): Interacao[] {
  if (!sentimento) return interacoes;
  return interacoes.filter(i => i.sentimento === sentimento);
}

export function filtrarPorBusca(interacoes: Interacao[], busca: string): Interacao[] {
  if (!busca.trim()) return interacoes;
  
  const termo = busca.toLowerCase().replace('@', '');
  return interacoes.filter(i => 
    i.handle?.toLowerCase().includes(termo) ||
    i.idPerfil.toLowerCase().includes(termo)
  );
}

export function extrairTopicos(interacoes: Interacao[], limite = 3): string[] {
  const stopwords = new Set([
    'a', 'o', 'de', 'da', 'do', 'e', 'é', 'em', 'que', 'para', 'com', 'não', 'um', 'uma',
    'os', 'as', 'dos', 'das', 'por', 'no', 'na', 'se', 'me', 'ele', 'ela', 'eu', 'você',
  ]);

  const palavras = new Map<string, number>();
  
  interacoes.forEach(i => {
    const texto = 'mensagem' in i ? i.mensagem : i.conteudo;
    const tokens = texto
      .toLowerCase()
      .replace(/[^\wáéíóúàâêôãõç\s]/g, '')
      .split(/\s+/);
    
    tokens.forEach(palavra => {
      if (palavra.length > 3 && !stopwords.has(palavra)) {
        palavras.set(palavra, (palavras.get(palavra) || 0) + 1);
      }
    });
  });

  return Array.from(palavras.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limite)
    .map(([palavra]) => palavra);
}
