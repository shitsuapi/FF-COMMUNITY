// Storage utilities for localStorage management

export interface Button {
  id: string;
  name: string;
  link: string;
}

export interface Post {
  id: number;
  title: string;
  description: string;
  image: string | null;
  category_id: number;
  buttons: Button[];
  created_at: number;
}

export interface Category {
  id: number;
  name: string;
  image: string | null;
  description: string;
  color?: string;
}

export interface WebsiteSettings {
  siteName: string;
  siteDescription: string;
  siteLogo: string | null;
  siteLogoUrl?: string;
}

const CATEGORIES_KEY = 'ff_community_categories';
const POSTS_KEY = 'ff_community_posts';
const ADMIN_SESSION_KEY = 'ff_community_admin_session';
const SETTINGS_KEY = 'ff_community_settings';

// Initialize with demo data if empty
function initializeDemoData() {
  if (typeof window === 'undefined') return;

  const existingCategories = localStorage.getItem(CATEGORIES_KEY);
  if (!existingCategories) {
    const demoCategories: Category[] = [
      {
        id: 1,
        name: 'Mod Menus',
        image: 'https://images.unsplash.com/photo-1538481143235-b716cc223e67?w=400&h=300&fit=crop',
        description: 'Latest mod menus and hacks for popular games',
      },
      {
        id: 2,
        name: 'Tools',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
        description: 'Useful tools and utilities for developers',
      },
    ];
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(demoCategories));
  }

  const existingPosts = localStorage.getItem(POSTS_KEY);
  if (!existingPosts) {
    const demoPosts: Post[] = [
      {
        id: 1,
        title: 'Advanced Game Mod Menu v2.5',
        description: 'Premium mod menu with unlimited features, aimbot, ESP, and more. Compatible with latest game version.',
        image: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=300&fit=crop',
        category_id: 1,
        buttons: [
          { id: '1', name: 'Download', link: 'https://example.com/download1' },
          { id: '2', name: 'Mirror', link: 'https://example.com/mirror1' },
        ],
        created_at: Date.now() - 86400000,
      },
      {
        id: 2,
        title: 'Development Tools Suite',
        description: 'Complete toolkit for web and mobile development. Includes debuggers, profilers, and code generators.',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
        category_id: 2,
        buttons: [
          { id: '1', name: 'Download', link: 'https://example.com/download2' },
          { id: '2', name: 'Documentation', link: 'https://example.com/docs' },
        ],
        created_at: Date.now() - 172800000,
      },
    ];
    localStorage.setItem(POSTS_KEY, JSON.stringify(demoPosts));
  }
}

export function getCategories(): Category[] {
  if (typeof window === 'undefined') return [];
  initializeDemoData();
  try {
    const data = localStorage.getItem(CATEGORIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getPosts(): Post[] {
  if (typeof window === 'undefined') return [];
  initializeDemoData();
  try {
    const data = localStorage.getItem(POSTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCategories(categories: Category[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

export function savePosts(posts: Post[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export function getCategory(id: number): Category | undefined {
  return getCategories().find((c) => c.id === id);
}

export function getPost(id: number): Post | undefined {
  return getPosts().find((p) => p.id === id);
}

export function deleteCategory(id: number): boolean {
  const categories = getCategories();
  const posts = getPosts();
  
  // Check if category has posts
  if (posts.some((p) => p.category_id === id)) {
    return false;
  }
  
  saveCategories(categories.filter((c) => c.id !== id));
  return true;
}

export function deletePost(id: number): void {
  const posts = getPosts();
  savePosts(posts.filter((p) => p.id !== id));
}

export function addCategory(category: Omit<Category, 'id'>): Category {
  const categories = getCategories();
  const newCategory: Category = {
    ...category,
    id: Math.max(...categories.map((c) => c.id), 0) + 1,
  };
  saveCategories([...categories, newCategory]);
  return newCategory;
}

export function updateCategory(id: number, updates: Partial<Omit<Category, 'id'>>): void {
  const categories = getCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index !== -1) {
    categories[index] = { ...categories[index], ...updates };
    saveCategories(categories);
  }
}

export function addPost(post: Omit<Post, 'id' | 'created_at'>): Post {
  const posts = getPosts();
  const newPost: Post = {
    ...post,
    id: Math.max(...posts.map((p) => p.id), 0) + 1,
    created_at: Date.now(),
  };
  savePosts([...posts, newPost]);
  return newPost;
}

export function updatePost(id: number, updates: Partial<Omit<Post, 'id' | 'created_at'>>): void {
  const posts = getPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...updates };
    savePosts(posts);
  }
}

export function setAdminSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ loggedIn: true, timestamp: Date.now() }));
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!session) return false;
    const data = JSON.parse(session);
    return data.loggedIn === true;
  } catch {
    return false;
  }
}

// Settings management
export function getSettings(): WebsiteSettings {
  if (typeof window === 'undefined') return {
    siteName: 'Official FF Community',
    siteDescription: 'Your one-stop destination for mod menus, glitches, and the latest game updates.',
    siteLogo: null,
    siteLogoUrl: '/ff-logo.jpg',
  };
  
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // Fall through to default
  }
  
  return {
    siteName: 'Official FF Community',
    siteDescription: 'Your one-stop destination for mod menus, glitches, and the latest game updates.',
    siteLogo: null,
    siteLogoUrl: '/ff-logo.jpg',
  };
}

export function updateSettings(settings: WebsiteSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
