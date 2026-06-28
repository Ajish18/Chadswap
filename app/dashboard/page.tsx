'use client';

import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import TokenBanner from '../components/TokenBanner';
import PriceChart from '../components/PriceChart';

// Token type definition
interface Token {
  address: string;
  symbol: string;
  name: string;
  price: number;
  price24hChangePercent: number;
  logoURI: string;
  volume24hUSD: number;
}

export default function Dashboard() {
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const router = useRouter();

  // useState — stores our token list
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  // Wallet address
  const solanaWallet = wallets.find(w => w.walletClientType === 'privy');
  const address = solanaWallet?.address || '';
  const truncateAddress = (addr: string) => {
    if (!addr) return 'Connecting...';
    return addr.slice(0, 4) + '...' + addr.slice(-4);
  };

  // Redirect if not logged in
  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  // Fetch real tokens from Birdeye
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const res = await fetch('/api/tokens');
        const data = await res.json();
        if (data.data?.tokens) {
          setTokens(data.data.tokens);
        }
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTokens();
  }, []);

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

  // Format tokens for banner
  const bannerTokens = tokens.slice(0, 10).map(t => ({
    symbol: t.symbol,
    change: t.price24hChangePercent,
    price: t.price < 0.01
      ? t.price.toFixed(8)
      : t.price.toFixed(4),
  }));

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0F172A',
      color: '#F8FAFC',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Top Banner - Real Data */}
      {bannerTokens.length > 0 && (
        <TokenBanner tokens={bannerTokens} direction="left" />
      )}

      {/* Navbar */}
      <div style={{
        backgroundColor: '#1E293B',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #334155',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Image
            src="/dark.png"
            alt="ChadSwap"
            width={36}
            height={36}
            style={{ borderRadius: '8px' }}
          />
          <span style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#F8FAFC',
          }}>
            ChadSwap
          </span>
        </div>

        {/* Wallet Address */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: '#0F172A',
          padding: '8px 16px',
          borderRadius: '20px',
          border: '1px solid #334155',
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#22C55E',
          }} />
          <span style={{
            color: '#F8FAFC',
            fontSize: '14px',
            fontFamily: 'monospace',
          }}>
            {truncateAddress(address)}
          </span>
          <span style={{
            backgroundColor: '#9945FF',
            color: 'white',
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '10px',
            fontWeight: 'bold',
          }}>
            SOL
          </span>
        </div>

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

        {/* Left Panel - Real Trending Tokens */}
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

          {loading ? (
            <div style={{ color: '#94A3B8', fontSize: '14px' }}>
              Loading tokens...
            </div>
          ) : (
            tokens.slice(0, 15).map((token) => (
                <div
                  key={token.address}
                  onClick={() => router.push(`/trade/${token.symbol}`)}
                  style={{
                    padding: '12px',
                    marginBottom: '8px',
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0F172A'}
                >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Token Logo */}
                  {token.logoURI && (
                    <img
                      src={token.logoURI}
                      alt={token.symbol}
                      width={24}
                      height={24}
                      style={{ borderRadius: '50%' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>
                      {token.symbol}
                    </div>
                    <div style={{ color: '#94A3B8', fontSize: '11px' }}>
                      ${token.price < 0.01
                        ? token.price.toFixed(6)
                        : token.price.toFixed(4)}
                    </div>
                  </div>
                </div>
                <span style={{
                  color: token.price24hChangePercent >= 0 ? '#22C55E' : '#EF4444',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}>
                  {token.price24hChangePercent >= 0 ? '▲' : '▼'}
                  {Math.abs(token.price24hChangePercent).toFixed(1)}%
                </span>
              </div>
            ))
          )}
        </div>

        {/* Middle Panel - Chart */}
        <div style={{
          flex: 1,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: 0,
        }}>
          <h2 style={{
            fontSize: '20px',
            marginBottom: '16px',
            marginTop: 0,
            color: '#F8FAFC',
            flexShrink: 0,
          }}>
            SOL / USD
          </h2>
          <div style={{
            flex: 1,
            backgroundColor: '#1E293B',
            borderRadius: '12px',
            overflow: 'hidden',
            minHeight: '400px',
          }}>
            <PriceChart
              address="So11111111111111111111111111111111111111112"
              symbol="SOL"
            />
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

          <div style={{
            display: 'flex',
            marginBottom: '16px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #334155',
          }}>
            <button style={{
              flex: 1, padding: '10px',
              backgroundColor: '#22C55E',
              color: 'white', border: 'none',
              cursor: 'pointer', fontWeight: 'bold',
              fontSize: '14px',
            }}>BUY</button>
            <button style={{
              flex: 1, padding: '10px',
              backgroundColor: '#0F172A',
              color: '#94A3B8', border: 'none',
              cursor: 'pointer', fontSize: '14px',
            }}>SELL</button>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{
              fontSize: '12px', color: '#94A3B8',
              display: 'block', marginBottom: '6px',
            }}>
              Amount (SOL)
            </label>
            <input
              type="number"
              placeholder="0.00"
              style={{
                width: '100%', padding: '12px',
                backgroundColor: '#0F172A',
                border: '1px solid #334155',
                borderRadius: '8px', color: '#F8FAFC',
                fontSize: '16px', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {['0.1', '0.5', '1', '5'].map(amt => (
              <button key={amt} style={{
                flex: 1, padding: '6px',
                backgroundColor: '#0F172A', color: '#94A3B8',
                border: '1px solid #334155', borderRadius: '6px',
                cursor: 'pointer', fontSize: '12px',
              }}>{amt}</button>
            ))}
          </div>

          <button style={{
            width: '100%', padding: '14px',
            backgroundColor: '#22C55E', color: 'white',
            border: 'none', borderRadius: '8px',
            fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
          }}>
            Buy Token
          </button>
        </div>

      </div>

      {/* Bottom Banner */}
      {bannerTokens.length > 0 && (
        <TokenBanner tokens={bannerTokens} direction="right" />
      )}

    </div>
  );
}