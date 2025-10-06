import { InteracaoDM, InteracaoComentario } from '@/types/instagram';

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';
const SHEET_ID_DM = '1xDOce6APLC4bH4EaM0Jr-Gu6VJ4osCl2Z1yFsdn31ec';
const SHEET_ID_COMMENTS = '1wSfNLEBJEWeT-vEIgI1yfUXGeBpq_ptO7cKpXoFzri0';

interface SheetRow {
  [key: string]: string;
}

async function fetchSheetData(sheetId: string): Promise<SheetRow[]> {
  if (!GOOGLE_API_KEY) {
    console.warn('GOOGLE_API_KEY not configured, using mock data');
    return [];
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:Z2000?key=${GOOGLE_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.statusText}`);
    }

    const data = await response.json();
    const rows = data.values || [];
    
    if (rows.length === 0) return [];

    const headers = rows[0];
    const dataRows = rows.slice(1);

    return dataRows.map((row: string[]) => {
      const obj: SheetRow = {};
      headers.forEach((header: string, index: number) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return [];
  }
}

function normalizeDMData(rows: SheetRow[]): InteracaoDM[] {
  return rows.map(row => ({
    idPerfil: row['ID instagram'] || row['ID_instagram'] || '',
    handle: row['@'] || row['Handle'] || undefined,
    mensagem: row['Interação'] || row['Mensagem'] || '',
    data: row['DATA'] || row['Data'] || '',
    hora: row['HORA'] || row['Hora'] || '',
    timestamp: row['TimeStamp'] || row['Timestamp'] || '',
    sentimento: (row['Sentimento']?.toUpperCase() as any) || null,
  }));
}

function normalizeCommentData(rows: SheetRow[]): InteracaoComentario[] {
  return rows.map(row => ({
    idPerfil: row['ID_instagram'] || row['ID instagram'] || '',
    handle: row['IG_LEAD'] || row['@'] || '',
    conteudo: row['Conteúdo'] || row['Comentario'] || row['Comentário'] || '',
    data: row['Data'] || row['DATA'] || '',
    hora: row['Hora'] || row['HORA'] || '',
    timestamp: row['Timestamp'] || row['TimeStamp'] || '',
    sentimento: (row['Sentimento']?.toUpperCase() as any) || null,
  }));
}

export async function fetchDMInteractions(): Promise<InteracaoDM[]> {
  const rows = await fetchSheetData(SHEET_ID_DM);
  return normalizeDMData(rows);
}

export async function fetchCommentInteractions(): Promise<InteracaoComentario[]> {
  const rows = await fetchSheetData(SHEET_ID_COMMENTS);
  return normalizeCommentData(rows);
}

// Mock data for development
export function getMockDMData(): InteracaoDM[] {
  return [
    {
      idPerfil: '12345',
      handle: 'maria_silva',
      mensagem: 'Adorei os produtos! Quando chega meu pedido?',
      data: '2025-01-15',
      hora: '14:30',
      timestamp: '2025-01-15T14:30:00',
      sentimento: 'POSITIVO',
    },
    {
      idPerfil: '67890',
      handle: 'joao_costa',
      mensagem: 'Não recebi meu pedido ainda',
      data: '2025-01-15',
      hora: '13:15',
      timestamp: '2025-01-15T13:15:00',
      sentimento: 'NEGATIVO',
    },
    {
      idPerfil: '54321',
      mensagem: 'Qual o prazo de entrega?',
      data: '2025-01-15',
      hora: '12:00',
      timestamp: '2025-01-15T12:00:00',
      sentimento: 'NEUTRO',
    },
  ];
}

export function getMockCommentData(): InteracaoComentario[] {
  return [
    {
      idPerfil: '98765',
      handle: 'ana_beauty',
      conteudo: 'Produtos incríveis! Super recomendo ❤️',
      data: '2025-01-15',
      hora: '15:45',
      timestamp: '2025-01-15T15:45:00',
      sentimento: 'POSITIVO',
    },
    {
      idPerfil: '45678',
      handle: 'carlos_makeup',
      conteudo: 'Quando terá promoção?',
      data: '2025-01-15',
      hora: '14:20',
      timestamp: '2025-01-15T14:20:00',
      sentimento: 'NEUTRO',
    },
  ];
}
