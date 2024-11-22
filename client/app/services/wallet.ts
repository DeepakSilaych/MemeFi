import { Window as KeplrWindow } from "@keplr-wallet/types";
import { ChainInfo } from "@keplr-wallet/types";

declare global {
  interface Window extends KeplrWindow {
    leap?: KeplrWindow["keplr"];
  }
}

export type SupportedWallet = "keplr" | "leap";

export interface WalletInfo {
  name: string;
  icon: string;
  id: SupportedWallet;
}

export const SUPPORTED_WALLETS: WalletInfo[] = [
  {
    name: "Keplr Wallet",
    icon: "/wallets/keplr.svg",
    id: "keplr",
  },
  {
    name: "Leap Wallet",
    icon: "/wallets/leap.svg",
    id: "leap",
  },
];

// Testnet chain info
export const chainInfo: ChainInfo = {
  chainId: "injective-888",
  chainName: "Injective Testnet",
  rpc: "https://testnet.sentry.tm.injective.network:443",
  rest: "https://testnet.sentry.lcd.injective.network:443",
  bip44: {
    coinType: 60,
  },
  bech32Config: {
    bech32PrefixAccAddr: "inj",
    bech32PrefixAccPub: "injpub",
    bech32PrefixValAddr: "injvaloper",
    bech32PrefixValPub: "injvaloperpub",
    bech32PrefixConsAddr: "injvalcons",
    bech32PrefixConsPub: "injvalconspub",
  },
  currencies: [
    {
      coinDenom: "INJ",
      coinMinimalDenom: "inj",
      coinDecimals: 18,
      coinGeckoId: "injective-protocol",
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "INJ",
      coinMinimalDenom: "inj",
      coinDecimals: 18,
      coinGeckoId: "injective-protocol",
      gasPriceStep: {
        low: 0.0001,
        average: 0.00025,
        high: 0.0004,
      },
    },
  ],
  stakeCurrency: {
    coinDenom: "INJ",
    coinMinimalDenom: "inj",
    coinDecimals: 18,
    coinGeckoId: "injective-protocol",
  },
  features: ["ibc-transfer", "ibc-go", "eth-address-gen", "eth-key-sign"],
  walletUrlForStaking: "https://testnet.hub.injective.network/staking",
  chainSymbolImageUrl: "https://raw.githubusercontent.com/cosmos/chain-registry/master/injective/images/inj.svg",
  txExplorer: {
    name: "Injective Explorer",
    txUrl: "https://testnet.explorer.injective.network/transaction/{txHash}",
  },
};

class WalletService {
  private static instance: WalletService;
  private currentWallet: SupportedWallet | null = null;

  private constructor() {}

  public static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  private getWindow(): Window & typeof globalThis {
    if (typeof window === 'undefined') {
      throw new Error('Window is not available');
    }
    return window;
  }

  async connectWallet(walletId: SupportedWallet): Promise<string> {
    try {
      const win = this.getWindow();
      let wallet;
      switch (walletId) {
        case "keplr":
          wallet = win.keplr;
          break;
        case "leap":
          wallet = win.leap;
          break;
        default:
          throw new Error("Unsupported wallet");
      }

      if (!wallet) {
        const walletName = walletId === 'keplr' ? 'Keplr' : 'Leap';
        throw new Error(`${walletName} wallet not found. Please install it first.`);
      }

      // Enable the chain
      await wallet.experimentalSuggestChain(chainInfo);
      await wallet.enable(chainInfo.chainId);
      
      // Get the offline signer
      const offlineSigner = wallet.getOfflineSigner(chainInfo.chainId);
      
      // Get the user's address
      const accounts = await offlineSigner.getAccounts();
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }
      const address = accounts[0].address;

      this.currentWallet = walletId;
      return address;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    }
  }

  async disconnectWallet(): Promise<void> {
    this.currentWallet = null;
  }

  async signMessage(message: string): Promise<{ signature: string; pubKey: string }> {
    try {
      if (!this.currentWallet) {
        throw new Error("No wallet connected");
      }

      const win = this.getWindow();
      const wallet = this.currentWallet === "keplr" ? win.keplr : win.leap;
      if (!wallet) {
        throw new Error("Wallet not found");
      }

      const accounts = await wallet.getOfflineSigner(chainInfo.chainId).getAccounts();
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }
      const address = accounts[0].address;

      // Sign the message
      const signResponse = await wallet.signArbitrary(
        chainInfo.chainId,
        address,
        message
      );

      if (!signResponse || !signResponse.signature || !signResponse.pub_key?.value) {
        throw new Error('Invalid signature response');
      }

      return {
        signature: signResponse.signature,
        pubKey: signResponse.pub_key.value,
      };
    } catch (error) {
      console.error("Error signing message:", error);
      throw error;
    }
  }

  getCurrentWallet(): SupportedWallet | null {
    return this.currentWallet;
  }

  isWalletInstalled(walletId: SupportedWallet): boolean {
    try {
      const win = this.getWindow();
      return walletId === 'keplr' ? !!win.keplr : !!win.leap;
    } catch {
      return false;
    }
  }
}

export const walletService = WalletService.getInstance();
