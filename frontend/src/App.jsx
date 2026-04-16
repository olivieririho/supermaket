import { useEffect, useState } from 'react';
import Login from './components/Login';
import Products from './components/Products';
import Customers from './components/Customers';
import Sales from './components/Sales';
import Reports from './components/Reports';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('pos_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('pos_user', JSON.stringify({ ...userData, token }));
    setUser({ ...userData, token });
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('pos_user');
    setUser(null);
    setView('dashboard');
  };

  if (!user) {
    return <Login onLogin={handleLogin} setMessage={setMessage} />;
  }

  return (
    <div className="app-shell">
      <header className="header">
        <div>
          <h1>Supermarket POS</h1>
          <p>Efficient sales, stock control, and daily reporting for Kicukiro district</p>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <Navbar currentView={view} setView={setView} />

      <main className="main-content">
        {message && <div className="notification">{message}</div>}
        {view === 'dashboard' && (
          <section>
            <h2>Welcome, {user.name}</h2>
            <p>Use the menu to manage products, customers, process sales, and review daily revenue.</p>
          </section>
        )}
        {view === 'products' && <Products setMessage={setMessage} />}
        {view === 'customers' && <Customers setMessage={setMessage} />}
        {view === 'sales' && <Sales setMessage={setMessage} user={user} />}
        {view === 'reports' && <Reports setMessage={setMessage} />}
      </main>
    </div>
  );
}

export default App;
