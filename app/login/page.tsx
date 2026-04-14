'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setAdminSession, isAdminLoggedIn } from '@/lib/storage';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if already logged in
    if (isAdminLoggedIn()) {
      router.push('/admin');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username === 'admin' && password === 'admin0123') {
      setAdminSession();
      router.push('/admin');
    } else {
      setError('Invalid username or password');
    }
  };

  if (!mounted) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Admin Login</h1>
            <p>Official FF Community</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="login-button">
              Login
            </button>
          </form>

          <p className="login-hint">Demo: admin / admin0123</p>

          <Link href="/">
            <button type="button" className="view-button" style={{ width: '100%', marginTop: '15px' }}>
              Back to Home
            </button>
          </Link>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="navbar">
        <Link href="/" className="nav-link">
          Home
        </Link>
        <Link href="/category" className="nav-link">
          Categories
        </Link>
      </nav>
    </div>
  );
}
