import { processREIS } from './services/data-transformer';
import { logger } from './services/logger';

const main = async () => {
  logger.info('Starting REIS data processing');
  try {
    await processREIS();
  } catch (error) {
    logger.error('Error processing REIS data:', error);
    throw error; // Re-throw to ensure the error is caught in the main function
  } finally {
    logger.info('REIS data processing completed');
  }
};

export default main;
export const clear = async () => {
  logger.info('Clearing');
  logger.clear();
};
