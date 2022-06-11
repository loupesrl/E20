import { useState } from "react";

import Button from "../Button";
import Dialog from "../Dialog";
import H1 from "../H1";
import Input from "../Input";

function CreateOrgDialog(props) {
  const [orgName, setOrgName] = useState("");

  return (
    <Dialog isOpen={props.showDialog} onDismiss={props.close}>
      <div className="flex flex-col gap-8">
        <H1>Your event name</H1>
        <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
        <div className="flex gap-2 self-end">
          <Button onClick={props.close} variant="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              props.close();
              props.onCreateConfirm(orgName);
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default CreateOrgDialog;
