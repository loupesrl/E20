import "../styles/globals.css";
import Header from "../components/Header";
import { Provider as SelfIDProvider } from "@self.id/framework";
import { CERAMIC_NETWORK } from "../constants";
import { aliases } from "../__generated__/aliases";

function MyApp({ Component, pageProps }) {
  return (
    <SelfIDProvider client={{ ceramic: CERAMIC_NETWORK, aliases }}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <Component {...pageProps} />
      </div>
    </SelfIDProvider>
  );
}

export default MyApp;
