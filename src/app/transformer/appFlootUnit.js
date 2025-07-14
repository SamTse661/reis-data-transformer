import { v4 as uuidv4 } from 'uuid';
import { tableCodeMapping } from '../const/master-list';
const fs = require('fs');

export const appFloorUnitTransformer = (tableCode, processTimestamp) => {
  let plaintText = fs.readFileSync(`output/${processTimestamp}/PreProcessed/${tableCode}_pre.json`, { encoding: 'utf8', flag: 'r' });
  plaintText = plaintText.replaceAll('45834.578148148146', '"2025-07-01 00:00:00"');

  const jsonData = JSON.parse(plaintText);
  const data = jsonData.data;
  const transformedData = generateUUIDForData(tableCode, data, processTimestamp);
  fs.writeFileSync(`output/${processTimestamp}/Processing/${tableCode}_transform.json`, JSON.stringify({
    tableName: tableCodeMapping[tableCode].name,
    tableCode,
    data: transformedData
  }), 'utf8');
};

const generateUUIDForData = (tableCode, data, processTimestamp) => {
  const idFiledName = tableCodeMapping[tableCode].idField;
  if (!idFiledName) {
    console.warn(`No ID field mapping found for table code: ${tableCode}`);
    throw new Error(`No ID field mapping found for table code: ${tableCode}`);
  }

  return data.map(row => {
    row.original_id = row[idFiledName];
    row[idFiledName] = uuidv4();

    // Additional Fields Here

    // Fields needed to be removed

    // Get Mapping of int_app_id and int_file_id
    row.original_app_id = row.int_app_id;
    row.original_assessment_id = row.int_assessment_id;

    row.int_app_id = lookupExternalTableTd('int_002', processTimestamp, row.int_app_id);
    row.int_assessment_id = lookupExternalTableTd('int_012', processTimestamp, row.int_assessment_id);

    return row;
  });
};

export const appFloorUnitSqlGenerator = (tableCode, processTimestamp) => {
  const transformedData = JSON.parse(fs.readFileSync(`output/${processTimestamp}/Processing/${tableCode}_transform.json`, { encoding: 'utf8', flag: 'r' })).data;
  delete transformedData[0].original_id;
  delete transformedData[0].original_app_id;
  delete transformedData[0].original_assessment_id;
  const columns = Object.keys(transformedData[0]);
  const values = transformedData.map(row => {
    return `(${columns.map(col => `${typeof row[col] == 'string' ? `'${row[col]}'` : `${row[col]}`}`).join(', ')})`;
  });
  let sql = `INSERT INTO ${tableCodeMapping[tableCode].name} (${columns.join(', ')}) VALUES \n${values.join(',\n')};\n`;
  sql = sql.replaceAll('undefined', 'NULL');
  fs.writeFileSync(`output/${processTimestamp}/SQL/${tableCode}_sql_insert.sql`, sql, 'utf8');

  // Export as JSON List
  for (const row of transformedData) {
    delete row.original_id;
    delete row.original_app_id;
    delete row.original_assessment_id;
    row.int_is_floor_unit_apply = row.int_is_floor_unit_apply == 1;
    row.int_is_applicant_owner = row.int_is_applicant_owner == 1;
    row.int_floor_unit_ubw_applicant = row.int_floor_unit_ubw_applicant == 1;
    row.int_property_floor_unit_now = row.int_property_floor_unit_now == 1;
  }
  fs.writeFileSync(`output/${processTimestamp}/Processed/${tableCode}_processed.json`, JSON.stringify(transformedData, null, 2), 'utf8');
};

export const lookupExternalTableTd = (tableCode, processTimestamp, targetId) => {
  const transformedData = JSON.parse(fs.readFileSync(`output/${processTimestamp}/Processing/${tableCode}_transform.json`, { encoding: 'utf8', flag: 'r' }));
  if (!transformedData || transformedData.length === 0) {
    console.warn(`No data found for table code: ${tableCode}`);
  }
  const idFiledName = tableCodeMapping[tableCode].idField;
  if (!idFiledName) {
    console.warn(`No ID field mapping found for table code: ${tableCode}`);
    throw new Error(`No ID field mapping found for table code: ${tableCode}`);
  }

  const { data } = transformedData;
  for (const row of data) {
    if (row.original_id == targetId) {
      return row[idFiledName];
    }
  }
  return null;
};
