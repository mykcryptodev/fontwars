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
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    console.log('FontWars is now active!');
    let updateFontTimer;
    function fontNameToFontFamily(fontName) {
        // comicsans -> Comic Sans MS
        // helvetica -> Helvetica
        return fontName.replace(/s/g, ' ').replace(/([a-z])([A-Z])/g, '$1-$2').toUpperCase();
    }
    async function getFontWarsValue(walletAddress) {
        // make a POST request to https://fontwars.vercel.app/api/balances and pass the wallet address in the body
        const response = await fetch('https://fontwars.vercel.app/api/balances', {
            method: 'POST',
            body: JSON.stringify({ walletAddress }),
        });
        return await response.json();
    }
    async function updateFont() {
        const config = vscode.workspace.getConfiguration('fontWars');
        const walletAddress = config.get('walletAddress');
        if (!walletAddress) {
            vscode.window.showWarningMessage('FontWars: Please configure a wallet address in settings.');
            return;
        }
        const fontWarsValue = await getFontWarsValue(walletAddress);
        // Update editor font
        await vscode.workspace.getConfiguration('editor').update('fontFamily', fontNameToFontFamily(fontWarsValue.dominantToken), true);
        vscode.window.showInformationMessage(`FontWars: $COMICSANS: $${fontWarsValue.values.comicsans.toFixed(2)} vs $HELVETICA: $${fontWarsValue.values.helvetica.toFixed(2)} - Using ${fontNameToFontFamily(fontWarsValue.dominantToken)}`);
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