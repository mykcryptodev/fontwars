'use client'

import { SwapDefault } from '@coinbase/onchainkit/swap'
import { Token } from '@coinbase/onchainkit/token';
import { TokenData } from '~/types/token';

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
