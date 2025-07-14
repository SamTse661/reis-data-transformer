import { tableCodeMapping } from '../const/master-list';
import { specialHandleForAppAssessment } from '../transformer/appAssessment';
import { specialHandleForAppLm, specialHandleForAppLmt } from '../transformer/appLm';
import { checkDropbox, createOutputDirectory } from '../utils/file';
import { logger } from './logger';
const fs = require('fs');
const XLSX = require('xlsx');

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

const combineAllSQLFiles = () => {
  const sqlFiles = fs.readdirSync(`output/${processTimestamp}/SQL`);
  let combinedSQL = '';
  for (const file of sqlFiles) {
    if (file.endsWith('_sql_insert.sql')) {
      const filePath = `output/${processTimestamp}/SQL/${file}`;
      const sqlContent = fs.readFileSync(filePath, 'utf8');
      combinedSQL += sqlContent + '\n';
    }
  }
  fs.writeFileSync(`output/${processTimestamp}/SQL/combined_sql_insert.sql`, combinedSQL, 'utf8');
};

export const processREIS = async () => {
  try {
    // excelToJSON();
    // processJSONData();
    // generateSQLInsert();
    // combineAllSQLFiles();

    // specialHandleForAppAssessment('int_080', '2025-07-06T15-41-59-468Z');
    specialHandleForAppLm('int_001', '2025-07-06T15-41-59-468Z');
  } catch (error) {
    console.error(error);
  }
};
