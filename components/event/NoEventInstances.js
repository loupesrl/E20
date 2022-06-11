import { useState } from "react";

import Button from "../Button";
import Dialog from "../Dialog";
import H1 from "../H1";
import Input from "../Input";
import CreateEventInstanceDialog from "./CreateEventInstanceDialog";

function NoEventInstances(props) {
  const [showDialog, setShowDialog] = useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  return (
    <>
      <H1>You have no event instances yet.</H1>
      <Button onClick={() => open()}>Create</Button>

      <CreateEventInstanceDialog
        onCreateConfirm={(name) => props.onCreateConfirm(name)}
        showDialog={showDialog}
        close={() => close()}
      />
    </>
  );
}

export default NoEventInstances;
