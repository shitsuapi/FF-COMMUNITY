'use client';

export default function GoPage() {
  return (
    <>
      <div className="container">
        <div className="redirect-message">
          <h1>Redirecting...</h1>
          <p id="redirectText">Please wait while we redirect you to the download link.</p>
          <p
            id="fallbackText"
            style={{ display: 'none', marginTop: '20px' }}
          >
            <a href="javascript:history.back()" className="back-link">
              If the redirect doesn&apos;t work, click here to go back
            </a>
          </p>
        </div>
      </div>

      <script src="/assets/js/script.js"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
        function initRedirectPage() {
            const urlParams = new URLSearchParams(window.location.search);
            const postId = parseInt(urlParams.get('id'));

            if (!postId) {
                document.getElementById('redirectText').textContent = 'Invalid post ID';
                return;
            }

            const posts = getPosts();
            const post = posts.find(p => p.id === postId);

            if (!post || !post.file_link) {
                document.getElementById('redirectText').textContent = 'Post or download link not found';
                return;
            }

            // Validate URL
            if (!isValidUrl(post.file_link)) {
                document.getElementById('redirectText').textContent = 'Invalid download link';
                return;
            }

            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = post.file_link;
                document.getElementById('fallbackText').style.display = 'block';
            }, 500);
        }

        function isValidUrl(string) {
            try {
                new URL(string);
                return true;
            } catch (_) {
                return false;
            }
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initRedirectPage);
        } else {
          initRedirectPage();
        }
          `,
        }}
      />
    </>
  );
}
