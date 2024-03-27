import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig, chain, configureChains, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { mainnet, polygon, arbitrumGoerli} from "wagmi/chains";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import NavBar from "@/components/NavBar";


const { chains, provider } = configureChains(
  [arbitrumGoerli],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "xxx",
  chains,
});

const wagmiClinet = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClinet}>
      <RainbowKitProvider chains={chains}>
        <NavBar></NavBar>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
