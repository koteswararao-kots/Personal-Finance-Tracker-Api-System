const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cron = require('node-cron');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Route imports
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const ledgerRoutes = require('./routes/ledgerRoutes');
const { triggerNotifications } = require('./jobs/notificationJob');

// Connect to MongoDB
connectDB();

// App initialization
const app = express();
app.use(express.json());
app.use(morgan('dev'));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/score', scoreRoutes);
app.use('/api/ledger', ledgerRoutes);

// Notification cron job: runs every minute
cron.schedule('* * * * *', triggerNotifications);

// Start server on port defined in env 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
