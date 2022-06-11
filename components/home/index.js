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
  const [orgs, setOrgs] = useState([]);

  const organizationsRecord = useViewerRecord("organizations");

  console.log("record", organizationsRecord);

  const [showDialog, setShowDialog] = useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  async function handleOrgCreation(name) {
    // console.log(connection);
    // const selfID = await connect();

    console.log(connection.selfID.client.dataModel.aliases);

    // console.log("User ID: ", selfID?.did.parent);
    // console.log("Session ID: ", selfID?.did.id);

    const doc = await connection.selfID.client.dataModel.createTile(
      "Organization",
      {
        name,
      }
    );

    // console.log(doc);

    // const notes = notesRecord.content?.notes ?? [];
    await organizationsRecord.set({
      organizations: [{ id: doc.id.toUrl(), name }],
    });

    // await organizations.set({ organizations: [{ id: 1, name }] });
    // setOrgs((orgs) => [...orgs, { id: orgs.length + 1, name }]);
  }

  return (
    <div
      className={`container mx-auto py-10 flex flex-col grow relative ${
        orgs.length === 0 ? "items-center justify-center gap-8" : ""
      }`}
    >
      {connection.status === "connected" ? (
        orgs.length === 0 ? (
          <NoOrgs onCreateConfirm={(name) => handleOrgCreation(name)} />
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3">
              <H1>Your organizations</H1>
            </div>
            {orgs.map((org, i) => (
              <Link key={i} href={`/orgs/${org.id}`}>
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
