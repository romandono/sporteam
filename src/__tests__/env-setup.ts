// Override env before app module loads
process.env.DB_CNN = '';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
