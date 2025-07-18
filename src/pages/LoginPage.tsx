
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import matanuskaLogo from '../assets/matanuska-logo.png';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple check for demo
    if (username === 'heinrich@matanuska.co.za' && password) {
      // TODO: Replace with real auth
      localStorage.setItem('user', username);
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8">
      <div className="flex flex-col items-center mb-6">
        <img src={matanuskaLogo} alt="Matanuska Logo" className="h-16 mb-2 object-contain" style={{ filter: 'brightness(0.9) saturate(0.8)' }} />
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Sign In</h1>
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="email"
            className="form-input"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">Sign In</button>
      </form>
      <div className="w-full max-w-3xl mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-lg bg-yellow-100 p-6 text-center shadow-sm">
          <div className="text-lg font-bold mb-2 text-yellow-900">Reliability</div>
          <div className="text-sm text-yellow-900">Emphasizing dependability and consistently delivering on commitments.</div>
        </div>
        <div className="rounded-lg bg-yellow-100 p-6 text-center shadow-sm">
          <div className="text-lg font-bold mb-2 text-yellow-900">Responsibility</div>
          <div className="text-sm text-yellow-900">Highlighting ownership and accountability for one's work.</div>
        </div>
        <div className="rounded-lg bg-yellow-100 p-6 text-center shadow-sm">
          <div className="text-lg font-bold mb-2 text-yellow-900">Organisation</div>
          <div className="text-sm text-yellow-900">Focusing on strategic thinking, planning, and objective setting to address key matters.</div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
