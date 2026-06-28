'use client';

import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import PriceChart from '../../components/PriceChart';

interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  price: number;
  price24hChangePercent: number;
  logoURI: string;
  marketcap: number;
  volume24hUSD: number;
}

interface Trade {
  blockUnixTime: number;
  side: string;
  from: { uiAmount: number };
  volumeUSD: number;
}

export default function TradePage() {
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const router = useRouter();
  const params = useParams();
  const tokenSymbol = params.token as string;

  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [trades, setTrades] = useState<Trade[]>([]);

  const solanaWallet = wallets.find(w => w.walletClientType === 'privy');
  const address = solanaWallet?.address || '';

  const truncateAddress = (addr: string) => {
    if (!addr) return 'Connecting...';
    return addr.slice(0, 4) + '...' + addr.slice(-4);
  };

  useEffect(() => {
    if (ready && !authenticated) router.push('/');
  }, [ready, authenticated, router]);

  useEffect(() => {
    const fetchTokenInfo = async () => {
      try {
        const res = await fetch('/api/tokens');
        const data = await res.json();
        if (data.data?.tokens) {
          const token = data.data.tokens.find(
            (t: TokenInfo) => t.symbol === tokenSymbol
          );
          if (token) setTokenInfo(token);
        }
      } catch (error) {
        console.error('Failed to fetch token:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTokenInfo();
  }, [tokenSymbol]);

  // Fetch live trades
  useEffect(() => {
    if (!tokenInfo?.address) return;

    const fetchTrades = async () => {
      try {
        const res = await fetch(`/api/trades?address=${tokenInfo.address}`);
        const data = await res.json();
        if (data.data?.items) {
          setTrades(data.data.items.slice(0, 8));
        }
      } catch (error) {
        console.error('Trades error:', error);
      }
    };

    fetchTrades();
    const interval = setInterval(fetchTrades, 15000);
    return () => clearInterval(interval);
  }, [tokenInfo?.address]);

  if (!ready) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#F8FAFC',
      }}>Loading...</div>
    );
  }

  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#0F172A',
      color: '#F8FAFC',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>

      {/* Navbar */}
      <div style={{
        backgroundColor: '#1E293B',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #334155',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              backgroundColor: '#0F172A',
              color: '#94A3B8',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >← Back</button>
          <Image
            src="/dark.png"
            alt="ChadSwap"
            width={32}
            height={32}
            style={{ borderRadius: '8px' }}
          />
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>ChadSwap</span>
        </div>

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
            width: '8px', height: '8px',
            borderRadius: '50%',
            backgroundColor: '#22C55E',
          }} />
          <span style={{ color: '#F8FAFC', fontSize: '14px', fontFamily: 'monospace' }}>
            {truncateAddress(address)}
          </span>
          <span style={{
            backgroundColor: '#9945FF', color: 'white',
            fontSize: '11px', padding: '2px 8px',
            borderRadius: '10px', fontWeight: 'bold',
          }}>SOL</span>
        </div>

        <button
          onClick={() => window.location.href = '/logout'}
          style={{
            backgroundColor: '#EF4444', color: 'white',
            border: 'none', borderRadius: '8px',
            padding: '8px 16px', cursor: 'pointer',
            fontSize: '14px', fontWeight: 'bold',
          }}
        >Logout</button>
      </div>

      {/* Main Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

        {/* Left - Token Info */}
        <div style={{
          width: '240px',
          backgroundColor: '#1E293B',
          borderRight: '1px solid #334155',
          padding: '16px',
          overflowY: 'auto',
          flexShrink: 0,
        }}>
          {loading ? (
            <div style={{ color: '#94A3B8' }}>Loading...</div>
          ) : tokenInfo ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                {tokenInfo.logoURI && (
                  <img src={tokenInfo.logoURI} alt={tokenInfo.symbol}
                    width={40} height={40} style={{ borderRadius: '50%' }} />
                )}
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{tokenInfo.symbol}</div>
                  <div style={{ color: '#94A3B8', fontSize: '12px' }}>{tokenInfo.name}</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#0F172A', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                <div style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '4px' }}>Price</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  ${tokenInfo.price < 0.01 ? tokenInfo.price.toFixed(8) : tokenInfo.price.toFixed(4)}
                </div>
                <div style={{ color: tokenInfo.price24hChangePercent >= 0 ? '#22C55E' : '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                  {tokenInfo.price24hChangePercent >= 0 ? '▲' : '▼'}
                  {Math.abs(tokenInfo.price24hChangePercent).toFixed(2)}% (24h)
                </div>
              </div>

              <div style={{ backgroundColor: '#0F172A', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                <div style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '4px' }}>Market Cap</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  ${(tokenInfo.marketcap / 1000000).toFixed(2)}M
                </div>
              </div>

              <div style={{ backgroundColor: '#0F172A', borderRadius: '8px', padding: '12px' }}>
                <div style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '4px' }}>24h Volume</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  ${(tokenInfo.volume24hUSD / 1000000).toFixed(2)}M
                </div>
              </div>
            </>
          ) : (
            <div style={{ color: '#94A3B8' }}>Token not found</div>
          )}
        </div>

        {/* Middle - Chart + Live Trades */}
        <div style={{
          flex: 1,
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflowY: 'auto',
          gap: '16px',
        }}>
          {/* Chart */}
          <div>
            <h2 style={{ fontSize: '18px', marginTop: 0, marginBottom: '12px', color: '#F8FAFC' }}>
              {tokenSymbol} / USD
            </h2>
            <div style={{
              backgroundColor: '#1E293B',
              borderRadius: '12px',
              overflow: 'hidden',
            }}>
              {tokenInfo ? (
                <PriceChart address={tokenInfo.address} symbol={tokenSymbol} />
              ) : (
                <div style={{
                  height: '450px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: '#94A3B8',
                }}>
                  Loading chart...
                </div>
              )}
            </div>
          </div>

          {/* Live Trades */}
          <div style={{
            backgroundColor: '#1E293B',
            borderRadius: '12px',
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid #334155',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#F8FAFC' }}>
                ⚡ Live Trades
              </span>
              <span style={{ fontSize: '11px', color: '#475569' }}>
                refreshes every 15s
              </span>
            </div>

            {/* Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 80px 1fr 1fr',
              padding: '8px 16px',
              fontSize: '11px',
              color: '#475569',
              borderBottom: '1px solid #334155',
            }}>
              <span>TIME</span>
              <span>SIDE</span>
              <span>AMOUNT</span>
              <span>VALUE (USD)</span>
            </div>

            {trades.length === 0 ? (
              <div style={{ padding: '20px', color: '#475569', textAlign: 'center', fontSize: '13px' }}>
                Loading trades...
              </div>
            ) : (
              trades.map((trade, index) => {
                const isBuy = trade.side === 'buy';
                const timeStr = new Date(trade.blockUnixTime * 1000)
                  .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

                return (
                  <div key={index} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 80px 1fr 1fr',
                    padding: '8px 16px',
                    fontSize: '12px',
                    backgroundColor: index % 2 === 0 ? '#0F172A' : 'transparent',
                    borderBottom: '1px solid #1E293B',
                  }}>
                    <span style={{ color: '#94A3B8' }}>{timeStr}</span>
                    <span style={{ color: isBuy ? '#22C55E' : '#EF4444', fontWeight: 'bold' }}>
                      {isBuy ? '▲ BUY' : '▼ SELL'}
                    </span>
                    <span style={{ color: '#F8FAFC' }}>
                      {trade.from?.uiAmount?.toFixed(4) || '0'}
                    </span>
                    <span style={{ color: '#F8FAFC' }}>
                      ${trade.volumeUSD?.toFixed(2) || '0'}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right - Buy/Sell */}
        <div style={{
          width: '280px',
          backgroundColor: '#1E293B',
          borderLeft: '1px solid #334155',
          padding: '16px',
          flexShrink: 0,
          overflowY: 'auto',
        }}>
          <h2 style={{
            fontSize: '14px', color: '#94A3B8',
            marginTop: 0, marginBottom: '16px',
            textTransform: 'uppercase', letterSpacing: '1px',
          }}>
            Trade {tokenSymbol}
          </h2>

          <div style={{
            display: 'flex', marginBottom: '16px',
            borderRadius: '8px', overflow: 'hidden',
            border: '1px solid #334155',
          }}>
            <button onClick={() => setTradeType('buy')} style={{
              flex: 1, padding: '10px',
              backgroundColor: tradeType === 'buy' ? '#22C55E' : '#0F172A',
              color: tradeType === 'buy' ? 'white' : '#94A3B8',
              border: 'none', cursor: 'pointer',
              fontWeight: 'bold', fontSize: '14px',
            }}>BUY</button>
            <button onClick={() => setTradeType('sell')} style={{
              flex: 1, padding: '10px',
              backgroundColor: tradeType === 'sell' ? '#EF4444' : '#0F172A',
              color: tradeType === 'sell' ? 'white' : '#94A3B8',
              border: 'none', cursor: 'pointer', fontSize: '14px',
            }}>SELL</button>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Amount (SOL)
            </label>
            <input
              type="number" placeholder="0.00" value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: '100%', padding: '12px',
                backgroundColor: '#0F172A', border: '1px solid #334155',
                borderRadius: '8px', color: '#F8FAFC',
                fontSize: '16px', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {['0.1', '0.5', '1', '5'].map(amt => (
              <button key={amt} onClick={() => setAmount(amt)} style={{
                flex: 1, padding: '6px',
                backgroundColor: amount === amt ? '#2563EB' : '#0F172A',
                color: amount === amt ? 'white' : '#94A3B8',
                border: '1px solid #334155', borderRadius: '6px',
                cursor: 'pointer', fontSize: '12px',
              }}>{amt}</button>
            ))}
          </div>

          {amount && tokenInfo && (
            <div style={{
              backgroundColor: '#0F172A', borderRadius: '8px',
              padding: '12px', marginBottom: '16px',
              fontSize: '13px', color: '#94A3B8',
            }}>
              You receive ≈{' '}
              <span style={{ color: '#F8FAFC', fontWeight: 'bold' }}>
                {(parseFloat(amount) / tokenInfo.price * 0.999).toFixed(2)} {tokenSymbol}
              </span>
            </div>
          )}

          <button style={{
            width: '100%', padding: '14px',
            backgroundColor: tradeType === 'buy' ? '#22C55E' : '#EF4444',
            color: 'white', border: 'none', borderRadius: '8px',
            fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
          }}>
            {tradeType === 'buy' ? 'Buy' : 'Sell'} {tokenSymbol}
          </button>

          <p style={{ color: '#475569', fontSize: '11px', textAlign: 'center', marginTop: '12px' }}>
            Powered by Jupiter on Solana
          </p>
        </div>
      </div>
    </div>
  );
}