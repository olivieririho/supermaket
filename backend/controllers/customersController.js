const pool = require('../config/db');

const getCustomers = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM Customers ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch customers', error: error.message });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM Customers WHERE id = ?', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Unable to retrieve customer', error: error.message });
  }
};

const createCustomer = async (req, res) => {
  const { name, phone, email, address } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ message: 'Customer name and phone are required' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO Customers (name, phone, email, address) VALUES (?, ?, ?, ?)',
      [name, phone, email || '', address || '']
    );
    res.status(201).json({ id: result.insertId, name, phone, email, address });
  } catch (error) {
    res.status(500).json({ message: 'Unable to create customer', error: error.message });
  }
};

const updateCustomer = async (req, res) => {
  const { name, phone, email, address } = req.body;
  try {
    const [result] = await pool.execute(
      'UPDATE Customers SET name = ?, phone = ?, email = ?, address = ? WHERE id = ?',
      [name, phone, email || '', address || '', req.params.id]
    );
    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ id: req.params.id, name, phone, email, address });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update customer', error: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM Customers WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete customer', error: error.message });
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
