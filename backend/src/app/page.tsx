import FontSetter from '~/components/FontSetter';
// import FontwarsHoldings from '~/components/FontwarsHoldings';
import Header from '~/components/Header';
import Profile from '~/components/Profile';
import Swap from '~/components/Swap';
import TokenCard from '~/components/TokenCard'
import { TokenData } from '~/types/token';
import Percentages from '~/components/Percentages';

const HELVETICA = "0x03e1ffbe7dd1e1ba6653ba6568ad6db7c91ca2de"
const COMIC = "0x00ef6220b7e28e890a5a265d82589e072564cc57"

async function getTokenData(address: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/token?address=${address}`, {
    method: 'GET',
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

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [comicData, helveticaData] = await Promise.all([
    getTokenData(COMIC),
    getTokenData(HELVETICA)
  ]);

  const fontWarsBalances = await getBalances();
  const isFontWarsWinningToken = fontWarsBalances.dominantToken === "helvetica" ? helveticaData : comicData;
  
  helveticaData.imageUrl = "https://fontcoins.com/helvetica.webp"

  console.log({ comicData, helveticaData })

  // Calculate percentages
  // const totalSupply = fontWarsBalances.values.comicsans + fontWarsBalances.values.helvetica;
  // const comicPercentage = (fontWarsBalances.values.comicsans / totalSupply) * 100;

  // whichever token is winning will set the font of the website
  // const isComicWinning = comicPercentage > 50;

  // convert the marketcap to a number and whoever has the most marketcap will set the font of the website
  const isComicWinning = comicData.marketCap > helveticaData.marketCap;

  return (
    <main className="min-h-screen p-8">
      <Header />
      <FontSetter isComicWinning={isComicWinning} />

      <div className="flex flex-col gap-6 items-start">
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

        {/* Top Holders */}
        <div className="w-full max-w-screen-md mx-auto">
          <div className="grid grid-cols-2 gap-6 mb-4">
            <h2 className="text-2xl font-bold">Comic Sans Top Holders</h2>
            <h2 className="text-2xl font-bold">Helvetica Top Holders</h2>
          </div>
          
          {/* Map holders in pairs to ensure they stay aligned */}
          {comicData.holders.top.map((holder, index) => (
            <div key={holder.address} className="grid grid-cols-2 gap-6 mb-6">
              <Profile address={holder.address} />
              {helveticaData.holders.top[index] && (
                <Profile address={helveticaData.holders.top[index].address} />
              )}
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold w-full max-w-screen-md mx-auto text-center">Key Opinion Leaders</h2>

        <div className="grid grid-cols-2 gap-6 w-full max-w-screen-md mx-auto">
          <Percentages address="0xAbb485fdC925dc375B5d095a30fcae7f136Fd007" />
          <Percentages address="0x5b759ef9085c80cca14f6b54ee24373f8c765474" />
          <Percentages address="0x653Ff253b0c7C1cc52f484e891b71f9f1F010Bfb" />
          <Percentages address="0x5079EC85c3c8F8E932Bd011B669b77d703DEEea7" />
        </div>
      </div>
    </main>
  )
}
