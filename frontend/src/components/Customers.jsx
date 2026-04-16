import { useEffect, useState } from 'react';
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer } from '../api';

const emptyCustomer = { name: '', phone: '', email: '', address: '' };

function Customers({ setMessage }) {
  const [customers, setCustomers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyCustomer);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const result = await fetchCustomers();
    setCustomers(Array.isArray(result) ? result : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      const result = await updateCustomer(editing.id, form);
      setMessage(result.message || 'Customer updated successfully');
    } else {
      const result = await createCustomer(form);
      setMessage(result.message || 'Customer added successfully');
    }
    setForm(emptyCustomer);
    setEditing(null);
    loadCustomers();
  };

  const handleEdit = (customer) => {
    setEditing(customer);
    setForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
    });
  };

  const handleDelete = async (id) => {
    await deleteCustomer(id);
    setMessage('Customer removed');
    loadCustomers();
  };

  return (
    <div>
      <section className="panel">
        <h2>Customer Management</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <input value={form.name} placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input value={form.phone} placeholder="Phone" onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <input value={form.email} placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input value={form.address} placeholder="Address" onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <button type="submit">{editing ? 'Update Customer' : 'Add Customer'}</button>
        </form>
      </section>
      <section className="panel">
        <h3>Customer List</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{customer.email}</td>
                <td>{customer.address}</td>
                <td>
                  <button onClick={() => handleEdit(customer)}>Edit</button>
                  <button className="danger" onClick={() => handleDelete(customer.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Customers;
