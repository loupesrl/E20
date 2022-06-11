import { useState } from "react";

import Button from "../Button";
import Dialog from "../Dialog";
import H1 from "../H1";
import Input from "../Input";
import CreateEventDialog from "./CreateEventDialog";

function NoEvents(props) {
  const [showDialog, setShowDialog] = useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  return (
    <>
      <H1>You have no organizations yet.</H1>
      <Button onClick={() => open()}>Create</Button>

      <CreateEventDialog
        onCreateConfirm={(name) => props.onCreateConfirm(name)}
        showDialog={showDialog}
        close={() => close()}
      />
    </>
  );
}

export default NoEvents;
