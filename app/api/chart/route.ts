import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return Response.json({ error: 'Address required' }, { status: 400 });
  }

  try {
    const timeFrom = Math.floor(Date.now() / 1000) - 86400; // 24 hours ago
    const timeTo = Math.floor(Date.now() / 1000);

    const url = `https://public-api.birdeye.so/defi/ohlcv?address=${address}&type=15m&time_from=${timeFrom}&time_to=${timeTo}`;

    console.log('Fetching chart:', url);

    const response = await fetch(url, {
      headers: {
        'accept': 'application/json',
        'x-chain': 'solana',
        'X-API-KEY': process.env.BIRDEYE_API_KEY || '',
      },
    });

    const data = await response.json();
    console.log('Chart response:', JSON.stringify(data).slice(0, 200));
    return Response.json(data);

  } catch (error) {
    console.error('Chart error:', error);
    return Response.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}