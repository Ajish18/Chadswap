'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';

interface PriceChartProps {
  address: string;
  symbol: string;
}

export default function PriceChart({ address, symbol }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Wait for DOM to fully render
    const timer = setTimeout(() => {
      if (!chartContainerRef.current) return;

      const container = chartContainerRef.current;
      const width = container.offsetWidth || 600;
      const height = 450;

      console.log('Chart container size:', width, height);

      const chart = createChart(container, {
        layout: {
          background: { type: ColorType.Solid, color: '#1E293B' },
          textColor: '#94A3B8',
        },
        grid: {
          vertLines: { color: '#334155' },
          horzLines: { color: '#334155' },
        },
        crosshair: {
          vertLine: { color: '#475569' },
          horzLine: { color: '#475569' },
        },
        rightPriceScale: {
          borderColor: '#334155',
        },
        timeScale: {
          borderColor: '#334155',
          timeVisible: true,
        },
        width: width,
        height: height,
      });

      const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#22C55E',
        downColor: '#EF4444',
        borderUpColor: '#22C55E',
        borderDownColor: '#EF4444',
        wickUpColor: '#22C55E',
        wickDownColor: '#EF4444',
      });

      const fetchData = async () => {
        try {
          const res = await fetch(`/api/chart?address=${address}`);
          const data = await res.json();
          const items = data?.data?.items;

          if (items && items.length > 0) {
            const chartData = items.map((item: {
              unixTime: number;
              o: number;
              h: number;
              l: number;
              c: number;
            }) => ({
              time: item.unixTime as number,
              open: item.o,
              high: item.h,
              low: item.l,
              close: item.c,
            }));

            console.log('Setting', chartData.length, 'candles');
            candlestickSeries.setData(chartData);
            chart.timeScale().fitContent();
          }
        } catch (error) {
          console.error('Chart error:', error);
        }
      };

      fetchData();

      const handleResize = () => {
        if (container) {
          chart.applyOptions({ width: container.offsetWidth });
        }
      };
      window.addEventListener('resize', handleResize);

      // Store cleanup
      container.dataset.cleanup = 'true';

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }, 100); // ← wait 100ms for DOM

    return () => clearTimeout(timer);
  }, [address]);

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#1E293B',
    }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #334155',
        fontSize: '14px',
        color: '#94A3B8',
      }}>
        {symbol}/USD • 15m
      </div>
      <div
        ref={chartContainerRef}
        style={{
          width: '100%',
          height: '450px',
          backgroundColor: '#1E293B',
        }}
      />
    </div>
  );
}