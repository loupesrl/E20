import {
  EthereumAuthProvider,
  useViewerConnection,
  useViewerRecord,
} from "@self.id/framework";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Button from "../Button";
import H1 from "../H1";
import dynamic from "next/dynamic";
import ConnectButton from "../ConnectButton";
import NoOrgs from "./NoOrgs";
import CreateOrgDialog from "./CreateOrgDialog";
import { useEffect } from "react";

export default function Home() {
  const [connection, connect, disconnect] = useViewerConnection();
  const organizationsRecord = useViewerRecord("organizations");

  const [showDialog, setShowDialog] = useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  async function handleOrgCreation(name) {
    const doc = await connection.selfID.client.dataModel.createTile(
      "Organization",
      {
        name,
        events: [],
      }
    );

    await organizationsRecord.merge({
      organizations: [
        ...(organizationsRecord?.content?.organizations ?? []),
        { id: doc.id.toUrl(), name },
      ],
    });
  }

  return (
    <div
      className={`container mx-auto py-10 flex flex-col grow relative ${
        (organizationsRecord?.content?.organizations?.length ?? 0) === 0
          ? "items-center justify-center gap-8"
          : ""
      }`}
    >
      {connection.status === "connected" ? (
        (organizationsRecord?.content?.organizations?.length ?? 0) === 0 ? (
          <NoOrgs onCreateConfirm={(name) => handleOrgCreation(name)} />
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3">
              <H1>Your organizations</H1>
            </div>
            {organizationsRecord.content.organizations.map((org, i) => (
              <Link key={i} href={`/orgs/${org.id.split("ceramic://")[1]}`}>
                <a className="border rounded-md p-4 shadow-lg">{org.name}</a>
              </Link>
            ))}
            <Button variant="fab" onClick={() => open()}>
              Create
            </Button>

            <CreateOrgDialog
              onCreateConfirm={(name) => handleOrgCreation(name)}
              showDialog={showDialog}
              close={() => close()}
            />
          </div>
        )
      ) : typeof window !== "undefined" && "ethereum" in window ? (
        <>
          <H1>
            Manage your events.
            <br />
            Without hassles.
          </H1>
          <ConnectButton />
        </>
      ) : (
        <p>
          An injected Ethereum provider such as{" "}
          <a href="https://metamask.io/">MetaMask</a> is needed to authenticate.
        </p>
      )}
    </div>
  );
}
