'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { ready, authenticated, login } = usePrivy();
  const router = useRouter();

  // If already logged in → go to dashboard
  useEffect(() => {
    if (ready && authenticated) {
      router.push('/dashboard');
    }
  }, [ready, authenticated, router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0F172A',
      padding: '20px',
    }}>

      {/* Logo */}
      <div style={{
        fontSize: '64px',
        marginBottom: '16px',
      }}>
        ⚡
      </div>

      {/* App Name */}
      <h1 style={{
        fontSize: '48px',
        fontWeight: 'bold',
        color: '#F8FAFC',
        margin: '0 0 8px 0',
        letterSpacing: '-1px',
      }}>
        ChadSwap
      </h1>

      {/* Tagline */}
      <p style={{
        fontSize: '18px',
        color: '#94A3B8',
        margin: '0 0 48px 0',
      }}>
        Trade Solana tokens fast and free
      </p>

      {/* Login Button - only show when ready and NOT logged in */}
      {ready && !authenticated && (
        <button
          onClick={login}
          style={{
            backgroundColor: '#2563EB',
            color: '#F8FAFC',
            border: 'none',
            borderRadius: '12px',
            padding: '16px 48px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
        >
          Get Started →
        </button>
      )}

      {/* Loading state */}
      {!ready && (
        <p style={{ color: '#94A3B8', fontSize: '16px' }}>
          Loading...
        </p>
      )}

    </div>
  );
}