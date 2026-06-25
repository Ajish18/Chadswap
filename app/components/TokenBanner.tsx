'use client';

interface TokenBannerProps {
  tokens: { symbol: string; change: number; price: string }[];
  direction?: 'left' | 'right';
}

export default function TokenBanner({ tokens, direction = 'left' }: TokenBannerProps) {
  const items = [...tokens, ...tokens];

  return (
    <div className="ticker-wrapper" style={{
      backgroundColor: '#1E293B',
      padding: '10px 0',
      borderBottom: '1px solid #334155',
    }}>
      <div className="ticker-track" style={{
        animationDirection: direction === 'right' ? 'reverse' : 'normal',
      }}>
        {items.map((token, index) => (
          <span key={index} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginRight: '48px',
            fontSize: '14px',
            fontWeight: '600',
          }}>
            <span style={{ color: '#F8FAFC' }}>{token.symbol}</span>
            <span style={{ color: '#94A3B8', fontSize: '12px' }}>${token.price}</span>
            <span style={{ color: token.change >= 0 ? '#22C55E' : '#EF4444' }}>
              {token.change >= 0 ? '▲' : '▼'}{Math.abs(token.change).toFixed(1)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}