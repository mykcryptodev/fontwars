export type TokenData = {
  address: string;
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
  };
  imageUrl: string;
}
