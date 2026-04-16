import { useEffect, useState } from 'react';
import { fetchProducts, fetchCustomers, checkoutSale, fetchSales } from '../api';

function Sales({ setMessage, user }) {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sales, setSales] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [cart, setCart] = useState([]);
  const [errors, setErrors] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const productsResult = await fetchProducts();
    const customersResult = await fetchCustomers();
    const salesResult = await fetchSales();
    setProducts(Array.isArray(productsResult) ? productsResult : []);
    setCustomers(Array.isArray(customersResult) ? customersResult : []);
    setSales(Array.isArray(salesResult) ? salesResult : []);
  };

  const addProductToCart = (product) => {
    setErrors('');
    const existing = cart.find((item) => item.productId === product.id);
    if (existing) {
      setCart(cart.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { productId: product.id, name: product.name, price: product.price, stock: product.stock, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, quantity) => {
    setCart(cart.map((item) => item.productId === productId ? { ...item, quantity } : item));
  };

  const removeItem = (productId) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const processSale = async () => {
    setErrors('');
    if (!selectedCustomer) {
      setErrors('Select a customer before checkout.');
      return;
    }
    if (!cart.length) {
      setErrors('Add at least one product to the sales cart.');
      return;
    }
    const invalidStock = cart.filter((item) => item.quantity > item.stock);
    if (invalidStock.length) {
      setErrors(`Insufficient stock for ${invalidStock.map((item) => item.name).join(', ')}`);
      return;
    }

    const payload = {
      customerId: Number(selectedCustomer),
      items: cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
    };
    const result = await checkoutSale(payload);
    if (result.saleId) {
      setMessage(`Sale completed, total: ${total.toFixed(2)}`);
      setCart([]);
      setSelectedCustomer('');
      loadData();
    } else {
      setErrors(result.message || 'Unable to complete sale');
    }
  };

  return (
    <div>
      <section className="panel">
        <h2>Sales Processing</h2>
        <div className="sales-grid">
          <div className="card">
            <h3>Select Customer</h3>
            <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
              <option value="">-- Choose Customer --</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>{customer.name}</option>
              ))}
            </select>
            <h3>Product Catalog</h3>
            <div className="product-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <strong>{product.name}</strong>
                  <span>Price: {product.price.toFixed(2)}</span>
                  <span>Stock: {product.stock}</span>
                  <button onClick={() => addProductToCart(product)} disabled={product.stock <= 0}>
                    Add to cart
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3>Cart</h3>
            {cart.length === 0 ? <p>No items in the cart yet.</p> : null}
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.productId}>
                    <td>{item.name}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        max={item.stock}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                      />
                    </td>
                    <td>{(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button className="danger" onClick={() => removeItem(item.productId)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="checkout-summary">
              <strong>Total: {total.toFixed(2)}</strong>
              <button onClick={processSale} disabled={!cart.length}>Checkout</button>
            </div>
            {errors && <div className="error-message">{errors}</div>}
          </div>
        </div>
      </section>
      <section className="panel">
        <h3>Recent Sales</h3>
        <table>
          <thead>
            <tr>
              <th>Sale ID</th>
              <th>Customer</th>
              <th>Cashier</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.id}</td>
                <td>{sale.customer_name}</td>
                <td>{sale.cashier}</td>
                <td>{sale.total_amount.toFixed(2)}</td>
                <td>{new Date(sale.sale_date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Sales;
