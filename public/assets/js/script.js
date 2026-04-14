/* ========================================
   LOCALSTORAGE UTILITIES
   ======================================== */

// Get all categories
function getCategories() {
    const stored = localStorage.getItem('ff_categories');
    return stored ? JSON.parse(stored) : [];
}

// Save categories
function saveCategories(categories) {
    localStorage.setItem('ff_categories', JSON.stringify(categories));
}

// Get all posts
function getPosts() {
    const stored = localStorage.getItem('ff_posts');
    return stored ? JSON.parse(stored) : [];
}

// Save posts
function savePosts(posts) {
    localStorage.setItem('ff_posts', JSON.stringify(posts));
}

/* ========================================
   AUTH UTILITIES
   ======================================== */

// Set admin session
function setAdminSession() {
    localStorage.setItem('ff_admin_logged_in', 'true');
}

// Check if admin is logged in
function isAdminLoggedIn() {
    return localStorage.getItem('ff_admin_logged_in') === 'true';
}

// Clear admin session
function clearAdminSession() {
    localStorage.removeItem('ff_admin_logged_in');
}

/* ========================================
   UI UTILITIES
   ======================================== */

// Create a post card element
function createPostCard(post) {
    const categories = getCategories();
    const category = categories.find(c => c.id === post.category_id);
    const categoryName = category ? category.name : 'Unknown';
    
    const card = document.createElement('div');
    card.className = 'post-card';
    
    const shortDescription = post.description.length > 100 
        ? post.description.substring(0, 100) + '...' 
        : post.description;
    
    card.innerHTML = `
        ${post.image ? `<img src="${post.image}" alt="${post.title}" class="post-image" onerror="this.style.display='none'">` : ''}
        <div class="post-content">
            <h3 class="post-title">${post.title}</h3>
            <p class="post-description">${shortDescription}</p>
            <div class="post-meta">Category: ${categoryName}</div>
            <button class="post-button">${post.button_name || 'Download'}</button>
        </div>
    `;
    
    card.addEventListener('click', () => {
        window.location.href = `view.html?id=${post.id}`;
    });
    
    return card;
}

/* ========================================
   INITIALIZATION
   ======================================== */

// Initialize localStorage with demo data (only once)
function initializeDemo() {
    // Only initialize if empty
    if (getCategories().length === 0 && getPosts().length === 0) {
        const demoCategories = [
            { id: 1, name: 'Games' },
            { id: 2, name: 'Software' },
            { id: 3, name: 'Utilities' },
            { id: 4, name: 'Media' }
        ];

        const demoPosts = [
            {
                id: 1,
                title: 'Example Game #1',
                description: 'This is a demo post showcasing the file-sharing platform. Click to view full details and download.',
                image: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=300&fit=crop',
                file_link: 'https://example.com/download1',
                button_name: 'Download',
                category_id: 1,
                created_at: Date.now() - 86400000
            },
            {
                id: 2,
                title: 'Example Software #1',
                description: 'Professional software for productivity and efficiency. Demo content showing how posts work on this platform.',
                image: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=300&fit=crop',
                file_link: 'https://example.com/download2',
                button_name: 'Download',
                category_id: 2,
                created_at: Date.now() - 172800000
            },
            {
                id: 3,
                title: 'Example Utility Tool',
                description: 'A useful utility tool for daily tasks. This demonstrates the platform\'s capabilities for sharing resources.',
                image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
                file_link: 'https://example.com/download3',
                button_name: 'Download',
                category_id: 3,
                created_at: Date.now() - 259200000
            }
        ];

        saveCategories(demoCategories);
        savePosts(demoPosts);
    }
}

// Initialize demo data when script loads
initializeDemo();

/* ========================================
   HASH ROUTING FOR ADMIN
   ======================================== */

// Handle hash-based admin access
function handleAdminHash() {
    const currentPage = window.location.pathname;
    
    // If user tries to access /admin.html or /admin directly, redirect to home
    if (currentPage.includes('admin.html') || currentPage.endsWith('/admin')) {
        window.location.href = 'index.html';
        return;
    }

    // If hash is #admin and user is on home page, load admin panel
    if (window.location.hash === '#admin' && currentPage.includes('index.html')) {
        if (isAdminLoggedIn()) {
            // Load admin panel dynamically
            loadAdminPanel();
        } else {
            // Redirect to login
            window.location.href = 'login.html';
        }
    }
}

// Load admin panel content dynamically
function loadAdminPanel() {
    // This will be called when hash #admin is detected on home page
    fetch('admin.html')
        .then(response => response.text())
        .then(html => {
            // Parse HTML
            const parser = new DOMParser();
            const adminDoc = parser.parseFromString(html, 'text/html');
            
            // Extract admin panel content
            const adminContent = adminDoc.getElementById('adminPanel');
            if (adminContent) {
                // Replace current page with admin panel
                document.body.innerHTML = adminContent.innerHTML + '<nav class="navbar"><a href="index.html" class="nav-link">Home</a><a href="category.html" class="nav-link">Categories</a></nav>';
                
                // Re-initialize admin functionality
                initAdminPageDynamic();
            }
        });
}

// Admin page initialization (can be called dynamically)
function initAdminPageDynamic() {
    // Setup tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Category management
    document.getElementById('createCategoryBtn').addEventListener('click', () => {
        const name = document.getElementById('categoryName').value.trim();
        if (!name) {
            alert('Please enter a category name');
            return;
        }
        const categories = getCategories();
        const newCategory = { id: Date.now(), name: name };
        categories.push(newCategory);
        saveCategories(categories);
        document.getElementById('categoryName').value = '';
        displayCategoriesList();
        updateCategoryDropdown();
    });

    // Post management
    document.getElementById('createPostBtn').addEventListener('click', () => {
        const title = document.getElementById('postTitle').value.trim();
        const categoryId = parseInt(document.getElementById('postCategory').value);
        const description = document.getElementById('postDescription').value.trim();
        const imageUrl = document.getElementById('postImageUrl').value.trim();
        const fileLink = document.getElementById('postFileLink').value.trim();
        const buttonName = document.getElementById('postButtonName').value.trim();

        if (!title || !categoryId || !description || !fileLink) {
            alert('Please fill in all required fields');
            return;
        }
        const posts = getPosts();
        const newPost = {
            id: Date.now(),
            title: title,
            description: description,
            image: imageUrl || null,
            file_link: fileLink,
            button_name: buttonName || 'Download',
            category_id: categoryId,
            created_at: Date.now()
        };
        posts.push(newPost);
        savePosts(posts);
        document.getElementById('postTitle').value = '';
        document.getElementById('postCategory').value = '';
        document.getElementById('postDescription').value = '';
        document.getElementById('postImageUrl').value = '';
        document.getElementById('postFileLink').value = '';
        document.getElementById('postButtonName').value = 'Download';
        displayPostsList();
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', () => {
        clearAdminSession();
        window.location.href = 'index.html';
    });

    displayCategoriesList();
    updateCategoryDropdown();
    displayPostsList();
}

function displayCategoriesList() {
    const categories = getCategories();
    const container = document.getElementById('categoriesList');
    container.innerHTML = '';
    if (categories.length === 0) {
        container.innerHTML = '<p class="empty-message">No categories yet</p>';
        return;
    }
    categories.forEach(category => {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'list-item';
        const postCount = getPosts().filter(p => p.category_id === category.id).length;
        categoryItem.innerHTML = `
            <div class="list-item-content">
                <strong>${category.name}</strong>
                <span class="item-meta">${postCount} post${postCount !== 1 ? 's' : ''}</span>
            </div>
            <button class="delete-button" onclick="deleteCategory(${category.id})">Delete</button>
        `;
        container.appendChild(categoryItem);
    });
}

function displayPostsList() {
    const posts = getPosts();
    const categories = getCategories();
    const container = document.getElementById('postsList');
    container.innerHTML = '';
    if (posts.length === 0) {
        container.innerHTML = '<p class="empty-message">No posts yet</p>';
        return;
    }
    posts.forEach(post => {
        const category = categories.find(c => c.id === post.category_id);
        const categoryName = category ? category.name : 'Unknown';
        const postItem = document.createElement('div');
        postItem.className = 'list-item';
        postItem.innerHTML = `
            <div class="list-item-content">
                <strong>${post.title}</strong>
                <span class="item-meta">Category: ${categoryName}</span>
            </div>
            <button class="delete-button" onclick="deletePost(${post.id})">Delete</button>
        `;
        container.appendChild(postItem);
    });
}

function updateCategoryDropdown() {
    const categories = getCategories();
    const select = document.getElementById('postCategory');
    if (!select) return;
    const currentValue = select.value;
    select.innerHTML = '<option value="">Select a category</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
    select.value = currentValue;
}

/* ========================================
   PAGE NAVIGATION HELPERS
   ======================================== */

// Highlight active navigation link
function updateActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Update active nav on page load
document.addEventListener('DOMContentLoaded', () => {
    updateActiveNav();
});

/* ========================================
   HANDLE BACK BUTTON
   ======================================== */

window.onpopstate = function() {
    history.back();
};
