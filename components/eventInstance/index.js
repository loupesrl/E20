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
// import CreateEventDialog from "./CreateEventInstanceDialog";
import { useRouter } from "next/router";
import BasicInfos from "./BasicInfos";
import POAP from "./POAP";
import Polls from "./Polls";
import NavItem from "./NavItem";

export default function Event(props) {
  const [connection, connect, disconnect] = useViewerConnection();
  const organizationsRecord = useViewerRecord("organizations");

  const [currentOrg, setCurrentOrg] = useState();
  const [currentEvent, setCurrentEvent] = useState();
  const [currentEventInstance, setCurrentEventInstance] = useState();

  const [currentSection, setCurrentSection] = useState(0);

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

      const [_currEventInstance] = _currEvent?.instances?.filter((inst) => {
        const [, instId] = inst.id.split("ceramic://");

        return instId === props.eventInstanceId;
      });

      setCurrentOrg(_currOrg);
      setCurrentEvent(_currEvent);
      setCurrentEventInstance(_currEventInstance);
    }
  }, [organizationsRecord, props.orgId, props.eventId, props.eventInstanceId]);

  const [showDialog, setShowDialog] = useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  // console.log(organizationsRecord?.content?.organizations);

  // console.log("test", connection?.selfID?.client?.dataModel);

  async function handleEventInstanceCreation(name) {
    const orgs = organizationsRecord?.content?.organizations;

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
                  instances: ev.instances.map((inst) => {
                    const [, instId] = inst.id.split("ceramic://");

                    if (inst.id === instId)
                      return {
                        id: inst.id,
                        name,
                        basicInfos: {},
                        poap: { supply: 0 },
                        polls: [],
                      };

                    return inst;
                  }),
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
    <div className={`container mx-auto py-10 flex flex-col grow relative`}>
      {connection.status === "connected" ? (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-3">
            <H1>Your event instances</H1>
          </div>

          <div className="flex flex-col gap-8">
            <NavItem
              active={currentSection === 0}
              onClick={() => setCurrentSection(0)}
            >
              Basic infos
            </NavItem>
            <NavItem
              active={currentSection === 1}
              onClick={() => setCurrentSection(1)}
            >
              POAP
            </NavItem>
            <NavItem
              active={currentSection === 2}
              onClick={() => setCurrentSection(2)}
            >
              Polls
            </NavItem>
          </div>

          <div className=" col-span-2">
            {currentSection === 0 && (
              <BasicInfos
                currentEventInstance={currentEventInstance}
                orgId={props.orgId}
                eventId={props.eventId}
                eventInstanceId={props.eventInstanceId}
              />
            )}
            {currentSection === 1 && (
              <POAP
                currentEventInstance={currentEventInstance}
                orgId={props.orgId}
                eventId={props.eventId}
                eventInstanceId={props.eventInstanceId}
              />
            )}
            {currentSection === 2 && (
              <Polls
                currentEventInstance={currentEventInstance}
                orgId={props.orgId}
                eventId={props.eventId}
                eventInstanceId={props.eventInstanceId}
              />
            )}
          </div>

          {/* <CreateEventDialog
            onCreateConfirm={(name) => handleEventInstanceCreation(name)}
            showDialog={showDialog}
            close={() => close()}
          /> */}
        </div>
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
