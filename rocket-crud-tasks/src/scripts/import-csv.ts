import { importTasksFromCsv } from './import-csv-core.js';

const CSV_FILE_PATH = process.argv[2] || 'tasks.csv';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3333';
const IMPORT_CONCURRENCY = Number(process.env.IMPORT_CONCURRENCY || 5);

const importTasks = async (): Promise<void> => {
  const summary = await importTasksFromCsv({
    csvFilePath: CSV_FILE_PATH,
    apiBaseUrl: API_BASE_URL,
    concurrency: IMPORT_CONCURRENCY,
  });

  console.log(JSON.stringify({ file: CSV_FILE_PATH, ...summary }));
};

importTasks().catch((error) => {
  console.error('CSV import failed:', error);
  process.exit(1);
});
