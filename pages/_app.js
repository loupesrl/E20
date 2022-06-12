import "../styles/globals.css";
import Header from "../components/Header";
import { Provider as SelfIDProvider } from "@self.id/framework";
import { CERAMIC_NETWORK } from "../constants";
import { aliases } from "../__generated__/aliases";
import { WalletContext } from '../utils/burnerWallet'
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  const [wallet, setWallet] = useState({})
  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
      <SelfIDProvider client={{ ceramic: CERAMIC_NETWORK, aliases }}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <Component {...pageProps} />
        </div>
      </SelfIDProvider>
    </WalletContext.Provider>
  );
}

export default MyApp;
