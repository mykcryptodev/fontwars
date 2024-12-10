import Header from '~/components/Header';
import Swap from '~/components/Swap';
import TokenCard from '~/components/TokenCard'
import { TokenData } from '~/types/token';

const HELVETICA = "0x03e1ffbe7dd1e1ba6653ba6568ad6db7c91ca2de"
const COMIC = "0x00ef6220b7e28e890a5a265d82589e072564cc57"

async function getTokenData(address: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/token/${address}`, {
    next: { revalidate: 60 } // Revalidate every 60 seconds
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch token data for ${address}`);
  }
  
  return response.json() as Promise<TokenData>;
}

async function getBalances() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/balances`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      walletAddress: "0x653Ff253b0c7C1cc52f484e891b71f9f1F010Bfb"
    }),
    next: { revalidate: 60 } // Revalidate every 60 seconds
  });

  return response.json() as Promise<{
    dominantToken: string;
    values: {
      comicsans: number;
      helvetica: number;
    }
  }>;
}

export default async function Home() {
  const [comicData, helveticaData] = await Promise.all([
    getTokenData(COMIC),
    getTokenData(HELVETICA)
  ]);

  const fontWarsBalances = await getBalances();
  const isFontWarsWinningToken = fontWarsBalances.dominantToken === "helvetica" ? helveticaData : comicData;
  
  helveticaData.imageUrl = "https://fontcoins.com/helvetica.webp"

  // Calculate percentages
  const totalSupply = fontWarsBalances.values.comicsans + fontWarsBalances.values.helvetica;
  const comicPercentage = (fontWarsBalances.values.comicsans / totalSupply) * 100;

  return (
    <main className="min-h-screen p-8">
      <Header />

      <div className="flex flex-col gap-6 items-start">
        <div className="flex flex-col gap-2 w-full justify-center items-center">
          <h1 className="text-2xl font-bold">FontWars.base.eth holdings</h1>
          <div className="w-56 h-4 bg-black rounded-full overflow-hidden">
            <div 
              className="h-full bg-warning" 
              style={{ width: `${comicPercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="flex flex-col xl:flex-row gap-6 w-full justify-center items-center">
          <TokenCard {...comicData} />
          <TokenCard {...helveticaData} />
        </div>
        <div className="w-full flex justify-center items-center">
          <Swap 
            from={isFontWarsWinningToken === comicData ? comicData : helveticaData}
            to={isFontWarsWinningToken === comicData ? helveticaData : comicData}
          />
        </div>
      </div>
    </main>
  )
}
