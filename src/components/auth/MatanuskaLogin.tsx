import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { matanuskaLogoBase64 } from '../../assets/matanuska-logo-base64';

// UI Components
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Input } from '../ui/FormElements';

export default function MatanuskaLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Valid credentials for testing/demo
  const VALID_USERNAME = 'henrich@matanuska.co.za';
  const VALID_PASSWORD = 'mat123456';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (email === VALID_USERNAME && password === VALID_PASSWORD) {
      // Store user info in localStorage if remember me is checked
      if (rememberMe) {
        localStorage.setItem('user', email);
      } else {
        sessionStorage.setItem('user', email);
      }
      
      // Redirect to dashboard
      navigate('/dashboard');
      setError('');
    } else {
      setError('Incorrect username or password');
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#174f97] overflow-hidden">
      {/* Background image overlay - mountains silhouette at the bottom */}
      <div className="absolute bottom-0 w-full h-1/2 bg-cover bg-bottom opacity-20" 
           style={{backgroundImage: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')"}} />
      
      {/* Centered floating logo */}
      <div className="mt-16 mb-2 z-20 flex justify-center">
        <div 
          className="h-40 md:h-48 w-auto rounded-lg shadow-2xl border-4 border-white/90 overflow-hidden"
          style={{ background: '#174f97', maxWidth: '90vw' }}
        >
          <img
            src={matanuskaLogoBase64}
            alt="Matanuska Logo"
            className="h-full w-auto"
          />
        </div>
      </div>

      {/* Login card */}
      <div className="relative z-20 w-full max-w-md mx-auto mt-2">
        <Card className="bg-white/80 shadow-2xl rounded-2xl border border-blue-100 backdrop-blur-md">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-4 text-center">Sign In</h2>
            
            {error && <div className="text-red-600 mb-4 text-sm text-center">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="text-blue-900 block mb-2">Email Address</label>
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="text-blue-900 block mb-2">Password</label>
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                    className="mr-2 accent-blue-900"
                  />
                  <label htmlFor="remember" className="text-blue-900">Remember Me</label>
                </div>
                <a href="#" className="text-sm text-blue-700 hover:underline">Lost your password?</a>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-yellow-400 text-blue-900 font-bold py-2 rounded-xl shadow hover:bg-yellow-300 transition"
              >
                Sign in now
              </Button>
            </form>
            
            <p className="text-xs text-blue-900/80 text-center mt-6">
              By clicking on "Sign in now" you agree to our <a href="#" className="underline font-medium">Terms of Service</a> & <a href="#" className="underline font-medium">Privacy Policy</a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
