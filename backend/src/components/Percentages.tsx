'use client';

import { useEffect, useState } from 'react';
import Profile from './Profile';

interface PercentagesProps {
  address: string;
}

interface BalanceResponse {
  dominantToken: string;
  values: {
    comicsans: number;
    helvetica: number;
  }
}

export default function Percentages({ address }: PercentagesProps) {
  const [percentages, setPercentages] = useState<{comic: number, helvetica: number} | null>(null);

  useEffect(() => {
    async function fetchBalances() {
      const response = await fetch(`/api/balances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress: address || "0x653Ff253b0c7C1cc52f484e891b71f9f1F010Bfb" // Default address if none provided
        })
      });

      const data: BalanceResponse = await response.json();
      console.log({ data })
      const totalSupply = data.values.comicsans + data.values.helvetica;
      
      // Handle case where totalSupply is 0 to avoid division by zero
      let comicPercentage = 0;
      let helveticaPercentage = 0;
      
      if (totalSupply > 0) {
        comicPercentage = (data.values.comicsans / totalSupply) * 100;
        helveticaPercentage = (data.values.helvetica / totalSupply) * 100;
      } else if (data.values.comicsans > 0) {
        comicPercentage = 100;
      } else if (data.values.helvetica > 0) {
        helveticaPercentage = 100;
      }

      setPercentages({
        comic: comicPercentage,
        helvetica: helveticaPercentage
      });
    }

    fetchBalances();
  }, [address]);

  if (!percentages) return <div>Loading...</div>;

  return (
    <div className="w-full max-w-xl mx-auto p-4 border border-gray-200 rounded-lg">
      <div className="mb-4">
        <Profile address={address} />
        <div className="flex justify-between my-1">
          <span className="text-sm font-medium">Comic Sans vs Helvetica</span>
          <span className="text-sm font-medium">
            {percentages.comic.toFixed(1)}% / {percentages.helvetica.toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-4 bg-black rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-300"
            style={{ 
              width: `${percentages.comic}%`,
              backgroundColor: '#f5f84c',
              boxShadow: `${percentages.comic}% 0 0 0 black inset`
            }}
          />
        </div>
      </div>
    </div>
  );
}
