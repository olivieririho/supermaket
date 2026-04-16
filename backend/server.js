const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const customersRoutes = require('./routes/customers');
const salesRoutes = require('./routes/sales');
const pool = require('./config/db');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/sales', salesRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Supermarket POS Backend' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await pool.getConnection();
    console.log('Connected to MySQL database.');
  } catch (error) {
    console.error('Unable to connect to MySQL:', error.message);
  }
  console.log(`Server running on port ${PORT}`);
});
