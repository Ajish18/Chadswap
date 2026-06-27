'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  const { ready, authenticated, login } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.push('/dashboard');
    }
  }, [ready, authenticated, router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0F172A',
        padding: '20px',
      }}
    >
      {/* ChadSwap Logo */}
      <div style={{ marginBottom: '16px' }}>
        <Image
          src="/dark.png"
          alt="ChadSwap Logo"
          width={80}
          height={80}
          style={{ borderRadius: '16px' }}
        />
      </div>

      {/* App Name */}
      <h1
        style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#F8FAFC',
          margin: '0 0 8px 0',
          letterSpacing: '-1px',
        }}
      >
        ChadSwap
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontSize: '18px',
          color: '#94A3B8',
          margin: '0 0 48px 0',
        }}
      >
        Trade Solana tokens fast and free
      </p>

      {/* Login Button */}
      {ready && !authenticated && (
        <>
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
              marginBottom: '32px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#1D4ED8';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#2563EB';
            }}
          >
            Get Started →
          </button>

          {/* Mobile App Links */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <p
              style={{
                color: '#94A3B8',
                fontSize: '14px',
                margin: 0,
              }}
            >
              Also available on mobile
            </p>

            <div
              style={{
                display: 'flex',
                gap: '12px',
              }}
            >
              <a
                href="https://play.google.com/store/apps/details?id=xyz.chadwallet.www"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#1E293B',
                  color: '#F8FAFC',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  border: '1px solid #334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                🤖 Android
              </a>

              <a
                href="https://apps.apple.com/us/app/chadwallet/id6757367474"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#1E293B',
                  color: '#F8FAFC',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  border: '1px solid #334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                🍎 iOS
              </a>
            </div>
          </div>
        </>
      )}

      {/* Loading State */}
      {!ready && (
        <p
          style={{
            color: '#94A3B8',
            fontSize: '16px',
          }}
        >
          Loading...
        </p>
      )}
    </div>
  );
}