'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAdminLoggedIn } from '@/lib/storage';

export default function AdminHashHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        if (!isAdminLoggedIn()) {
          router.push('/login');
        } else {
          router.push('/admin-panel');
        }
      }
    };

    // Check on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [router]);

  return null;
}
