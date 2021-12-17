import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from '@mui/material';

const StyledDialog = ({
  title,
  content,
  actions,
  ...rest
}: DialogProps & {
  title: string;
  content: JSX.Element;
  actions: JSX.Element;
}) => (
  <Dialog className={rest.className} open={rest.open} onClose={rest.onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{content}</DialogContent>
    <DialogActions>{actions}</DialogActions>
  </Dialog>
);

export const SuccessDialog = ({
  title,
  content,
  actions,
  ...rest
}: DialogProps & {
  title: string;
  content: JSX.Element;
  actions: JSX.Element;
}) => (
  <StyledDialog
    className="dialog__success"
    title={title}
    content={content}
    actions={actions}
    {...rest}
  />
);

export const ErrorDialog = ({
  title,
  content,
  actions,
  ...rest
}: DialogProps & {
  title: string;
  content: JSX.Element;
  actions: JSX.Element;
}) => (
  <StyledDialog
    className="dialog__error"
    title={title}
    content={content}
    actions={actions}
    {...rest}
  />
);
