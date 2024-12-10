import Image from "next/image";
import { TokenData } from "~/types/token";

type TokenCardProps = TokenData;

export default function TokenCard({
  symbol,
  name,
  price,
  marketCap,
  volume24h,
  holders,
  imageUrl,
}: TokenCardProps) {
  return (
    <div className="w-[400px] p-6 border-2 border-black rounded-[20px]">
      {/* Token Header */}
      <div className="flex items-start gap-4 mb-6">
        <Image src={imageUrl} alt={name} width={48} height={48} className="mb-6" />
        <div>
          <h2 className="text-xl">${symbol}</h2>
          <p className="text-gray-500">{name}</p>
        </div>
      </div>

      {/* Price and Market Cap */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-gray-500 mb-1">Price</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl">${price.value}</span>
            <span className="text-sm text-gray-500">({price.decimals})</span>
            <span className="text-sm">{price.fraction}</span>
          </div>
        </div>
        <div>
          <p className="text-gray-500 mb-1">Market Cap</p>
          <p className="text-xl">{marketCap}</p>
        </div>
      </div>

      {/* Volume and Holders */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-500 mb-1">24h Volume</p>
          <p className="text-xl">{volume24h}</p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">{holders.name}</p>
          <p className="text-xl">{holders.count.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
} 