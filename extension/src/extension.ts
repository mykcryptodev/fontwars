import * as vscode from 'vscode';
import { fetch } from 'undici';

type FontWarsValue = {
    dominantToken: string,
    values: {
        helvetica: number,
        comicsans: number
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('FontWars is now active!');

    let updateFontTimer: NodeJS.Timeout;
    let isEnabled = true;

    function fontNameToFontFamily(fontName: string): string {
        const fontMap: Record<string, string> = {
            'comicsans': '"Comic Sans MS"', 
            'helvetica': 'Helvetica'
        };
        return fontMap[fontName] || fontName;
    }

    async function getFontWarsValue(walletAddress: string): Promise<FontWarsValue> {
        // make a POST request to https://fontwars.vercel.app/api/balances and pass the wallet address in the body
        const response = await fetch('https://fontwars.vercel.app/api/balances', {
            method: 'POST',
            body: JSON.stringify({ walletAddress }),
        });
        return await response.json() as FontWarsValue;
    }

    async function updateFont() {
        if (!isEnabled) return;
        const config = vscode.workspace.getConfiguration('fontWars');
        const walletAddress = config.get<string>('walletAddress');
        
        if (!walletAddress) {
            vscode.window.showWarningMessage('FontWars: Please configure a wallet address in settings.');
            return;
        }

        const fontWarsValue = await getFontWarsValue(walletAddress);
        
        // Update editor font
        await vscode.workspace.getConfiguration('editor').update('fontFamily', fontNameToFontFamily(fontWarsValue.dominantToken), true);
        
        const currentFont = vscode.workspace.getConfiguration('editor').get<string>('fontFamily');
        const newFont = fontNameToFontFamily(fontWarsValue.dominantToken);
        if (currentFont !== newFont) {
            vscode.window.showInformationMessage(
                `FontWars Update:  Using ${newFont} (CS: $${fontWarsValue.values.comicsans.toFixed(2)} vs HEL: $${fontWarsValue.values.helvetica.toFixed(2)})`
            );
        }
    }

    // Initial update
    updateFont();

    // Set up timer for periodic updates
    const interval = 30 * 60 * 1000; // 30 minutes
    updateFontTimer = setInterval(updateFont, interval);

    // Register command to force update
    let disposable = vscode.commands.registerCommand('fontWars.updateNow', updateFont);
    context.subscriptions.push(disposable);

    // Register command to reset font
    disposable = vscode.commands.registerCommand('fontWars.resetFont', async () => {
        await vscode.workspace.getConfiguration('editor').update('fontFamily', undefined, true);
        vscode.window.showInformationMessage('FontWars: Font reset to default');
    });
    context.subscriptions.push(disposable);

    // Register command to toggle extension
    disposable = vscode.commands.registerCommand('fontWars.toggleEnabled', async () => {
        isEnabled = !isEnabled;
        if (!isEnabled) {
            clearInterval(updateFontTimer);
            vscode.window.showInformationMessage('FontWars: Extension disabled');
        } else {
            updateFont();
            updateFontTimer = setInterval(updateFont, interval);
            vscode.window.showInformationMessage('FontWars: Extension enabled');
        }
    });
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