'use client'

import { WalletDefault } from '@coinbase/onchainkit/wallet';

export default function Header() {
  return (
    <header className="flex justify-between items-center mb-12">
      <h1 className="text-4xl font-bold">fontwars.lol</h1>
      <WalletDefault />
    </header>
  )
}