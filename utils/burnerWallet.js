import { ethers } from "ethers"
import { createContext } from "react";

const BURNER_WALLET_LOCAL_STORAGE_KEY = 'BURNER_WALLET_LOCAL_STORAGE_KEY'
const BURNER_WALLET_PASSWORD = 'loupesrl'

export const WalletContext = createContext(null);

export async function getBurnerWallet() {
    return new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80")
    const burnerWallet = localStorage.getItem(BURNER_WALLET_LOCAL_STORAGE_KEY);
    let _wallet = null
    if (burnerWallet && burnerWallet.length > 0) {
        _wallet = await ethers.Wallet.fromEncryptedJson(burnerWallet, BURNER_WALLET_PASSWORD)
    } else {
        _wallet = await generateAndSaveBurnerWallet()
    }
    return _wallet
}

export async function generateAndSaveBurnerWallet() {
    let wallet = ethers.Wallet.createRandom()
    let encryptedWallet = await wallet.encrypt(BURNER_WALLET_PASSWORD)
    localStorage.setItem(BURNER_WALLET_LOCAL_STORAGE_KEY, encryptedWallet);
    return wallet
}