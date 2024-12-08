"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
function activate(context) {
    console.log('FontWars is now active!');
    let updateFontTimer; // Changed from Timer to Timeout
    async function getTokenValues(address) {
        try {
            // Note: You'll need to replace these with the actual token contract addresses
            const COMIC_CONTRACT = "0x..."; // Comic Sans token contract
            const HEL_CONTRACT = "0x..."; // Helvetica token contract
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
        }
        catch (error) {
            console.error('Error fetching token values:', error);
            return { comic: 0, helvetica: 0 };
        }
    }
    async function getTokenBalance(address, tokenContract) {
        // Replace with actual token balance fetching logic
        const response = await axios_1.default.get(`https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${tokenContract}&address=${address}&tag=latest`);
        return parseInt(response.data.result) / 1e18;
    }
    async function getTokenPrice(tokenId) {
        // Replace with actual price API endpoint
        const response = await axios_1.default.get(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`);
        return response.data[tokenId].usd;
    }
    async function updateFont() {
        const config = vscode.workspace.getConfiguration('fontWars');
        const walletAddress = config.get('walletAddress');
        if (!walletAddress) {
            vscode.window.showWarningMessage('FontWars: Please configure a wallet address in settings.');
            return;
        }
        const holdings = await getTokenValues(walletAddress);
        const newFont = holdings.comic > holdings.helvetica ? 'Comic Sans MS' : 'Helvetica';
        // Update editor font
        await vscode.workspace.getConfiguration('editor').update('fontFamily', newFont, true);
        vscode.window.showInformationMessage(`FontWars: $COMIC: $${holdings.comic.toFixed(2)} vs $HEL: $${holdings.helvetica.toFixed(2)} - Using ${newFont}`);
    }
    // Initial update
    updateFont();
    // Set up timer for periodic updates
    const interval = vscode.workspace.getConfiguration('fontWars').get('updateInterval') * 1000;
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
function deactivate() { }
//# sourceMappingURL=extension.js.map