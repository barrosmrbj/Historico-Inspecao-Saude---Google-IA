
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('SIS-SAUDE | Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

const CONFIG = {
  ID_BANCO_DADOS: "1CWXzs_J1tTITIZ52_0t02tUb8tBewKSBNWNyaHb6z8M",
  ID_BANCO_FICHAS_JULGADAS: "1Odv6OclUAie8LCFIpI5iQsuoUFLq6ChUimqiGPVjjjU"
};

function calculateAge(birthDate) {
  if (!(birthDate instanceof Date) || isNaN(birthDate.getTime())) return "N/A";
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function formatDataCompare(val) {
  if (val instanceof Date) return Utilities.formatDate(val, "GMT-3", "dd/MM/yyyy");
  if (typeof val === 'string' && val.includes("/")) return val.split(" ")[0].trim();
  return String(val || "").split(" ")[0].trim();
}

/**
 * Busca dados diários com filtro de data opcional
 */
function getDailyData(filterDateIso) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.ID_BANCO_DADOS);
    const sheet = ss.getSheetByName("FICHAS") || ss.getSheets()[0];
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];

    let targetDate = null;
    if (filterDateIso) {
      const parts = filterDateIso.split('-');
      targetDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    } else {
      targetDate = formatDataCompare(new Date());
    }

    const result = data.slice(1).filter(row => {
      const rowDate = formatDataCompare(row[0]);
      return !filterDateIso || rowDate === targetDate;
    }).map((row, index) => ({
      id: 'row-' + (index + 1),
      dt_inspecao: formatDataCompare(row[0]),
      name: String(row[11] || "NOME NÃO INFORMADO"),
      posto: String(row[8] || ""),
      quadro: String(row[9] || ""),
      especialidade: String(row[10] || ""),
      dt_nascimento: formatDataCompare(row[4]),
      naturalidade: String(row[5] || ""),
      idade: calculateAge(row[4] instanceof Date ? row[4] : new Date(row[4])),
      cpf: String(row[6] || "").replace(/\D/g, ''),
      saram: String(row[12] || ""),
      om: String(row[13] || ""),
      vinculo: String(row[15] || ""), // Coluna P
      grupo: String(row[21] || ""),   // Coluna V
      finalidade: String(row[16] || "") // Coluna Q
    }));

    result.sort((a, b) => {
      const dateA = a.dt_inspecao.split('/').reverse().join('');
      const dateB = b.dt_inspecao.split('/').reverse().join('');
      return dateB.localeCompare(dateA);
    });

    return result;
  } catch (e) {
    return { error: e.toString() };
  }
}

/**
 * Busca histórico detalhado baseado em CPF no banco de Fichas Julgadas
 */
function getHistoryByCpf(cpf) {
  try {
    if (!cpf) return [];
    const ss = SpreadsheetApp.openById(CONFIG.ID_BANCO_FICHAS_JULGADAS);
    const sheet = ss.getSheetByName("FICHAS") || ss.getSheets()[0];
    const data = sheet.getDataRange().getValues();
    const targetCpf = String(cpf).replace(/\D/g, '');
    
    return data.slice(1)
      .filter(row => {
        const rowCpf = String(row[6] || "").replace(/\D/g, '');
        const parecer = String(row[28] || "").trim();
        return rowCpf === targetCpf && parecer !== "";
      })
      .map(row => ({
        date: formatDataCompare(row[0]),
        parecer: String(row[28] || "N/A"),
        cid_tratamento: String(row[29] || "").trim(),
        cid_restricao: String(row[30] || "").trim(),
        cid_incapaz: String(row[31] || "").trim(),
        obs_dis: String(row[32] || "").trim(),
        obs_cartao: String(row[33] || "").trim(),
        n_sessao: String(row[34] || ""),
        dt_sessao: formatDataCompare(row[35]),
        validade: formatDataCompare(row[36]),
        type: String(row[16] || "Inspeção")
      }))
      .sort((a, b) => {
        const dA = a.date.split('/').reverse().join('');
        const dB = b.date.split('/').reverse().join('');
        return dB.localeCompare(dA);
      });
  } catch (e) {
    return { error: e.toString() };
  }
}

/**
 * Busca múltiplos históricos em lote para otimizar processamento
 */
function getMultipleHistoryData(cpfs) {
  try {
    const results = {};
    const ss = SpreadsheetApp.openById(CONFIG.ID_BANCO_FICHAS_JULGADAS);
    const sheet = ss.getSheetByName("FICHAS") || ss.getSheets()[0];
    const data = sheet.getDataRange().getValues();
    const rows = data.slice(1);

    cpfs.forEach(cpf => {
      const targetCpf = String(cpf).replace(/\D/g, '');
      results[cpf] = rows
        .filter(row => {
          const rowCpf = String(row[6] || "").replace(/\D/g, '');
          const parecer = String(row[28] || "").trim();
          return rowCpf === targetCpf && parecer !== "";
        })
        .map(row => ({
          date: formatDataCompare(row[0]),
          parecer: String(row[28] || "N/A"),
          cid_tratamento: String(row[29] || "").trim(),
          cid_restricao: String(row[30] || "").trim(),
          cid_incapaz: String(row[31] || "").trim(),
          obs_dis: String(row[32] || "").trim(),
          obs_cartao: String(row[33] || "").trim(),
          n_sessao: String(row[34] || ""),
          dt_sessao: formatDataCompare(row[35]),
          validade: formatDataCompare(row[36]),
          type: String(row[16] || "Inspeção")
        }))
        .sort((a, b) => {
          const dA = a.date.split('/').reverse().join('');
          const dB = b.date.split('/').reverse().join('');
          return dB.localeCompare(dA);
        });
    });
    return results;
  } catch (e) {
    return { error: e.toString() };
  }
}
