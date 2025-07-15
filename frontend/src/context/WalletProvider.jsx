import React from "react";
import { createConfig, WagmiConfig } from "wagmi";
import { polygon, mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  getDefaultWallets,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { createPublicClient, http } from "viem";

// REOWN-specific imports
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {
  polygon as reownPolygon,
  mainnet as reownMainnet,
} from "@reown/appkit/networks";

// ENV VAR check
const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;
if (!projectId) throw new Error("VITE_REOWN_PROJECT_ID is not defined");

// AppKit SDK initialization
const adapter = new WagmiAdapter({
  projectId,
  networks: [reownPolygon, reownMainnet],
  ssr: false,
});

createAppKit({
  adapters: [adapter],
  projectId,
  networks: [reownPolygon, reownMainnet],
  metadata: {
    name: "AxisRWA",
    description: "Fractional RWA Ownership",
    url: window.location.origin,
    icons: [],
  },
});

// WAGMI + RainbowKit setup
const chains = [polygon]; // wagmi chains

const { connectors } = getDefaultWallets({
  appName: "AxisRWA",
  projectId,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient: createPublicClient({
    chain: polygon,
    transport: http(),
  }),
  chains,

  // Optional but good to add if ever used web sockets:
  // webSocketPublicClient: createPublicClient({
  //   chain: polygon,
  //   transport: webSocket(),
  // }),
});

// Final Provider
const queryClient = new QueryClient();

export function WalletProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} theme={darkTheme()}>
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
