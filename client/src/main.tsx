import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { WagmiConfig, createConfig, http } from "wagmi";
import { mainnet, holesky } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// Set up wagmi config with Metamask injected connector
const config = createConfig({
  chains: [holesky, mainnet],
  transports: {
    [holesky.id]: http(),
    [mainnet.id]: http(),
  },
  connectors: [
    injected(),
  ]
});

// Render app with wagmi provider
createRoot(document.getElementById("root")!).render(
  <WagmiConfig config={config}>
    <App />
  </WagmiConfig>
);
