'use client'

import { SwapDefault } from '@coinbase/onchainkit/swap'
import { Token } from '@coinbase/onchainkit/token';

type TokenData = {
  address: string;
  symbol: string;
  name: string;
  price: {
    value: number;
    decimals: number;
    fraction: number;
  };
  marketCap: string;
  volume24h: string;
  holders: {
    count: number;
    name: string;
  };
  imageUrl: string;
}

interface SwapProps {
  from: TokenData;
  to: TokenData;
}

export default function Swap({ from, to }: SwapProps) {
  const fromToken: Token = {
    address: from.address,
    chainId: 8453,
    decimals: 18,
    image: from.imageUrl,
    name: from.name,
    symbol: from.symbol,
  }

  const toToken: Token = {
    address: to.address,
    chainId: 8453,
    decimals: 18,
    image: to.imageUrl,
    name: to.name,
    symbol: to.symbol,
  }

  return (
    <SwapDefault
      to={[toToken]}
      from={[fromToken]}
    />
  )
}
