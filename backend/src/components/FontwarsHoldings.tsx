'use client'
import Profile from '~/components/Profile';

export default function FontwarsHoldings({ comicPercentage }: { comicPercentage: number }) {
    return (
      <div className="flex flex-col gap-2 w-full justify-center items-center">
      <h1 className="text-2xl font-bold">fontwars.base.eth holdings</h1>
      <Profile address="0x653Ff253b0c7C1cc52f484e891b71f9f1F010Bfb" />
      <div className="w-56 h-4 bg-black rounded-full overflow-hidden">
        <div 
          className="h-full"
          style={{ width: `${comicPercentage}%`, backgroundColor: '#f5f84c' }}
        ></div>
      </div>
      <div className="flex gap-4 text-sm mt-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f5f84c' }}></div>
          <span>Comic Sans ({comicPercentage.toFixed(1)}%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-black rounded-full"></div>
          <span>Helvetica ({(100 - comicPercentage).toFixed(1)}%)</span>
        </div>
      </div>
    </div>
    )
}