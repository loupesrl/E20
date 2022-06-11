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
import NoEventInstances from "./NoEventInstances";
import CreateEventDialog from "./CreateEventInstanceDialog";
import { useRouter } from "next/router";

export default function Event(props) {
  const [connection, connect, disconnect] = useViewerConnection();
  const organizationsRecord = useViewerRecord("organizations");

  const [currentOrg, setCurrentOrg] = useState();
  const [currentEvent, setCurrentEvent] = useState();

  useEffect(() => {
    if (organizationsRecord.content) {
      const [_currOrg] = organizationsRecord?.content?.organizations?.filter(
        (org) => {
          const [, orgId] = org.id.split("ceramic://");

          return orgId === props.orgId;
        }
      );

      const [_currEvent] = _currOrg?.events?.filter((ev) => {
        const [, eventId] = ev.id.split("ceramic://");

        return eventId === props.eventId;
      });

      setCurrentOrg(_currOrg);
      setCurrentEvent(_currEvent);
    }
  }, [organizationsRecord, props.orgId, props.eventId]);

  useEffect(() => {
    console.log(currentOrg);
  }, [currentOrg]);

  const [showDialog, setShowDialog] = useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  // console.log(organizationsRecord?.content?.organizations);

  // console.log("test", connection?.selfID?.client?.dataModel);

  async function handleEventInstanceCreation(name) {
    const orgs = organizationsRecord?.content?.organizations;

    const doc = await connection.selfID.client.dataModel.createTile(
      "EventInstance",
      {
        name,
        basicInfos: {},
        poap: { supply: 0 },
        polls: [],
      }
    );

    await organizationsRecord.merge({
      organizations: orgs.map((org) => {
        const [, orgId] = org.id.split("ceramic://");

        if (orgId === props.orgId) {
          return {
            ...org,
            events: org.events.map((ev) => {
              const [, evId] = ev.id.split("ceramic://");

              if (evId === props.eventId) {
                return {
                  ...ev,
                  instances: [
                    ...(ev?.instances ?? []),
                    {
                      id: doc.id.toUrl(),
                      name,
                      basicInfos: {},
                      poap: { supply: 0 },
                      polls: [],
                    },
                  ],
                };
              }

              return ev;
            }),
          };
        }

        return org;
      }),
    });
  }

  return (
    <div
      className={`container mx-auto py-10 flex flex-col grow relative ${
        (currentEvent?.instances?.length ?? 0) === 0
          ? "items-center justify-center gap-8"
          : ""
      }`}
    >
      {connection.status === "connected" ? (
        (currentEvent?.instances?.length ?? 0) === 0 ? (
          <NoEventInstances
            onCreateConfirm={(name) => handleEventInstanceCreation(name)}
          />
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3">
              <H1>Your event instances</H1>
            </div>
            {currentEvent?.instances.map((instance, i) => (
              <Link
                key={i}
                href={`/orgs/${props.orgId}/events/${props.eventId}/instances/${
                  instance.id.split("ceramic://")[1]
                }`}
              >
                <a className="border rounded-md p-4 shadow-lg">
                  {instance.name}
                </a>
              </Link>
            ))}

            <Button variant="fab" onClick={() => open()}>
              Create
            </Button>

            <CreateEventDialog
              onCreateConfirm={(name) => handleEventInstanceCreation(name)}
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
