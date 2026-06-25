'use client';

import { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';

export default function LogoutPage() {
  const { logout } = usePrivy();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await logout();
      } catch (e) {
        // ignore
      }
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    };
    doLogout();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0F172A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#F8FAFC',
      fontSize: '18px',
    }}>
      Logging out...
    </div>
  );
}