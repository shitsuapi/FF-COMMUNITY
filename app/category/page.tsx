'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getCategories, getPosts, type Category, type Post } from '@/lib/storage';

export default function CategoryPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams ? parseInt(searchParams.get('id') || '0') : 0;

  const [category, setCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const cats = getCategories();
    setCategories(cats);

    if (categoryId > 0) {
      const cat = cats.find((c) => c.id === categoryId);
      setCategory(cat || null);
      const allPosts = getPosts().filter((p) => p.category_id === categoryId);
      setPosts(allPosts);
    } else {
      setPosts(getPosts());
    }
  }, [categoryId]);

  if (!mounted) return null;

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="title">Official FF Community</h1>
          <p className="subtitle">Browse {category ? category.name : 'All'} Posts</p>
        </div>
      </header>

      {/* Category Info */}
      {category && (
        <section className="section">
          <div className="category-detail-card">
            {category.image && (
              <img src={category.image} alt={category.name} className="category-detail-image" />
            )}
            <div className="category-detail-content">
              <h2>{category.name}</h2>
              <p>{category.description}</p>
              <span className="post-count">{posts.length} posts</span>
            </div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="section">
        <h2 className="section-title">Posts</h2>
        <div className="posts-grid">
          {posts.length === 0 ? (
            <p className="empty-message">No posts in this category</p>
          ) : (
            posts.map((post) => {
              const postCategory = categories.find((c) => c.id === post.category_id);
              return (
                <Link key={post.id} href={`/view/${post.id}`}>
                  <div className="post-card">
                    {post.image && <img src={post.image} alt={post.title} className="post-image" />}
                    <div className="post-content">
                      <h3 className="post-title">{post.title}</h3>
                      {postCategory && <span className="post-category">{postCategory.name}</span>}
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
        <Link href="/" className="nav-link">
          Home
        </Link>
        <Link href="/category" className="nav-link active">
          Categories
        </Link>
      </nav>
    </div>
  );
}
