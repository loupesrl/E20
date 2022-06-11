import {
  Dialog as ReachDialog,
  DialogOverlay,
  DialogContent,
} from "@reach/dialog";
import "@reach/dialog/styles.css";

function Dialog(props) {
  return (
    <ReachDialog isOpen={props.isOpen} onDismiss={props.onDismiss}>
      {props.children}
    </ReachDialog>
  );
}

export default Dialog;
