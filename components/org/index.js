import {
  EthereumAuthProvider,
  useViewerConnection,
  useViewerRecord,
} from "@self.id/framework";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "../Button";
import H1 from "../H1";
import dynamic from "next/dynamic";
import ConnectButton from "../ConnectButton";
import NoEvents from "./NoEvents";
import CreateEventDialog from "./CreateEventDialog";
import { useRouter } from "next/router";

export default function Org(props) {
  const [connection, connect, disconnect] = useViewerConnection();
  const organizationsRecord = useViewerRecord("organizations");

  const [currentOrg, setCurrentOrg] = useState();

  useEffect(() => {
    if (organizationsRecord.content) {
      const [_currOrg] = organizationsRecord?.content?.organizations?.filter(
        (org) => {
          const [, orgId] = org.id.split("ceramic://");

          return orgId === props.orgId;
        }
      );

      setCurrentOrg(_currOrg);
    }
  }, [organizationsRecord, props.orgId]);

  useEffect(() => {
    console.log(currentOrg);
  }, [currentOrg]);

  const [showDialog, setShowDialog] = useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  console.log(organizationsRecord?.content?.organizations);

  // console.log("test", connection?.selfID?.client?.dataModel);

  async function handleEventCreation(name) {
    const orgs = organizationsRecord?.content?.organizations;

    const doc = await connection.selfID.client.dataModel.createTile("Event", {
      name,
      instances: [],
    });

    await organizationsRecord.merge({
      organizations: orgs.map((org) => {
        const [, orgId] = org.id.split("ceramic://");

        if (orgId === props.orgId) {
          return {
            ...org,
            events: [...(org?.events ?? []), { id: doc.id.toUrl(), name }],
          };
        }

        return org;
      }),
    });
  }

  return (
    <div
      className={`container mx-auto py-10 flex flex-col grow relative ${
        (currentOrg?.events?.length ?? 0) === 0
          ? "items-center justify-center gap-8"
          : ""
      }`}
    >
      {connection.status === "connected" ? (
        (currentOrg?.events?.length ?? 0) === 0 ? (
          <NoEvents onCreateConfirm={(name) => handleEventCreation(name)} />
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3">
              <H1>Your events</H1>
            </div>
            {currentOrg?.events.map((ev, i) => (
              <Link
                key={i}
                href={`/orgs/${props.orgId}/events/${
                  ev.id.split("ceramic://")[1]
                }`}
              >
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
