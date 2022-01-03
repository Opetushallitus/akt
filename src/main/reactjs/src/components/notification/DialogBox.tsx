import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import { Text } from 'components/elements/Text';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { notificationSelector } from 'redux/selectors/notifier';
import {
  executeNotifierAction,
  removeNotifierDialog,
} from 'redux/actions/notifier';

export const DialogBox = () => {
  // Redux
  const dispatch = useAppDispatch();
  const { dialogs } = useAppSelector(notificationSelector);
  const [dialog] = dialogs;

  const showDialog = dialogs?.length > 0;

  const handleDialogClose = () => {
    dispatch(removeNotifierDialog(dialog?.id));
  };

  const dispatchAction = (action: string) => {
    dispatch(executeNotifierAction(action));
    handleDialogClose();
  };

  return (
    <>
      {showDialog && (
        <Dialog
          className={`dialog-box--${dialog?.severity}`}
          open={showDialog}
          onClose={handleDialogClose}
        >
          <DialogTitle>{dialog?.title}</DialogTitle>
          <DialogContent>
            <Text>{dialog?.description}</Text>
          </DialogContent>
          <DialogActions>
            {dialog?.actions?.map((a, i) => (
              <Button
                key={i}
                variant={a.variant}
                color="secondary"
                onClick={() => dispatchAction(a.action)}
              >
                {a.title}
              </Button>
            ))}
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
