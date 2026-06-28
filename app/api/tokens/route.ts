export async function GET() {
  try {
    const response = await fetch(
      'https://public-api.birdeye.so/defi/token_trending?sort_by=rank&sort_type=asc&offset=0&limit=20',
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
    return Response.json(
      { error: 'Failed to fetch tokens' },
      { status: 500 }
    );
  }
}