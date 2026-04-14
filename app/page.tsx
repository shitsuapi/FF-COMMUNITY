'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories, getPosts, type Category, type Post } from '@/lib/storage';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const cats = getCategories();
    const allPosts = getPosts().sort((a, b) => b.created_at - a.created_at).slice(0, 6);
    setCategories(cats);
    setPosts(allPosts);
    setFilteredPosts(allPosts);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const filtered = posts.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredPosts(filtered);
  }, [searchQuery, posts, mounted]);

  if (!mounted) return null;

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="title">Official FF Community</h1>
          <p className="subtitle">Your Ultimate File-Sharing Platform</p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="search-section">
        <input
          type="text"
          className="search-bar"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Categories Section */}
      <section className="section">
        <h2 className="section-title">Categories</h2>
        <div className="categories-grid">
          {categories.length === 0 ? (
            <p className="empty-message">No categories yet</p>
          ) : (
            categories.map((category) => {
              const postCount = posts.filter((p) => p.category_id === category.id).length;
              return (
                <Link key={category.id} href={`/category?id=${category.id}`}>
                  <div className="category-card">
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="category-image" />
                    ) : (
                      <div className="category-icon">{category.name.charAt(0).toUpperCase()}</div>
                    )}
                    <h3>{category.name}</h3>
                    <p className="category-description">{category.description}</p>
                    <span className="post-count">{postCount} post{postCount !== 1 ? 's' : ''}</span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="section">
        <h2 className="section-title">Latest Posts</h2>
        <div className="posts-grid">
          {filteredPosts.length === 0 ? (
            <p className="empty-message">No posts found</p>
          ) : (
            filteredPosts.map((post) => {
              const category = categories.find((c) => c.id === post.category_id);
              return (
                <Link key={post.id} href={`/view/${post.id}`}>
                  <div className="post-card">
                    {post.image && <img src={post.image} alt={post.title} className="post-image" />}
                    <div className="post-content">
                      <h3 className="post-title">{post.title}</h3>
                      {category && <span className="post-category">{category.name}</span>}
                      <p className="post-description">{post.description.substring(0, 100)}...</p>
                      <div className="post-footer">
                        <span className="button-count">{post.buttons.length} button{post.buttons.length !== 1 ? 's' : ''}</span>
                        <button className="view-button">View Post</button>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>

      {/* Navigation Bar */}
      <nav className="navbar">
        <Link href="/" className="nav-link active">
          Home
        </Link>
        <Link href="/category" className="nav-link">
          Categories
        </Link>
      </nav>
    </div>
  );
}
