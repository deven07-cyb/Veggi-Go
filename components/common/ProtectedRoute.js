// components/ProtectedRoute.jsx or .tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { navigateTo, getUserRoleName, getUserRolePermission } from '@/components/common/functions';
export default function ProtectedRoute({ allowedRoles = [], children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      router.push('/'); // Not logged in
      return;
    }

    if (!getUserRolePermission('write')) {
      router.push('/dashboard'); // Unauthorized
      return;
    }

    setAuthorized(true); // Authorized
  }, [router, allowedRoles]);

  if (!authorized) return null; // or a loading spinner

  return children;
}
