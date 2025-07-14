import { v4 as uuidv4 } from 'uuid';
import { tableCodeMapping } from '../const/master-list';
const fs = require('fs');

export const appAssessmentTransformer = (tableCode, processTimestamp) => {
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
    row.original_property_id = row.int_property_id;

    row.int_property_id = lookupExternalTableTd('int_009', processTimestamp, row.int_property_id);

    return row;
  });
};

export const appAssessmentSqlGenerator = (tableCode, processTimestamp) => {
  const transformedData = JSON.parse(fs.readFileSync(`output/${processTimestamp}/Processing/${tableCode}_transform.json`, { encoding: 'utf8', flag: 'r' })).data;
  delete transformedData[0].original_id;
  delete transformedData[0].original_property_id;
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
    delete row.original_property_id;
    row.int_appAssessment_is_del = row.int_appAssessment_is_del == 1;
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

export const specialHandleForAppAssessment = (tableCode, processTimestamp) => {
  const transformedData = JSON.parse(fs.readFileSync(`output/${processTimestamp}/Processed/${tableCode}_processed.json`, { encoding: 'utf8', flag: 'r' }));
  let i = 0;
  const assessId = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201

  ];
  for (const row of transformedData) {
    row.int_app_assessment_create_date = '2025-07-04 00:00:00';
    row.int_app_assessment_update_date = '2025-07-04 00:00:00';
    row.int_app_assessment_create_by = '72e9fc3d-2061-4ad2-a1b3-24c711e82fed';
    row.int_app_assessment_update_by = '72e9fc3d-2061-4ad2-a1b3-24c711e82fed';
    row.int_app_assessment_id = uuidv4();
    // row.original_app_id = assessId[i];
    row.int_app_id = lookupExternalTableTd('int_002', processTimestamp, assessId[i++]);

    delete row.int_assessment_create_date;
    delete row.int_assessment_update_date;
    delete row.int_assessment_create_by;
    delete row.int_assessment_update_by;
    delete row.int_assessment_is_del;
    delete row.int_assessment_no;
    delete row.int_assessment_usage;
    delete row.int_property_id;
    delete row.int_assessment_no_deletion_date;
    delete row.int_assessment_no_effective_date;
    delete row.original_app_id;
  }
  fs.writeFileSync(`output/${processTimestamp}/Processed/${tableCode}_processed.json`, JSON.stringify(transformedData, null, 2), 'utf8');
};
