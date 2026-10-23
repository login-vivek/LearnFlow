require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('\n┌─────────────────────────────────────────┐');
    console.log('│       TUF Clone Server Ready             │');
    console.log('├─────────────────────────────────────────┤');
    console.log(`│  Backend  →  http://localhost:${PORT}         │`);
    console.log(`│  Frontend →  http://localhost:5173       │`);
    console.log(`│  Env      →  ${(process.env.NODE_ENV || 'development').padEnd(27)}│`);
    console.log('└─────────────────────────────────────────┘\n');
  });
});
