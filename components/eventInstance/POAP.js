import { useViewerRecord } from "@self.id/framework";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

import Input from "../Input";
import Button from "../Button";
import H1 from "../H1";

function POAP(props) {
  const organizationsRecord = useViewerRecord("organizations");

  const [name, setName] = useState(
    props?.currentEventInstance?.poap?.name ?? ""
  );
  const [supply, setSupply] = useState(
    props?.currentEventInstance?.poap?.supply ?? ""
  );
  const [picture, setPicture] = useState(
    props?.currentEventInstance?.poap?.picture ?? ""
  );

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
      <H1>POAP</H1>
      <div className="flex flex-col gap-y-8 mt-8">
        <div className="flex gap-8">
          <div className="h-full flex flex-col">
            <label>Picture</label>
            <div
              className="rounded-full bg-stone-200 grow flex items-center h-52 w-52 "
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragActive ? <p>Drop </p> : <p>Drag</p>}
            </div>
          </div>
          <div className="flex flex-col grow">
            <Input
              id="name"
              label={"Name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              id="supply"
              label={"Supply"}
              value={supply}
              onChange={(e) => setSupply(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={() => updateInstance()}>Confirm</Button>
      </div>
    </>
  );
}

export default POAP;
