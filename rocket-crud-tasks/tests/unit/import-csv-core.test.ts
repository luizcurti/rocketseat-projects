import { importTasksFromCsv } from '../../src/scripts/import-csv-core.js';
import type { TaskCsvRow } from '../../src/scripts/read-tasks-csv.js';

describe('importTasksFromCsv', () => {
  it('imports tasks with summary, skipping and failing rows', async () => {
    const readTasksCsvImpl = async (): Promise<TaskCsvRow[]> => [
      { title: 'Task A', description: 'Desc A' },
      { title: '', description: 'Missing title' },
      { title: 'Task C', description: 'Desc C' },
    ];

    let callCount = 0;
    const fetchMock = async (): Promise<{ ok: boolean; status: number }> => {
      callCount += 1;
      if (callCount === 1) {
        return { ok: true, status: 201 };
      }

      return { ok: false, status: 500 };
    };

    const summary = await importTasksFromCsv({
      csvFilePath: 'tasks.csv',
      apiBaseUrl: 'http://localhost:3333',
      concurrency: 2,
      fetchImpl: fetchMock,
      readTasksCsvImpl,
    });

    expect(summary.total).toBe(3);
    expect(summary.imported).toBe(1);
    expect(summary.failed).toBe(1);
    expect(summary.skipped).toBe(1);
    expect(summary.errors).toHaveLength(2);
  });

  it('records error reason when fetch throws a network error', async () => {
    const readTasksCsvImpl = async (): Promise<TaskCsvRow[]> => [
      { title: 'Task A', description: 'Desc A' },
    ];

    const fetchMock = async (): Promise<{ ok: boolean; status: number }> => {
      throw new Error('Network error');
    };

    const summary = await importTasksFromCsv({
      csvFilePath: 'tasks.csv',
      apiBaseUrl: 'http://localhost:3333',
      fetchImpl: fetchMock,
      readTasksCsvImpl,
    });

    expect(summary.failed).toBe(1);
    expect(summary.errors[0].reason).toBe('Network error');
  });

  it('records string representation when a non-Error is thrown', async () => {
    const readTasksCsvImpl = async (): Promise<TaskCsvRow[]> => [
      { title: 'Task A', description: 'Desc A' },
    ];

    const fetchMock = async (): Promise<{ ok: boolean; status: number }> => {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw 'plain string error';
    };

    const summary = await importTasksFromCsv({
      csvFilePath: 'tasks.csv',
      apiBaseUrl: 'http://localhost:3333',
      fetchImpl: fetchMock,
      readTasksCsvImpl,
    });

    expect(summary.failed).toBe(1);
    expect(summary.errors[0].reason).toBe('plain string error');
  });

  it('handles concurrency of zero by running at least one worker', async () => {
    const readTasksCsvImpl = async (): Promise<TaskCsvRow[]> => [
      { title: 'Task A', description: 'Desc A' },
    ];

    const fetchMock = async (): Promise<{ ok: boolean; status: number }> => ({
      ok: true,
      status: 201,
    });

    const summary = await importTasksFromCsv({
      csvFilePath: 'tasks.csv',
      apiBaseUrl: 'http://localhost:3333',
      concurrency: 0,
      fetchImpl: fetchMock,
      readTasksCsvImpl,
    });

    expect(summary.imported).toBe(1);
  });
});
