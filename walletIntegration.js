class WalletIntegration {
    static wallets = [
        { address: "0xREDPLAYER", balance: 100 },
        { address: "0xWHITEPLAYER", balance: 100 }
    ];

    static getWallet(idx) {
        return WalletIntegration.wallets[idx];
    }

    static transfer(fromIdx, toIdx, amount) {
        if (WalletIntegration.wallets[fromIdx].balance >= amount) {
            WalletIntegration.wallets[fromIdx].balance -= amount;
            WalletIntegration.wallets[toIdx].balance += amount;
            return true;
        }
        return false;
    }
}

window.WalletIntegration = WalletIntegration;