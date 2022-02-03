import { CircularProgress, CircularProgressProps } from '@mui/material';

import { H3 } from 'components/elements/Text';
import { Color } from 'enums/app';

export const CircularStepper = (
  props: CircularProgressProps & { value: number; text: string }
) => {
  return (
    <div className="circular-stepper">
      <CircularProgress
        className="circular-stepper__progress"
        color={Color.Secondary}
        variant="determinate"
        {...props}
      />
      <div className="circular-stepper__heading">
        <H3>{props.text}</H3>
      </div>
    </div>
  );
};
