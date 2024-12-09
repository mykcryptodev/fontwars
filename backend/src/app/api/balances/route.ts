import { NextRequest, NextResponse } from 'next/server';
import { createThirdwebClient, getContract } from "thirdweb";
import { base } from 'thirdweb/chains';
import { balanceOf } from "thirdweb/extensions/erc20";
import { toEther } from "thirdweb/utils";

const thirdwebClient = createThirdwebClient({
	secretKey: process.env.THIRDWEB_SECRET_KEY!,
});

const HELVETICA = "0x03e1ffbe7dd1e1ba6653ba6568ad6db7c91ca2de"
const COMIC = "0x00ef6220b7e28e890a5a265d82589e072564cc57"

async function getTokenPrices() {
    const query = `
        query fungibleTokensByAddresses($tokens: [FungibleTokenInput!]!) {
            fungibleTokensByAddresses(tokens: $tokens) {
                onchainMarketData {
                    price(currency: USD)
                }
            }
        }
    `;

    const variables = {
        tokens: [
            {
                address: HELVETICA,
                network: "BASE_MAINNET",
            },
            {
                address: COMIC,
                network: "BASE_MAINNET"
            }
        ],
    };

    const response = await fetch('https://public.zapper.xyz/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(process.env.ZAPPER_API_KEY!).toString('base64')}`,
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    });

    const json = await response.json();
    return json.data.fungibleTokensByAddresses.map((token: {
      onchainMarketData: {
        price: number;
      };
    }) => token.onchainMarketData.price);
}

async function getTokenBalances(walletAddress: string) {
    const [helvetica, comic] = await Promise.all([
        getContract({
            address: HELVETICA,
            client: thirdwebClient,
            chain: base,
        }),
        getContract({
            address: COMIC,
            client: thirdwebClient,
            chain: base,
        }),
    ]);

    const [helveticaBalance, comicBalance] = await Promise.all([
        balanceOf({ contract: helvetica, address: walletAddress }),
        balanceOf({ contract: comic, address: walletAddress }),
    ]);

    const helveticaBalanceEther = toEther(helveticaBalance);
    const comicBalanceEther = toEther(comicBalance);

    const [helveticaPrice, comicPrice] = await getTokenPrices();

    const helveticaValue = Number(helveticaBalanceEther) * helveticaPrice;
    const comicValue = Number(comicBalanceEther) * comicPrice;

    return {
        helvetica: {
            balance: Number(helveticaBalance),
            price: helveticaPrice,
            value: helveticaValue,
        },
        comicsans: {
            balance: Number(comicBalance),
            price: comicPrice,
            value: comicValue,
        }
    };
}

export async function POST(request: NextRequest) {
    try {
        const { walletAddress } = await request.json();

        if (!walletAddress) {
            return NextResponse.json(
                { error: 'Wallet address is required' },
                { status: 400 }
            );
        }

        const balances = await getTokenBalances(walletAddress);
        
        // Calculate total fiat value for each token
        const helveticaValue = balances.helvetica.value;
        const comicsansValue = balances.comicsans.value;

        // Determine which token has more fiat value
        const dominantToken = helveticaValue > comicsansValue ? 'helvetica' : 'comicsans';

        return NextResponse.json({
            dominantToken,
            values: {
                helvetica: helveticaValue,
                comicsans: comicsansValue
            }
        });

    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
} 