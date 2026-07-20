import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { readTasksCsv } from '../../src/scripts/read-tasks-csv.js';

describe('readTasksCsv', () => {
  it('reads task rows from a CSV file', async () => {
    const tempFile = path.join(os.tmpdir(), `tasks-${Date.now()}.csv`);

    await fs.writeFile(
      tempFile,
      'title,description\nTask A,Description A\nTask B,Description B\n',
      'utf8',
    );

    const rows = await readTasksCsv(tempFile);

    expect(rows).toEqual([
      { title: 'Task A', description: 'Description A' },
      { title: 'Task B', description: 'Description B' },
    ]);

    await fs.unlink(tempFile);
  });
});
