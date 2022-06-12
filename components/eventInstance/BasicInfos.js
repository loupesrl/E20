import { useViewerConnection, useViewerRecord } from "@self.id/framework";
import { useState } from "react";
import Button from "../Button";

import H1 from "../H1";
import Input from "../Input";
import DatetimeInput from "./DatetimeInput";

function BasicInfos(props) {
  const organizationsRecord = useViewerRecord("organizations");

  const [from, setFrom] = useState(
    props?.currentEventInstance?.basicInfos?.from ?? ""
  );
  const [to, setTo] = useState(
    props?.currentEventInstance?.basicInfos?.to ?? ""
  );
  const [position, setPosition] = useState(
    props?.currentEventInstance?.basicInfos?.position ?? { description: "" }
  );
  const [links, setLinks] = useState(
    props?.currentEventInstance?.basicInfos?.links ?? [""]
  );

  async function updateInstance() {
    await organizationsRecord.merge({
      organizations: organizationsRecord.content.organizations.map((org) => {
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

                    if (instId === props.eventInstanceId)
                      return {
                        ...inst,
                        basicInfos: {
                          from,
                          to,
                          position: {
                            ...position,
                            lat: 0,
                            lng: 0,
                          },
                          links,
                        },
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
    <>
      <H1>Basic infos</H1>
      <div className="grid grid-cols-2 gap-8 mt-8 items-end">
        <DatetimeInput
          id="from"
          label="From"
          onChange={(e) => setFrom(e.target.value)}
        />
        <DatetimeInput
          id="to"
          label="To"
          onChange={(e) => setTo(e.target.value)}
        />
        <Input
          id="position"
          label={"Position"}
          value={position.description}
          onChange={(e) =>
            setPosition((position) => {
              return { ...position, description: e.target.value };
            })
          }
        />
        <span></span>
        <div className="col-span-2 flex flex-col gap-4">
          {links.map((link, i) => (
            <div key={i} className="flex gap-4 items-end">
              <Input
                id={`link${i}`}
                label="Link"
                value={link}
                onChange={(e) =>
                  setLinks((links) =>
                    links.map((link, _i) => {
                      if (i === _i) return e.target.value;

                      return link;
                    })
                  )
                }
              />
              <Button
                variant="secondary"
                onClick={() =>
                  setLinks((links) => links.filter((link, _i) => i !== _i))
                }
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            variant="secondary"
            onClick={() => setLinks((links) => [...links, ""])}
          >
            Add
          </Button>
        </div>
        <Button onClick={() => updateInstance()}>Confirm</Button>
      </div>
    </>
  );
}

export default BasicInfos;
