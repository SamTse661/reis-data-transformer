const fs = require('fs');
const XLSX = require('xlsx');
import { tableCodeMapping } from '../const/master-list';
import { checkDropbox, createOutputDirectory } from '../utils/file';
import { logger } from './logger';

const processTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
const tableList = [];

const excelToJSON = () => {
  const xlsxFileName = checkDropbox();
  if (!xlsxFileName) {
    logger.error('Dropbox check failed. Exiting process.');
    return;
  }
  createOutputDirectory(processTimestamp);
  const xlsxFilePath = `dropbox/${xlsxFileName}`;
  const workbook = XLSX.readFile(xlsxFilePath);
  const sheetNameList = workbook.SheetNames;
  for (const sheetName of sheetNameList) {
    if (!tableCodeMapping[sheetName]) {
      console.warn(`No mapping found for sheet: ${sheetName}`);
      continue;
    }
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    fs.writeFileSync(`output/${processTimestamp}/PreProcessed/${sheetName}_pre.json`, JSON.stringify({
      tableName: tableCodeMapping[sheetName].name,
      tableCode: sheetName,
      data
    }), 'utf8');
    tableList.push(sheetName);
  }
};

const processJSONData = () => {
  for (const tableCode of tableList) {
    if (!tableCodeMapping[tableCode]) {
      console.warn(`No mapping found for table code: ${tableCode}`);
      continue;
    }
    const { handleFunction } = tableCodeMapping[tableCode];
    handleFunction(tableCode, processTimestamp);
  }
};

const generateSQLInsert = (a) => {
  for (const tableCode of tableList) {
    if (!tableCodeMapping[tableCode]) {
      console.warn(`No mapping found for table code: ${tableCode}`);
      continue;
    }
    const { sqlGenerator } = tableCodeMapping[tableCode];
    sqlGenerator(tableCode, processTimestamp);
  }
};

export const processREIS = async () => {
  try {
    excelToJSON();
    processJSONData();
    generateSQLInsert();
  } catch (error) {
    console.error(error);
  }
};
