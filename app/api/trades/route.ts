import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return Response.json({ error: 'Address required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://public-api.birdeye.so/defi/txs/token?address=${address}&offset=0&limit=20&tx_type=swap`,
      {
        headers: {
          'accept': 'application/json',
          'x-chain': 'solana',
          'X-API-KEY': process.env.BIRDEYE_API_KEY || '',
        },
      }
    );
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Failed' }, { status: 500 });
  }
}