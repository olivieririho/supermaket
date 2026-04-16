const BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const stored = localStorage.getItem('pos_user');
  if (!stored) return {};
  const { token } = JSON.parse(stored);
  return { Authorization: `Bearer ${token}` };
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export const fetchProducts = async () => {
  const response = await fetch(`${BASE_URL}/products`, { headers: getAuthHeaders() });
  return response.json();
};

export const createProduct = async (product) => {
  const response = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(product),
  });
  return response.json();
};

export const updateProduct = async (id, product) => {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(product),
  });
  return response.json();
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const fetchCustomers = async () => {
  const response = await fetch(`${BASE_URL}/customers`, { headers: getAuthHeaders() });
  return response.json();
};

export const createCustomer = async (customer) => {
  const response = await fetch(`${BASE_URL}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(customer),
  });
  return response.json();
};

export const updateCustomer = async (id, customer) => {
  const response = await fetch(`${BASE_URL}/customers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(customer),
  });
  return response.json();
};

export const deleteCustomer = async (id) => {
  const response = await fetch(`${BASE_URL}/customers/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const checkoutSale = async (payload) => {
  const response = await fetch(`${BASE_URL}/sales/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  return response.json();
};

export const fetchReport = async (startDate, endDate) => {
  const query = new URLSearchParams({ startDate, endDate }).toString();
  const response = await fetch(`${BASE_URL}/sales/report?${query}`, { headers: getAuthHeaders() });
  return response.json();
};

export const fetchSales = async () => {
  const response = await fetch(`${BASE_URL}/sales`, { headers: getAuthHeaders() });
  return response.json();
};
