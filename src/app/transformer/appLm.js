import { v4 as uuidv4 } from 'uuid';
import { tableCodeMapping } from '../const/master-list';
const fs = require('fs');

export const appLmTransformer = (tableCode, processTimestamp) => {
  let plaintText = fs.readFileSync(`output/${processTimestamp}/PreProcessed/${tableCode}_pre.json`, { encoding: 'utf8', flag: 'r' });
  plaintText = plaintText.replaceAll('45834.578148148146', '"2025-07-01 00:00:00"');

  const jsonData = JSON.parse(plaintText);
  const data = jsonData.data;
  const transformedData = generateUUIDForData(tableCode, data);
  fs.writeFileSync(`output/${processTimestamp}/Processing/${tableCode}_transform.json`, JSON.stringify({
    tableName: tableCodeMapping[tableCode].name,
    tableCode,
    data: transformedData
  }), 'utf8');
};

const generateUUIDForData = (tableCode, data) => {
  const idFiledName = tableCodeMapping[tableCode].idField;
  if (!idFiledName) {
    console.warn(`No ID field mapping found for table code: ${tableCode}`);
    throw new Error(`No ID field mapping found for table code: ${tableCode}`);
  }

  return data.map(row => {
    row.original_id = row[idFiledName];
    row[idFiledName] = uuidv4();
    // Additional Fields Here
    row.int_case_clerk_id = 'f1a17a03-7436-4ba6-83a0-0703496c3b04';
    row.int_case_officer_id = 'aa302bb6-ae94-41a8-bf8f-6a548a8b2e07';
    row.int_file_record_type = 'R';
    row.int_file_address_country = 'Hong Kong';
    row.int_file_address_area = '5e0a658a-d334-11ef-b7ac-0242ac130002';
    row.int_file_address_street = row.int_file_address_1;
    row.int_file_address_building_no = row.int_file_address_2 ?? null;

    // Fields needed to be removed
    delete row.int_file_address_1;
    delete row.int_file_address_2;

    return row;
  });
};

export const appLmSqlGenerator = (tableCode, processTimestamp) => {
  const transformedData = JSON.parse(fs.readFileSync(`output/${processTimestamp}/Processing/${tableCode}_transform.json`, { encoding: 'utf8', flag: 'r' })).data;
  delete transformedData[0].original_id;
  const columns = Object.keys(transformedData[0]);
  const values = transformedData.map(row => {
    return `(${columns.map(col => `${typeof row[col] == 'string' ? `'${row[col]}'` : `${row[col]}`}`).join(', ')})`;
  });
  let sql = `INSERT INTO ${tableCodeMapping[tableCode].name} (${columns.join(', ')}) VALUES \n${values.join(',\n')};\n`;
  sql = sql.replaceAll('undefined', 'NULL');
  fs.writeFileSync(`output/${processTimestamp}/SQL/${tableCode}_sql_insert.sql`, sql, 'utf8');
};
