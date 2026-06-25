'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import TokenBanner from '../components/TokenBanner';

const trendingTokens = [
  { symbol: 'BONK', change: 24.5, price: '0.000024' },
  { symbol: 'WIF', change: 18.2, price: '2.84' },
  { symbol: 'POPCAT', change: 31.7, price: '0.87' },
  { symbol: 'MEW', change: 12.4, price: '0.0089' },
  { symbol: 'MYRO', change: -8.9, price: '0.12' },
  { symbol: 'BOME', change: -5.2, price: '0.0034' },
  { symbol: 'SLERF', change: 19.3, price: '0.45' },
];

export default function Dashboard() {
  const { ready, authenticated, logout } = usePrivy();
  const router = useRouter();

  // If NOT logged in → go to login page
  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  // Show loading while Privy initializes
  if (!ready) {
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
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0F172A',
      color: '#F8FAFC',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Top Banner */}
      <TokenBanner tokens={trendingTokens} direction="left" />

      {/* Navbar */}
      <div style={{
        backgroundColor: '#1E293B',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #334155',
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#F8FAFC',
          margin: 0,
        }}>
          ⚡ ChadSwap
        </h1>
        <button
          onClick={() => window.location.href = '/logout'}
          style={{
            backgroundColor: '#EF4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          Logout
        </button>
      </div>

      {/* Main 3 Panel Layout */}
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        height: 'calc(100vh - 120px)',
      }}>

        {/* Left Panel - Trending Tokens */}
        <div style={{
          width: '240px',
          backgroundColor: '#1E293B',
          borderRight: '1px solid #334155',
          padding: '16px',
          overflowY: 'auto',
          flexShrink: 0,
        }}>
          <h2 style={{
            fontSize: '14px',
            color: '#94A3B8',
            marginBottom: '16px',
            marginTop: 0,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            🔥 Trending
          </h2>
          {trendingTokens.map((token) => (
            <div
              key={token.symbol}
              style={{
                padding: '12px',
                marginBottom: '8px',
                backgroundColor: '#0F172A',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0F172A'}
            >
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  {token.symbol}
                </div>
                <div style={{ color: '#94A3B8', fontSize: '12px' }}>
                  ${token.price}
                </div>
              </div>
              <span style={{
                color: token.change >= 0 ? '#22C55E' : '#EF4444',
                fontSize: '12px',
                fontWeight: 'bold',
              }}>
                {token.change >= 0 ? '▲' : '▼'}
                {Math.abs(token.change).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>

        {/* Middle Panel - Chart */}
        <div style={{
          flex: 1,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <h2 style={{
            fontSize: '20px',
            marginBottom: '16px',
            marginTop: 0,
            color: '#F8FAFC',
          }}>
            Select a token to view chart
          </h2>
          <div style={{
            flex: 1,
            backgroundColor: '#1E293B',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94A3B8',
            fontSize: '18px',
          }}>
            📈 Chart will load here
          </div>
        </div>

        {/* Right Panel - Buy/Sell */}
        <div style={{
          width: '280px',
          backgroundColor: '#1E293B',
          borderLeft: '1px solid #334155',
          padding: '16px',
          flexShrink: 0,
          overflowY: 'auto',
        }}>
          <h2 style={{
            fontSize: '14px',
            color: '#94A3B8',
            marginBottom: '16px',
            marginTop: 0,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Trade
          </h2>

          {/* Buy/Sell Toggle */}
          <div style={{
            display: 'flex',
            marginBottom: '16px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #334155',
          }}>
            <button style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#22C55E',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
            }}>
              BUY
            </button>
            <button style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#0F172A',
              color: '#94A3B8',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
            }}>
              SELL
            </button>
          </div>

          {/* Amount Input */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{
              fontSize: '12px',
              color: '#94A3B8',
              display: 'block',
              marginBottom: '6px',
            }}>
              Amount (SOL)
            </label>
            <input
              type="number"
              placeholder="0.00"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#0F172A',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#F8FAFC',
                fontSize: '16px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Quick amounts */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '16px',
          }}>
            {['0.1', '0.5', '1', '5'].map(amt => (
              <button key={amt} style={{
                flex: 1,
                padding: '6px',
                backgroundColor: '#0F172A',
                color: '#94A3B8',
                border: '1px solid #334155',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
              }}>
                {amt}
              </button>
            ))}
          </div>

          {/* Buy Button */}
          <button style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#22C55E',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}>
            Buy Token
          </button>
        </div>

      </div>

      {/* Bottom Banner */}
      <TokenBanner tokens={trendingTokens} direction="right" />

    </div>
  );
}