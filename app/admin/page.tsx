'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCategories, getPosts, getSettings, isAdminLoggedIn, clearAdminSession } from '@/lib/storage';

export default function AdminDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalCategories: 0,
    siteName: '',
  });

  useEffect(() => {
    setMounted(true);
    if (!isAdminLoggedIn()) {
      router.push('/login');
      return;
    }

    const categories = getCategories();
    const posts = getPosts();
    const settings = getSettings();

    setStats({
      totalPosts: posts.length,
      totalCategories: categories.length,
      siteName: settings.siteName,
    });
  }, [router]);

  const handleLogout = () => {
    clearAdminSession();
    router.push('/');
  };

  if (!mounted) return null;

  return (
    <div className="admin-container">
      {/* Admin Header */}
      <div className="admin-top-header">
        <div className="admin-header-content">
          <div className="admin-branding">
            <div className="admin-logo-icon">🎮</div>
            <div>
              <h1>Admin Dashboard</h1>
              <p>{stats.siteName}</p>
            </div>
          </div>
          <div className="admin-header-buttons">
            <Link href="/" className="btn-back-site">
              ← Back to Site
            </Link>
            <button onClick={handleLogout} className="btn-logout">
              ← Logout
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="admin-content">
        <div className="dashboard-grid">
          {/* Stats Cards */}
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>{stats.totalPosts}</h3>
              <p>Total Posts</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📁</div>
            <div className="stat-content">
              <h3>{stats.totalCategories}</h3>
              <p>Categories</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚙️</div>
            <div className="stat-content">
              <h3>Settings</h3>
              <p>Manage Site</p>
            </div>
          </div>
        </div>

        <div className="dashboard-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link href="/admin-panel#posts" className="action-card">
              <span className="action-icon">📤</span>
              <span className="action-text">Upload New Post</span>
            </Link>
            <Link href="/admin-panel#posts-list" className="action-card">
              <span className="action-icon">📋</span>
              <span className="action-text">Manage Posts</span>
            </Link>
            <Link href="/admin-panel#categories" className="action-card">
              <span className="action-icon">📁</span>
              <span className="action-text">Manage Categories</span>
            </Link>
            <Link href="/admin-panel#settings" className="action-card">
              <span className="action-icon">⚙️</span>
              <span className="action-text">Website Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
