import { useState } from "react";

import Button from "../Button";
import Dialog from "../Dialog";
import H1 from "../H1";
import Input from "../Input";

function CreateEventInstanceDialog(props) {
  const [eventInstanceName, setEventInstanceName] = useState("");

  return (
    <Dialog isOpen={props.showDialog} onDismiss={props.close}>
      <div className="flex flex-col gap-8">
        <H1>Your event instance name</H1>
        <Input
          value={eventInstanceName}
          onChange={(e) => setEventInstanceName(e.target.value)}
        />
        <div className="flex gap-2 self-end">
          <Button onClick={props.close} variant="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              props.close();
              props.onCreateConfirm(eventInstanceName);
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default CreateEventInstanceDialog;
