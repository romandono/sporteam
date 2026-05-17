import mongoose from 'mongoose';

beforeAll(async () => {
  await mongoose.connect(process.env.DB_CNN || '');
  (mongoose as any).Promise = global.Promise;
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});
