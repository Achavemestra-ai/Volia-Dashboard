export type Sentimento = 'POSITIVO' | 'NEUTRO' | 'NEGATIVO' | null;

export interface InteracaoDM {
  idPerfil: string;
  handle?: string;
  mensagem: string;
  data: string;
  hora: string;
  timestamp: string;
  sentimento: Sentimento;
}

export interface InteracaoComentario {
  idPerfil: string;
  handle: string;
  conteudo: string;
  data: string;
  hora: string;
  timestamp: string;
  sentimento: Sentimento;
}

export type Interacao = InteracaoDM | InteracaoComentario;

export interface MetricasGerais {
  totalInteracoes: number;
  positivas: number;
  neutras: number;
  negativas: number;
  vozMaisAtiva: {
    idPerfil: string;
    handle?: string;
    count: number;
  } | null;
  indiceSentimento: number;
}

export interface UsuarioRanking {
  idPerfil: string;
  handle?: string;
  totalInteracoes: number;
  positivas: number;
  percentualPositivas: number;
  ultimaInteracao: string;
}

export interface Periodo {
  label: string;
  value: 'hoje' | '7d' | '30d' | 'custom';
  dias?: number;
}
