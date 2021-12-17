import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import { StyledDialogProps } from 'interfaces/styledDialog';

const StyledDialog = ({
  title,
  content,
  actions,
  ...rest
}: StyledDialogProps) => (
  <Dialog className={rest.className} open={rest.open} onClose={rest.onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{content}</DialogContent>
    <DialogActions>{actions}</DialogActions>
  </Dialog>
);

export const SuccessDialog = (props: StyledDialogProps) => (
  <StyledDialog className="dialog__success" {...props} />
);

export const ErrorDialog = (props: StyledDialogProps) => (
  <StyledDialog className="dialog__error" {...props} />
);

export const NeutralDialog = (props: StyledDialogProps) => (
  <StyledDialog className="dialog__neutral" {...props} />
);
