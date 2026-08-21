import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database';
import routes from './routes';
import { startKeepAlive } from './config/keepAlive';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ── Health endpoint (must be before auth middleware) ──
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'LMS Backend is running', ts: Date.now() });
});

app.use('/api', routes);

import { runAutoMigrations } from './config/autoMigrate';

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync models (alter: true is safe for dev; use migrations in production)
    await sequelize.sync({ alter: true });

    // Run safe auto-migrations for missing columns and large data types
    await runAutoMigrations(sequelize);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);

      // Start keep-alive cron AFTER server is listening
      startKeepAlive();
    });

  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

