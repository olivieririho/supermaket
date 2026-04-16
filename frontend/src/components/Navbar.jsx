function Navbar({ currentView, setView }) {
  return (
    <nav className="nav-bar">
      <button className={currentView === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}>
        Dashboard
      </button>
      <button className={currentView === 'products' ? 'active' : ''} onClick={() => setView('products')}>
        Products
      </button>
      <button className={currentView === 'customers' ? 'active' : ''} onClick={() => setView('customers')}>
        Customers
      </button>
      <button className={currentView === 'sales' ? 'active' : ''} onClick={() => setView('sales')}>
        Sales
      </button>
      <button className={currentView === 'reports' ? 'active' : ''} onClick={() => setView('reports')}>
        Reports
      </button>
    </nav>
  );
}

export default Navbar;
