import Header from '~/components/Header';
import Swap from '~/components/Swap';
import TokenCard from '~/components/TokenCard'

const HELVETICA = "0x03e1ffbe7dd1e1ba6653ba6568ad6db7c91ca2de"
const COMIC = "0x00ef6220b7e28e890a5a265d82589e072564cc57"

async function getTokenData(address: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/token/${address}`, {
    next: { revalidate: 60 } // Revalidate every 60 seconds
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch token data for ${address}`);
  }
  
  return response.json();
}

export default async function Home() {
  const [comicData, helveticaData] = await Promise.all([
    getTokenData(COMIC),
    getTokenData(HELVETICA)
  ]);

  helveticaData.imageUrl = "https://fontcoins.com/helvetica.webp"

  return (
    <main className="min-h-screen p-8">
      <Header />

      <div className="flex gap-6">
        <TokenCard {...comicData} />
        <TokenCard {...helveticaData} />
      </div>
      <div>
        <Swap 
          from={comicData}
          to={helveticaData}
        />
      </div>
    </main>
  )
}
