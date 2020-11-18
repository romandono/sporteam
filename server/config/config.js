// =====================
// Puerto
// =====================
process.env.PORT = process.env.PORT || 3000;


// =====================
// Vencimiento del token
// =====================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// =====================
// Google Client ID
// =====================
process.env.CLIENT_ID = process.env.CLIENT_ID || '1065470350283-opnoc4ls4vkr45b0u2g42i4f6j6mutdb.apps.googleusercontent.com';