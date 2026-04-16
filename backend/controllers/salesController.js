const pool = require('../config/db');

const checkout = async (req, res) => {
  const { customerId, items } = req.body;
  if (!customerId || !Array.isArray(items) || !items.length) {
    return res.status(400).json({ message: 'Customer and cart items are required' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [customerRows] = await connection.execute('SELECT id FROM Customers WHERE id = ?', [customerId]);
    if (!customerRows.length) {
      await connection.rollback();
      return res.status(400).json({ message: 'Customer not found' });
    }

    const productIds = items.map((item) => item.productId);
    const [products] = await connection.query(
      `SELECT id, name, price, stock FROM Products WHERE id IN (${productIds.map(() => '?').join(',')})`,
      productIds
    );

    const outOfStock = [];
    const saleDetails = [];
    let total = 0;

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        outOfStock.push(`Product ID ${item.productId} not found`);
        continue;
      }
      if (item.quantity > product.stock) {
        outOfStock.push(`${product.name} has only ${product.stock} units available`);
      }
      const lineTotal = product.price * item.quantity;
      saleDetails.push({ productId: product.id, quantity: item.quantity, unitPrice: product.price, lineTotal });
      total += lineTotal;
    }

    if (outOfStock.length) {
      await connection.rollback();
      return res.status(400).json({ message: 'Stock issue detected', details: outOfStock });
    }

    const [saleResult] = await connection.execute(
      'INSERT INTO Sales (customer_id, user_id, total_amount) VALUES (?, ?, ?)',
      [customerId, req.user.id, total]
    );
    const saleId = saleResult.insertId;

    const saleDetailPromises = saleDetails.map((detail) =>
      connection.execute(
        'INSERT INTO Sale_Details (sale_id, product_id, quantity, unit_price, line_total) VALUES (?, ?, ?, ?, ?)',
        [saleId, detail.productId, detail.quantity, detail.unitPrice, detail.lineTotal]
      )
    );

    await Promise.all(saleDetailPromises);

    const updateStockPromises = saleDetails.map((detail) =>
      connection.execute('UPDATE Products SET stock = stock - ? WHERE id = ?', [detail.quantity, detail.productId])
    );
    await Promise.all(updateStockPromises);

    await connection.commit();
    res.status(201).json({ saleId, total, items: saleDetails });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Unable to process sale', error: error.message });
  } finally {
    connection.release();
  }
};

const getSales = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT s.id, s.sale_date, s.total_amount, c.name AS customer_name, u.name AS cashier
       FROM Sales s
       JOIN Customers c ON s.customer_id = c.id
       JOIN Users u ON s.user_id = u.id
       ORDER BY s.sale_date DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch sales', error: error.message });
  }
};

const getReport = async (req, res) => {
  const { startDate, endDate } = req.query;
  const start = startDate || new Date().toISOString().slice(0, 10);
  const end = endDate || start;

  try {
    const [rows] = await pool.execute(
      `SELECT DATE(s.sale_date) AS sale_date, COUNT(*) AS transactions, SUM(s.total_amount) AS revenue
       FROM Sales s
       WHERE DATE(s.sale_date) BETWEEN ? AND ?
       GROUP BY DATE(s.sale_date)
       ORDER BY sale_date DESC`,
      [start, end]
    );
    res.json({ startDate: start, endDate: end, dailySummary: rows });
  } catch (error) {
    res.status(500).json({ message: 'Unable to generate report', error: error.message });
  }
};

module.exports = { checkout, getSales, getReport };
