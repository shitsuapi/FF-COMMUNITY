'use client';

import { Suspense } from 'react';

function ViewContent() {
  return (
    <>
      <div className="container">
        {/* Back Link */}
        <a href="javascript:history.back()" className="back-link">
          ← Back
        </a>

        {/* Post Details */}
        <div id="postDetails" className="post-details"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="navbar">
        <a href="/" className="nav-link">
          Home
        </a>
        <a href="/category" className="nav-link">
          Categories
        </a>
      </nav>

      <script src="/assets/js/script.js"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
        function initViewPage() {
            const urlParams = new URLSearchParams(window.location.search);
            const postId = parseInt(urlParams.get('id'));

            if (!postId) {
                document.getElementById('postDetails').innerHTML = '<p class="empty-message">Invalid post ID</p>';
                return;
            }

            const posts = getPosts();
            const post = posts.find(p => p.id === postId);

            if (!post) {
                document.getElementById('postDetails').innerHTML = '<p class="empty-message">Post not found</p>';
                return;
            }

            const categories = getCategories();
            const category = categories.find(c => c.id === post.category_id);
            const categoryName = category ? category.name : 'Unknown';
            const createdDate = new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const detailsHTML = \`
                <div class="details-card">
                    \${post.image ? \`<img src="\${post.image}" alt="\${post.title}" class="details-image">\` : ''}
                    <h1 class="details-title">\${post.title}</h1>
                    <div class="details-meta">
                        <span class="meta-item"><strong>Category:</strong> \${categoryName}</span>
                        <span class="meta-item"><strong>Created:</strong> \${createdDate}</span>
                    </div>
                    <p class="details-description">\${post.description}</p>
                    <a href="/go?id=\${post.id}" class="cta-button">\${post.button_name || 'Download'}</a>
                </div>
            \`;

            document.getElementById('postDetails').innerHTML = detailsHTML;
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initViewPage);
        } else {
          initViewPage();
        }
          `,
        }}
      />
    </>
  );
}

export default function ViewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewContent />
    </Suspense>
  );
}
