import dotenv from 'dotenv';

const envFilePath = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

dotenv.config({ path: envFilePath });

const requiredKeys = ['DATABASE_URL'] as const;

for (const key of requiredKeys) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT || 3333),
  databaseUrl: process.env.DATABASE_URL as string,
  nodeEnv: process.env.NODE_ENV || 'development',
};
