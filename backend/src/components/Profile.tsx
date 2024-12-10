'use client'

import { IdentityCard } from '@coinbase/onchainkit/identity';
import { base } from "viem/chains"

export default function Profile({ address }: { address: string }) {
    return <IdentityCard address={address} chain={base} />
}