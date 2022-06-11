import { EthereumAuthProvider, useViewerConnection } from "@self.id/framework";
import Button from "./Button";
import H1 from "./H1";

export default function ConnectButton() {
  const [connection, connect, disconnect] = useViewerConnection();

  return connection.status === "connected" ? (
    <H1>Connected</H1>
  ) : typeof window !== "undefined" && "ethereum" in window ? (
    <Button
      disabled={connection.status === "connecting"}
      onClick={async () => {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        await connect(new EthereumAuthProvider(window.ethereum, accounts[0]));
      }}
    >
      Connect
    </Button>
  ) : (
    <p>
      An injected Ethereum provider such as{" "}
      <a href="https://metamask.io/">MetaMask</a> is needed to authenticate.
    </p>
  );
}
