import { WagmiConfig, createConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum } from "@wagmi/chains";
import { createPublicClient, http } from "viem";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const chains = [mainnet, polygon, optimism, arbitrum];

const publicClient = createPublicClient({
  chain: mainnet, // use default chain (required by viem)
  transport: http(),
});

const { connectors } = getDefaultWallets({
  appName: "AxisRWA",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID, // replace this with your WalletConnect project ID
  chains,
});

// Create QueryClient
const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  chains,
});

export function WalletProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
