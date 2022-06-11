import { ethers } from "ethers"

const BURNER_WALLET_LOCAL_STORAGE_KEY = 'BURNER_WALLET_LOCAL_STORAGE_KEY'
const BURNER_WALLET_PASSWORD = 'loupesrl'

export async function getBurnerWallet() {
    const burnerWallet = localStorage.getItem(BURNER_WALLET_LOCAL_STORAGE_KEY);
    if (burnerWallet && burnerWallet.length > 0) {
        return await ethers.Wallet.fromEncryptedJson(burnerWallet, BURNER_WALLET_PASSWORD)
    } else {
        return await generateAndSaveBurnerWallet()
    }
}

export async function generateAndSaveBurnerWallet() {
    let wallet = ethers.Wallet.createRandom()
    let encryptedWallet = await wallet.encrypt(BURNER_WALLET_PASSWORD)
    localStorage.setItem(BURNER_WALLET_LOCAL_STORAGE_KEY, encryptedWallet);
    return wallet
}