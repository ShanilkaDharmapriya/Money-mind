const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // ✅ import cors
const connectDB = require('./config/db');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const transactionRouts = require('./routes/transactionRouts');

require('dotenv').config();

dotenv.config();
connectDB();

const app = express();

// ✅ Enable CORS
app.use(cors({
    origin: 'http://localhost:5173', // your frontend URL
    credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRouts);
app.use('/api/budgets', require('./routes/budgetRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/currencys', require('./routes/currencyRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Server
if (process.env.NODE_ENV !== "test") {
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    module.exports = { app, server };
} else {
    module.exports = { app };
}
