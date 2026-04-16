import { useEffect, useState } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../api';

const emptyProduct = { name: '', description: '', price: '', stock: '' };

function Products({ setMessage }) {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const result = await fetchProducts();
    setProducts(Array.isArray(result) ? result : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      const result = await updateProduct(editing.id, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      setMessage(result.message || 'Product updated successfully');
    } else {
      const result = await createProduct({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      setMessage(result.message || 'Product created successfully');
    }
    setForm(emptyProduct);
    setEditing(null);
    loadProducts();
  };

  const handleEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    });
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setMessage('Product removed');
    loadProducts();
  };

  return (
    <div>
      <section className="panel">
        <h2>Product Management</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <input value={form.name} placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input value={form.price} type="number" step="0.01" placeholder="Price" onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <input value={form.stock} type="number" placeholder="Stock" onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
          <input value={form.description} placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button type="submit">{editing ? 'Update Product' : 'Add Product'}</button>
        </form>
      </section>
      <section className="panel">
        <h3>Product List</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>{product.description}</td>
                <td>
                  <button onClick={() => handleEdit(product)}>Edit</button>
                  <button className="danger" onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Products;
