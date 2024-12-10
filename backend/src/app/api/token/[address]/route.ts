import { NextRequest, NextResponse } from 'next/server';


// Helper to extract decimal places and fraction
function getPriceComponents(price: number) {
  const priceStr = price.toString();
  const [whole, decimal = ''] = priceStr.split('.');
  let decimals = 0;
  let fraction = 0;

  if (decimal) {
    // Count leading zeros
    decimals = decimal.match(/^0*/)?.[0].length || 0;
    // Get first non-zero numbers
    fraction = parseInt(decimal.replace(/^0*/, '').slice(0, 4));
  }

  return {
    value: Number(whole) || 0,
    decimals,
    fraction
  };
}

export async function GET(
  request: NextRequest,
  context: { params: { address: string } }
) {
  const address = context.params.address;

  try {
    const query = `
      query getTokenData($address: Address!) {
        fungibleToken(address: $address, network: BASE_MAINNET) {
          symbol
          name
          decimals
          imageUrl
          onchainMarketData {
            price(currency: USD)
            marketCap
            totalLiquidity
          }
          holders(first: 1) {
            totalCount
          }
        }
      }
    `;

    const response = await fetch('https://public.zapper.xyz/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(process.env.ZAPPER_API_KEY!).toString('base64')}`,
      },
      body: JSON.stringify({
        query,
        variables: {
          address,
        },
      }),
    });

    const json = await response.json();
    
    if (!json.data?.fungibleToken) {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 404 }
      );
    }

    const { fungibleToken } = json.data;
    console.log("fungible", fungibleToken)
    const price = fungibleToken.onchainMarketData?.price || 0;
    const volume = fungibleToken.onchainMarketData?.totalLiquidity || 0;
    const holdersCount = fungibleToken.holders?.totalCount || 0;
    const marketCap = fungibleToken.onchainMarketData?.marketCap || 0;

    const tokenData = {
      contractAddress: address,
      symbol: fungibleToken.symbol,
      name: fungibleToken.name,
      imageUrl: fungibleToken.imageUrl,
      price: getPriceComponents(price),
      marketCap: marketCap.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      volume24h: volume.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      holders: {
        count: holdersCount,
        name: `${fungibleToken.symbol.toLowerCase()}ans`
      },
      decimals: fungibleToken.decimals,
    };

    return NextResponse.json(tokenData, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    });

  } catch (error) {
    console.error('Error fetching token data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token data' },
      { status: 500 }
    );
  }
} 