const pool = require('../config/db');

const getProducts = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM Products ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch products', error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM Products WHERE id = ?', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Unable to retrieve product', error: error.message });
  }
};

const createProduct = async (req, res) => {
  const { name, description, price, stock } = req.body;
  if (!name || price == null || stock == null) {
    return res.status(400).json({ message: 'Name, price and stock are required' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO Products (name, description, price, stock) VALUES (?, ?, ?, ?)',
      [name, description || '', price, stock]
    );
    res.status(201).json({ id: result.insertId, name, description, price, stock });
  } catch (error) {
    res.status(500).json({ message: 'Unable to create product', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { name, description, price, stock } = req.body;
  try {
    const [result] = await pool.execute(
      'UPDATE Products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?',
      [name, description || '', price, stock, req.params.id]
    );
    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ id: req.params.id, name, description, price, stock });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update product', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM Products WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete product', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
