import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export async function gerarExcel(logExec) {
  console.log("logExec recebidos:", logExec.length);

  const modeloUrl = "/Acompanhamento.xlsx";

  const response = await fetch(modeloUrl);
  const arrayBuffer = await response.arrayBuffer();

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);

  const worksheet = workbook.getWorksheet(1);

  console.log("Worksheet carregada:", worksheet.name);
  console.log("Linhas antes:", worksheet.rowCount);

  // Inserir linhas dinamicamente
  logExec.forEach((item) => {
    worksheet.addRow([
      item.ID_MRH,
      item.Empresa,
      item.Filial,
      item.Colaborador,
      item.Matricula,
      item.Ultimo_Dia_Trabalhado,
      item.Data_Limite_Pagamento,
      item.Data_Limite_Calculo,
      item.Obs_Processo,
      new Date(item.Data_Processo).toLocaleString("pt-BR")
    ]);
  });

  console.log("Linhas depois:", worksheet.rowCount);

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "acompanhamento.xlsx");
}
