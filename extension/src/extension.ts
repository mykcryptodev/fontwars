import * as vscode from 'vscode';

interface TokenHoldings {
    comic: number;
    helvetica: number;
}

export function activate(context: vscode.ExtensionContext) {
    console.log('FontWars is now active!');

    let updateFontTimer: NodeJS.Timeout;  // Changed from Timer to Timeout

    async function getTokenValues(address: string): Promise<TokenHoldings> {
        try {
            // Note: You'll need to replace these with the actual token contract addresses
            const COMIC_CONTRACT = "0x00ef6220b7e28e890a5a265d82589e072564cc57"; // Comic Sans token contract
            const HEL_CONTRACT = "0x03e1ffbe7dd1e1ba6653ba6568ad6db7c91ca2de";   // Helvetica token contract

            // Get token balances (using example endpoints - replace with actual API endpoints)
            const comicBalance = await getTokenBalance(address, COMIC_CONTRACT);
            const helBalance = await getTokenBalance(address, HEL_CONTRACT);

            // Get token prices (replace with actual token price API endpoints)
            const comicPrice = await getTokenPrice('comic-token');
            const helPrice = await getTokenPrice('helvetica-token');

            return {
                comic: comicBalance * comicPrice,
                helvetica: helBalance * helPrice
            };
        } catch (error) {
            console.error('Error fetching token values:', error);
            return { comic: 0, helvetica: 0 };
        }
    }

    async function getTokenBalance(address: string, tokenContract: string): Promise<number> {
        // Replace with actual token balance fetching logic
        const response = await fetch(
            `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${tokenContract}&address=${address}&tag=latest`
        );
				const data = await response.json();
        return parseInt(data.result) / 1e18;
    }

    async function getTokenPrice(tokenId: string): Promise<number> {
			// use viem to get the price
			
    }

    async function updateFont() {
        const config = vscode.workspace.getConfiguration('fontWars');
        const walletAddress = config.get<string>('walletAddress');
        
        if (!walletAddress) {
            vscode.window.showWarningMessage('FontWars: Please configure a wallet address in settings.');
            return;
        }

        const holdings = await getTokenValues(walletAddress);
        const newFont = holdings.comic > holdings.helvetica ? 'Comic Sans MS' : 'Helvetica';
        
        // Update editor font
        await vscode.workspace.getConfiguration('editor').update('fontFamily', newFont, true);
        
        vscode.window.showInformationMessage(
            `FontWars: $COMIC: $${holdings.comic.toFixed(2)} vs $HEL: $${holdings.helvetica.toFixed(2)} - Using ${newFont}`
        );
    }

    // Initial update
    updateFont();

    // Set up timer for periodic updates
    const interval = vscode.workspace.getConfiguration('fontWars').get<number>('updateInterval')! * 1000;
    updateFontTimer = setInterval(updateFont, interval);

    // Register command to force update
    let disposable = vscode.commands.registerCommand('fontWars.updateNow', updateFont);
    context.subscriptions.push(disposable);

    // Clean up timer on deactivation
    context.subscriptions.push({
        dispose: () => {
            if (updateFontTimer) {
                clearInterval(updateFontTimer);
            }
        }
    });
}

export function deactivate() {}