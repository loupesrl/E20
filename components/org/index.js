import { EthereumAuthProvider, useViewerConnection } from "@self.id/framework";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Button from "../Button";
import H1 from "../H1";
import dynamic from "next/dynamic";
import ConnectButton from "../ConnectButton";
import NoEvents from "./NoEvents";
import CreateEventDialog from "./CreateEventDialog";
import { useRouter } from "next/router";

export default function Org(props) {
  const router = useRouter();

  /* const [pippo, setPippo] = useState('world') */
  const [connection, connect, disconnect] = useViewerConnection();
  const [events, setEvents] = useState([]);

  const [showDialog, setShowDialog] = useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  function handleEventCreation(name) {
    setEvents((events) => [...events, { id: events.length + 1, name }]);
  }

  return (
    <div
      className={`container mx-auto py-10 flex flex-col grow relative ${
        events.length === 0 ? "items-center justify-center gap-8" : ""
      }`}
    >
      {connection.status === "connected" ? (
        events.length === 0 ? (
          <NoEvents onCreateConfirm={(name) => handleEventCreation(name)} />
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3">
              <H1>Your events</H1>
            </div>
            {events.map((ev, i) => (
              <Link key={i} href={`/orgs/${props.orgId}/events/${ev.id}`}>
                <a className="border rounded-md p-4 shadow-lg">{ev.name}</a>
              </Link>
            ))}
            <Button variant="fab" onClick={() => open()}>
              Create
            </Button>

            <CreateEventDialog
              onCreateConfirm={(name) => handleEventCreation(name)}
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
