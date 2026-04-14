'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getCategories,
  getPosts,
  addCategory,
  updateCategory,
  deleteCategory,
  addPost,
  updatePost,
  deletePost,
  clearAdminSession,
  isAdminLoggedIn,
  getSettings,
  updateSettings,
  type Category,
  type Post,
  type Button,
  type WebsiteSettings,
} from '@/lib/storage';

export default function AdminPanel() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [settings, setSettingsState] = useState<WebsiteSettings | null>(null);

  // Post form
  const [postTitle, setPostTitle] = useState('');
  const [postDesc, setPostDesc] = useState('');
  const [postCategoryId, setPostCategoryId] = useState('');
  const [postImage, setPostImage] = useState('');
  const [postButtons, setPostButtons] = useState<Button[]>([]);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [buttonName, setButtonName] = useState('');
  const [buttonLink, setButtonLink] = useState('');

  // Category form
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [categoryColor, setCategoryColor] = useState('#00ffff');
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  // Settings form
  const [settingsSiteName, setSettingsSiteName] = useState('');
  const [settingsSiteDesc, setSettingsSiteDesc] = useState('');
  const [settingsLogoUrl, setSettingsLogoUrl] = useState('');
  const [settingsLogoInput, setSettingsLogoInput] = useState('');

  useEffect(() => {
    setMounted(true);
    if (!isAdminLoggedIn()) {
      router.push('/login');
      return;
    }
    loadAllData();
  }, [router]);

  const loadAllData = () => {
    setCategories(getCategories());
    setPosts(getPosts());
    const sett = getSettings();
    setSettingsState(sett);
    setSettingsSiteName(sett.siteName);
    setSettingsSiteDesc(sett.siteDescription);
    setSettingsLogoUrl(sett.siteLogoUrl || '');
  };

  // POST MANAGEMENT
  const handleAddPost = () => {
    if (!postTitle.trim() || !postDesc.trim() || !postCategoryId) {
      alert('Please fill all required fields');
      return;
    }
    if (postButtons.length === 0) {
      alert('Please add at least one download button');
      return;
    }

    if (editingPostId) {
      updatePost(editingPostId, {
        title: postTitle,
        description: postDesc,
        category_id: parseInt(postCategoryId),
        image: postImage || null,
        buttons: postButtons,
      });
      setEditingPostId(null);
    } else {
      addPost({
        title: postTitle,
        description: postDesc,
        category_id: parseInt(postCategoryId),
        image: postImage || null,
        buttons: postButtons,
      });
    }
    resetPostForm();
    loadAllData();
  };

  const handleEditPost = (p: Post) => {
    setPostTitle(p.title);
    setPostDesc(p.description);
    setPostCategoryId(p.category_id.toString());
    setPostImage(p.image || '');
    setPostButtons([...p.buttons]);
    setEditingPostId(p.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePost = (id: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePost(id);
      loadAllData();
    }
  };

  const resetPostForm = () => {
    setPostTitle('');
    setPostDesc('');
    setPostCategoryId('');
    setPostImage('');
    setPostButtons([]);
    setButtonName('');
    setButtonLink('');
  };

  const handleAddButton = () => {
    if (!buttonName.trim() || !buttonLink.trim()) {
      alert('Please enter button name and link');
      return;
    }
    setPostButtons([...postButtons, { id: Date.now().toString(), name: buttonName, link: buttonLink }]);
    setButtonName('');
    setButtonLink('');
  };

  const handleRemoveButton = (id: string) => {
    setPostButtons(postButtons.filter((b) => b.id !== id));
  };

  // CATEGORY MANAGEMENT
  const handleAddCategory = () => {
    if (!categoryName.trim()) {
      alert('Please enter category name');
      return;
    }

    if (editingCategoryId) {
      updateCategory(editingCategoryId, {
        name: categoryName,
        image: categoryImage || null,
        description: categoryDesc,
        color: categoryColor,
      });
      setEditingCategoryId(null);
    } else {
      addCategory({
        name: categoryName,
        image: categoryImage || null,
        description: categoryDesc,
        color: categoryColor,
      });
    }

    setCategoryName('');
    setCategoryImage('');
    setCategoryDesc('');
    setCategoryColor('#00ffff');
    loadAllData();
  };

  const handleEditCategory = (cat: Category) => {
    setCategoryName(cat.name);
    setCategoryImage(cat.image || '');
    setCategoryDesc(cat.description);
    setCategoryColor(cat.color || '#00ffff');
    setEditingCategoryId(cat.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCategory = (id: number) => {
    if (confirm('Are you sure? This category must have no posts.')) {
      const success = deleteCategory(id);
      if (!success) {
        alert('Cannot delete category with existing posts');
      } else {
        loadAllData();
      }
    }
  };

  // SETTINGS MANAGEMENT
  const handleSaveSettings = () => {
    if (!settingsSiteName.trim()) {
      alert('Please enter website name');
      return;
    }

    const updatedSettings: WebsiteSettings = {
      siteName: settingsSiteName,
      siteDescription: settingsSiteDesc,
      siteLogo: null,
      siteLogoUrl: settingsLogoUrl || '/ff-logo.jpg',
    };

    updateSettings(updatedSettings);
    loadAllData();
    alert('Settings saved successfully!');
  };

  const handleLogout = () => {
    clearAdminSession();
    router.push('/');
  };

  if (!mounted || !settings) return null;

  return (
    <div className="admin-container">
      {/* Admin Header */}
      <div className="admin-top-header">
        <div className="admin-header-content">
          <div className="admin-branding">
            <div className="admin-logo-icon">🎮</div>
            <div>
              <h1>Admin Panel</h1>
              <p>Official FF Community</p>
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

      {/* Tabs Navigation */}
      <div className="admin-tabs-nav">
        <button
          className={`admin-tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          📤 UPLOAD POST
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'posts-list' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts-list')}
        >
          📋 POSTS ({posts.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          📁 CATEGORIES
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ SETTINGS
        </button>
      </div>

      <div className="admin-content">
        {/* UPLOAD POST TAB */}
        {activeTab === 'posts' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>📤 Upload New Post</h2>
            </div>

            <div className="form-card">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Post title..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={postDesc}
                  onChange={(e) => setPostDesc(e.target.value)}
                  placeholder="Describe the content..."
                  className="form-input"
                  rows={4}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={postCategoryId}
                    onChange={(e) => setPostCategoryId(e.target.value)}
                    className="form-input"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>🖼️ Image</label>
                <div className="upload-area">
                  <div className="upload-placeholder">
                    <span>📸</span>
                    <p>Click or drag image here</p>
                  </div>
                  <p className="upload-separator">OR</p>
                  <input
                    type="url"
                    value={postImage}
                    onChange={(e) => setPostImage(e.target.value)}
                    placeholder="Paste image URL..."
                    className="form-input"
                  />
                </div>
              </div>

              <div className="section-divider">
                <h3>🔗 Download Link</h3>
              </div>

              <div className="form-group">
                <label>Button Name</label>
                <input
                  type="text"
                  value={buttonName}
                  onChange={(e) => setButtonName(e.target.value)}
                  placeholder="e.g., Download"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Button Link</label>
                <input
                  type="url"
                  value={buttonLink}
                  onChange={(e) => setButtonLink(e.target.value)}
                  placeholder="https://example.com/download..."
                  className="form-input"
                />
              </div>

              <button onClick={handleAddButton} className="btn-secondary">
                + Add Button
              </button>

              {postButtons.length > 0 && (
                <div className="buttons-list">
                  {postButtons.map((btn) => (
                    <div key={btn.id} className="button-item">
                      <div>
                        <strong>{btn.name}</strong>
                        <p>{btn.link}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveButton(btn.id)}
                        className="btn-delete-small"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="form-actions">
                <button onClick={handleAddPost} className="btn-primary">
                  📤 {editingPostId ? 'UPDATE POST' : 'UPLOAD POST'}
                </button>
                {editingPostId && (
                  <button onClick={resetPostForm} className="btn-secondary">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* POSTS LIST TAB */}
        {activeTab === 'posts-list' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>📋 All Posts</h2>
              <span className="badge">{posts.length}</span>
            </div>

            <div className="posts-list">
              {posts.length === 0 ? (
                <div className="empty-state">
                  <p>No posts yet. Create one to get started!</p>
                </div>
              ) : (
                posts.map((post) => {
                  const postCat = categories.find((c) => c.id === post.category_id);
                  return (
                    <div key={post.id} className="post-item">
                      <div className="post-item-image">
                        {post.image ? (
                          <img src={post.image} alt={post.title} />
                        ) : (
                          <div className="no-image">📷</div>
                        )}
                      </div>
                      <div className="post-item-content">
                        <h4>{post.title}</h4>
                        <p className="post-category-tag">{postCat?.name}</p>
                        <p className="post-desc">{post.description.substring(0, 100)}...</p>
                        <span className="post-buttons-count">🔗 {post.buttons.length} button{post.buttons.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="post-item-actions">
                        <button
                          onClick={() => handleEditPost(post)}
                          className="btn-edit"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="btn-delete"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>📁 Create New Category</h2>
            </div>

            <div className="form-card">
              <div className="form-row">
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="e.g. Mod Menu"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Color 🎨</label>
                  <div className="color-picker-group">
                    <input
                      type="color"
                      value={categoryColor}
                      onChange={(e) => setCategoryColor(e.target.value)}
                      className="color-picker"
                    />
                    <input
                      type="text"
                      value={categoryColor}
                      onChange={(e) => setCategoryColor(e.target.value)}
                      className="form-input"
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={categoryDesc}
                  onChange={(e) => setCategoryDesc(e.target.value)}
                  placeholder="Short description..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>🖼️ Category Image</label>
                <div className="upload-area">
                  <div className="upload-placeholder">
                    <span>📸</span>
                    <p>Click or drag image here</p>
                  </div>
                  <p className="upload-separator">OR</p>
                  <input
                    type="url"
                    value={categoryImage}
                    onChange={(e) => setCategoryImage(e.target.value)}
                    placeholder="Paste image URL..."
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button onClick={handleAddCategory} className="btn-primary">
                  📁 {editingCategoryId ? 'UPDATE CATEGORY' : 'CREATE CATEGORY'}
                </button>
                {editingCategoryId && (
                  <button
                    onClick={() => {
                      setEditingCategoryId(null);
                      setCategoryName('');
                      setCategoryImage('');
                      setCategoryDesc('');
                      setCategoryColor('#00ffff');
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="section-header" style={{ marginTop: '40px' }}>
              <h2>All Categories</h2>
              <span className="badge">{categories.length}</span>
            </div>

            <div className="categories-list">
              {categories.length === 0 ? (
                <div className="empty-state">
                  <p>No categories yet. Create one above!</p>
                </div>
              ) : (
                categories.map((cat) => {
                  const postCount = posts.filter((p) => p.category_id === cat.id).length;
                  return (
                    <div key={cat.id} className="category-item">
                      <div className="category-item-image">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} />
                        ) : (
                          <div className="no-image" style={{ background: cat.color || '#00ffff' }}>
                            📁
                          </div>
                        )}
                      </div>
                      <div className="category-item-content">
                        <h4 style={{ color: cat.color || '#00ffff' }}>{cat.name}</h4>
                        <p className="category-badge">
                          <span style={{
                            display: 'inline-block',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: cat.color || '#00ffff',
                            marginRight: '8px',
                          }}></span>
                          {postCount} POSTS
                        </p>
                        <p className="post-desc">{cat.description}</p>
                      </div>
                      <div className="category-item-actions">
                        <button
                          onClick={() => handleEditCategory(cat)}
                          className="btn-edit"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="btn-delete"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>⚙️ Website Settings</h2>
            </div>

            <div className="form-card">
              <div className="form-group">
                <label>Website Name</label>
                <input
                  type="text"
                  value={settingsSiteName}
                  onChange={(e) => setSettingsSiteName(e.target.value)}
                  placeholder="Official FF Community"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Website Description</label>
                <textarea
                  value={settingsSiteDesc}
                  onChange={(e) => setSettingsSiteDesc(e.target.value)}
                  placeholder="Your website description..."
                  className="form-input"
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>🖼️ Website Logo</label>
                <div className="logo-preview">
                  {settingsLogoUrl && (
                    <div className="logo-image">
                      <img src={settingsLogoUrl} alt="Logo" />
                      <p>Current Logo</p>
                    </div>
                  )}
                </div>

                <div className="upload-area">
                  <div className="upload-placeholder">
                    <span>📸</span>
                    <p>Click or drag logo here</p>
                  </div>
                  <p className="upload-separator">OR</p>
                  <input
                    type="url"
                    value={settingsLogoInput}
                    onChange={(e) => setSettingsLogoInput(e.target.value)}
                    placeholder="/logo-ff.png"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button onClick={handleSaveSettings} className="btn-primary">
                  💾 SAVE SETTINGS
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
