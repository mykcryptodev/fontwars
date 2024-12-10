export type TokenData = {
  contractAddress: string;
  symbol: string;
  name: string;
  price: {
    value: number;
    decimals: number;
    fraction: number;
  };
  marketCap: string;
  volume24h: string;
  holders: {
    count: number;
    name: string;
    top: {
      address: string;
      balance: string;
      share: string;
      valueUSD: string;
    }[];
  };
  imageUrl: string;
  decimals: number;
}
