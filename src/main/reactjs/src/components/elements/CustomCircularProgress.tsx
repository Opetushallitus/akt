import { CircularProgress, CircularProgressProps } from '@mui/material';

export const CustomCircularProgress = (props: CircularProgressProps) => (
  <div className="progress-indicator">
    <CircularProgress {...props} />
  </div>
);
