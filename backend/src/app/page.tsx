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

export default async function Home() {
  const [comicData, helveticaData] = await Promise.all([
    getTokenData(COMIC),
    getTokenData(HELVETICA)
  ]);

  helveticaData.imageUrl = "https://fontcoins.com/helvetica.webp"

  const tokenWithBiggerMarketCap = Number(comicData.marketCap) > Number(helveticaData.marketCap) ? comicData : helveticaData;
  const tokenWithSmallerMarketCap = Number(comicData.marketCap) < Number(helveticaData.marketCap) ? comicData : helveticaData;

  return (
    <main className="min-h-screen p-8">
      <Header />

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        <div className="flex flex-col xl:flex-row gap-6 w-full justify-center items-center">
          <TokenCard {...comicData} />
          <TokenCard {...helveticaData} />
        </div>
        <div className="w-full flex justify-center items-center">
          <Swap 
            from={tokenWithBiggerMarketCap}
            to={tokenWithSmallerMarketCap}
          />
        </div>
      </div>
    </main>
  )
}
