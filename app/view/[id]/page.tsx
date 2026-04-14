'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories, getPosts, getPost, type Category, type Post } from '@/lib/storage';
import { useParams } from 'next/navigation';

export default function ViewPage() {
  const params = useParams();
  const postId = parseInt(params?.id as string);

  const [post, setPost] = useState<Post | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const foundPost = getPost(postId);
    setPost(foundPost || null);

    if (foundPost) {
      const categories = getCategories();
      const cat = categories.find((c) => c.id === foundPost.category_id);
      setCategory(cat || null);
    }
  }, [postId]);

  if (!mounted) return null;

  if (!post) {
    return (
      <div className="container">
        <header className="header">
          <div className="header-content">
            <h1 className="title">Post Not Found</h1>
            <p className="subtitle">The post you're looking for doesn't exist</p>
          </div>
        </header>
        <div style={{ textAlign: 'center', padding: '50px 20px' }}>
          <Link href="/">
            <button className="cta-button">Back to Home</button>
          </Link>
        </div>
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

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="title">Official FF Community</h1>
          <p className="subtitle">Post Details</p>
        </div>
      </header>

      {/* Post Details */}
      <div className="post-details">
        <div className="details-card">
          {post.image && (
            <img src={post.image} alt={post.title} className="details-image" />
          )}
          <h1 className="details-title">{post.title}</h1>

          <div className="details-meta">
            {category && (
              <div className="meta-item">
                <strong>Category:</strong> {category.name}
              </div>
            )}
            <div className="meta-item">
              <strong>Posted:</strong> {new Date(post.created_at).toLocaleDateString()}
            </div>
          </div>

          <p className="details-description">{post.description}</p>

          {/* Download Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
            {post.buttons.map((button) => (
              <a
                key={button.id}
                href={button.link}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button"
                style={{ textAlign: 'center' }}
              >
                {button.name}
              </a>
            ))}
          </div>

          {/* Back Button */}
          <Link href="/">
            <button className="view-button" style={{ marginTop: '20px' }}>
              ← Back to Home
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
