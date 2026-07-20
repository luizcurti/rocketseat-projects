import fs from 'node:fs';
import { parse } from 'csv-parse';

export interface TaskCsvRow {
  title: string;
  description: string;
}

export const readTasksCsv = async (filePath: string): Promise<TaskCsvRow[]> => {
  const records: TaskCsvRow[] = [];

  const parser = fs
    .createReadStream(filePath)
    .pipe(parse({ columns: true, trim: true, skip_empty_lines: true }));

  for await (const record of parser) {
    records.push({
      title: (record as Record<string, string>).title,
      description: (record as Record<string, string>).description,
    });
  }

  return records;
};
