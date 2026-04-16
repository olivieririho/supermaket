import { useState } from 'react';
import { loginUser } from '../api';

function Login({ onLogin, setMessage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await loginUser(email, password);
    if (result.token) {
      onLogin(result.user, result.token);
      setMessage('Login successful');
    } else {
      setError(result.message || 'Unable to login');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Supermarket POS Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default Login;
