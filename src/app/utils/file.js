import { logger } from '../services/logger';
const fs = require('fs');

export const checkDropbox = () => {
  // Check if XLSX file exists on dropbox
  const fileList = fs.readdirSync('dropbox');
  logger.info(`Found XLSX file: ${fileList}`);
  // Return the first XLSX file found
  if (fileList.length === 1 && fileList[0].endsWith('.xlsx')) {
    logger.info(`Single XLSX file found: ${fileList[0]}`);
    return fileList[0];
  }
  // If there are multiple files, return the first one that ends with .xlsx
  return fileList.find(file => file.endsWith('.xlsx')) || false;
};

export const createOutputDirectory = (processTimestamp) => {
  // Create output directory with timestamp
  const outputParentDir = 'output';
  if (!fs.existsSync(outputParentDir)) {
    fs.mkdirSync(outputParentDir, { recursive: true });
    logger.info(`Output Parent directory created: ${outputParentDir}`);
  }
  const outputDir = `output/${processTimestamp}`;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    logger.info(`Output directory created: ${outputDir}`);
  }
  const outputPreProcessedDir = `${outputDir}/PreProcessed`;
  if (!fs.existsSync(outputPreProcessedDir)) {
    fs.mkdirSync(outputPreProcessedDir, { recursive: true });
    logger.info(`PreProcessed directory created: ${outputPreProcessedDir}`);
  }
  const outputProcessingDir = `${outputDir}/Processing`;
  if (!fs.existsSync(outputProcessingDir)) {
    fs.mkdirSync(outputProcessingDir, { recursive: true });
    logger.info(`Processing directory created: ${outputProcessingDir}`);
  }

  const outputSQLDir = `${outputDir}/SQL`;
  if (!fs.existsSync(outputSQLDir)) {
    fs.mkdirSync(outputSQLDir, { recursive: true });
    logger.info(`SQL directory created: ${outputSQLDir}`);
  }
};
