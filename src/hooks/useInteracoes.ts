import { useEffect, useState, useMemo } from 'react';
import { Interacao, Periodo, Sentimento } from '@/types/instagram';
import {
  fetchDMInteractions,
  fetchCommentInteractions,
  getMockDMData,
  getMockCommentData,
} from '@/services/googleSheets';
import {
  calcularMetricas,
  gerarRanking,
  filtrarPorPeriodo,
  filtrarPorSentimento,
  filtrarPorBusca,
  extrairTopicos,
} from '@/utils/metrics';

const REFRESH_INTERVAL = 30000; // 30s

export function useInteracoes(tipo: 'dm' | 'comentarios') {
  const [interacoes, setInteracoes] = useState<Interacao[]>([]);
  const [interacoesFiltradas, setInteracoesFiltradas] = useState<Interacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date>(new Date());

  // Filtros
  const [busca, setBusca] = useState('');
  const [periodo, setPeriodo] = useState<Periodo>({ label: '30 dias', value: '30d', dias: 30 });
  const [sentimento, setSentimento] = useState<Sentimento>(null);

  // Carregar dados (com fallback para mock)
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        let dados: Interacao[];

        if (tipo === 'dm') {
          dados = await fetchDMInteractions();
          if (!dados.length) dados = getMockDMData();
        } else {
          dados = await fetchCommentInteractions();
          if (!dados.length) dados = getMockCommentData();
        }

        setInteracoes(dados);
        setUltimaAtualizacao(new Date());
      } catch (error) {
        console.error('Erro ao carregar interações:', error);
        setInteracoes(tipo === 'dm' ? getMockDMData() : getMockCommentData());
      } finally {
        setLoading(false);
      }
    };

    carregarDados();

    // Auto-refresh
    const interval = setInterval(carregarDados, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [tipo]);

  // Aplicar filtros
  useEffect(() => {
    let resultado = [...interacoes];

    if (periodo?.dias) {
      resultado = filtrarPorPeriodo(resultado, periodo.dias);
    }

    if (sentimento) {
      resultado = filtrarPorSentimento(resultado, sentimento);
    }

    if (busca) {
      resultado = filtrarPorBusca(resultado, busca);
    }

    setInteracoesFiltradas(resultado);
  }, [interacoes, busca, periodo, sentimento]);

  // Métricas, ranking (Top 5) e tópicos
  const metricas = useMemo(() => calcularMetricas(interacoesFiltradas), [interacoesFiltradas]);

  // garantir Top 5 aqui, independente da implementação de gerarRanking
  const ranking = useMemo(() => {
    const all = gerarRanking(interacoesFiltradas);
    return Array.isArray(all) ? all.slice(0, 5) : [];
  }, [interacoesFiltradas]);

  const topicos = useMemo(() => extrairTopicos(interacoesFiltradas, 3), [interacoesFiltradas]);

  const handleFilterChange = (filters: {
    busca: string;
    periodo: Periodo;
    sentimento?: Sentimento;
  }) => {
    setBusca(filters.busca);
    setPeriodo(filters.periodo);
    setSentimento(filters.sentimento ?? null);
  };

  return {
    interacoes: interacoesFiltradas,
    metricas,
    ranking,            // sempre Top 5
    topicos,
    loading,
    ultimaAtualizacao,
    handleFilterChange,
  };
}
