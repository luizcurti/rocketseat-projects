import { readTasksCsv, type TaskCsvRow } from './read-tasks-csv.js';

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

type FetchLike = (url: string, init?: FetchOptions) => Promise<{ ok: boolean; status: number }>;
type ReadTasksCsvFn = (filePath: string) => Promise<TaskCsvRow[]>;

interface ImportOptions {
  csvFilePath: string;
  apiBaseUrl: string;
  concurrency?: number;
  fetchImpl?: FetchLike;
  readTasksCsvImpl?: ReadTasksCsvFn;
}

interface ImportSummary {
  total: number;
  imported: number;
  failed: number;
  skipped: number;
  errors: Array<{ index: number; reason: string }>;
}

const createQueueRunner = async <T>(
  items: T[],
  worker: (item: T, index: number) => Promise<void>,
  concurrency: number,
): Promise<void> => {
  let nextIndex = 0;

  const runner = async (): Promise<void> => {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      await worker(items[currentIndex], currentIndex);
    }
  };

  const workers = Array.from({ length: Math.max(1, concurrency) }, () => runner());
  await Promise.all(workers);
};

export const importTasksFromCsv = async (options: ImportOptions): Promise<ImportSummary> => {
  const { csvFilePath, apiBaseUrl, concurrency = 5 } = options;
  /* istanbul ignore next */
  const fetchImpl: FetchLike = options.fetchImpl ?? (fetch as unknown as FetchLike);
  /* istanbul ignore next */
  const readTasksCsvImpl: ReadTasksCsvFn = options.readTasksCsvImpl ?? readTasksCsv;

  const tasks = await readTasksCsvImpl(csvFilePath);

  const summary: ImportSummary = {
    total: tasks.length,
    imported: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  await createQueueRunner(
    tasks,
    async (task, index) => {
      if (!task.title || !task.description) {
        summary.skipped += 1;
        summary.errors.push({ index, reason: 'Missing title or description.' });
        return;
      }

      try {
        const response = await fetchImpl(`${apiBaseUrl}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task),
        });

        if (!response.ok) {
          summary.failed += 1;
          summary.errors.push({ index, reason: `HTTP ${response.status}` });
          return;
        }

        summary.imported += 1;
      } catch (error) {
        summary.failed += 1;
        summary.errors.push({
          index,
          reason: error instanceof Error ? error.message : String(error),
        });
      }
    },
    concurrency,
  );

  return summary;
};
