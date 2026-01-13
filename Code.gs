
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('SIS-SAUDE | Histórico de Inspeção')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

const IDS = {
  DAILY: "1CWXzs_J1tTITIZ52_0t02tUb8tBewKSBNWNyaHb6z8M",
  HISTORY: "1Odv6OclUAie8LCFIpI5iQsuoUFLq6ChUimqiGPVjjjU"
};

/**
 * Busca dados de inspeção do dia no banco primário
 * Mapeamento baseado nas colunas fornecidas:
 * Name: row[11] (Col L)
 * Nascimento: row[5] (Col F)
 * Posto: row[8] (Col I)
 * Quadro: row[9] (Col J)
 * Especialidade: row[10] (Col K)
 * Saram: row[12] (Col M)
 * CPF: row[6] (Col G)
 * OM: row[13] (Col N)
 * Grupo: row[21] (Col V)
 * Vinculo: row[15] (Col P)
 * Finalidade: row[16] (Col Q)
 */
function getDailyData() {
  try {
    const ss = SpreadsheetApp.openById(IDS.DAILY);
    const sheet = ss.getSheetByName("FICHAS");
    if (!sheet) throw new Error("Aba 'FICHAS' não encontrada no banco diário.");
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];

    const today = new Date();
    const todayStr = today.toLocaleDateString('pt-BR');
    
    // Filtrando por data do dia (Coluna F / row[5])
    return data.slice(1).filter(row => {
      if (!row[5]) return false;
      const d = new Date(row[5]);
      return d.toLocaleDateString('pt-BR') === todayStr;
    }).map((row, index) => ({
      id: 'row-' + (index + 1),
      name: row[11],            // Col L
      dt_nascimento: row[5] ? new Date(row[5]).toLocaleDateString('pt-BR') : 'N/A', // Col F
      posto: row[8],           // Col I
      quadro: row[9],          // Col J
      especialidade: row[10],  // Col K
      saram: row[12],          // Col M
      cpf: row[6],             // Col G
      om: row[13],             // Col N
      grupo: row[21],          // Col V
      vinculo: row[15],        // Col P
      finalidade: row[16]      // Col Q
    }));
  } catch (e) {
    return { error: e.toString() };
  }
}

/**
 * Busca histórico completo de um CPF no banco de fichas julgadas
 */
function getHistoryByCpf(cpf) {
  try {
    if (!cpf) return [];
    
    const ss = SpreadsheetApp.openById(IDS.HISTORY);
    const sheet = ss.getSheetByName("FICHAS");
    if (!sheet) throw new Error("Aba 'FICHAS' não encontrada no histórico.");
    
    const data = sheet.getDataRange().getValues();
    const targetCpf = String(cpf).replace(/\D/g, '');
    
    const history = data.slice(1)
      .filter(row => {
        const rowCpf = String(row[6] || '').replace(/\D/g, '');
        return rowCpf === targetCpf;
      })
      .map(row => ({
        date: row[5] ? new Date(row[5]).toLocaleDateString('pt-BR') : 'N/A',
        type: row[16] || 'Inspeção',
        result: row[10] || 'N/A',
        doctor: row[11] || 'N/A',
        location: row[12] || 'N/A',
        observations: row[13] || 'N/A'
      }))
      .sort((a, b) => {
        // Ordenação decrescente por data
        const dateA = a.date.split('/').reverse().join('-');
        const dateB = b.date.split('/').reverse().join('-');
        return dateB.localeCompare(dateA);
      });

    return history;
  } catch (e) {
    return { error: e.toString() };
  }
}
