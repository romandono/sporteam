import { S3Client } from '@aws-sdk/client-s3';

const getEnvOrThrow = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}. Check .env file.`);
  }
  return value;
};

export const R2_ENDPOINT = getEnvOrThrow('R2_ENDPOINT');
export const R2_ACCESS_KEY_ID = getEnvOrThrow('R2_ACCESS_KEY_ID');
export const R2_SECRET_ACCESS_KEY = getEnvOrThrow('R2_SECRET_ACCESS_KEY');
export const R2_BUCKET = getEnvOrThrow('R2_BUCKET');
export const R2_PUBLIC_URL = getEnvOrThrow('R2_PUBLIC_URL');
export const R2_PUBLIC_URL_PREFIX = R2_PUBLIC_URL.replace(/\/$/, '');

const r2 = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export default r2;
