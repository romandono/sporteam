import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import app from '../app';

const CONFIG_PATH = path.resolve(__dirname, '../../.mongodb-uri.json');

const connectDB = async () => {
  if (!process.env.DB_CNN) {
    const data = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    process.env.DB_CNN = data.uri;
  }
  await mongoose.connect(process.env.DB_CNN || '');
  (mongoose as any).Promise = global.Promise;
};

const disconnectDB = async () => {
  await mongoose.disconnect();
};

const cleanDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

export { app, connectDB, disconnectDB, cleanDB };
