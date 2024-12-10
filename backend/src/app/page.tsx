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

  return (
    <main className="min-h-screen p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold">fontwars.lol</h1>
        <button className="px-4 py-2 border-2 border-black rounded-full">
          Connect Wallet
        </button>
      </header>

      <div className="flex gap-6">
        <TokenCard {...comicData} />
        <TokenCard {...helveticaData} />
      </div>
    </main>
  )
}
