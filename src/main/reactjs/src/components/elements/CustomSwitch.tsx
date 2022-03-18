import {
  FormControlLabel,
  FormGroup,
  Switch,
  SwitchProps,
} from '@mui/material';

import { Caption, Text } from 'components/elements/Text';
import { Color } from 'enums/app';

interface CustomSwitchProps extends SwitchProps {
  leftLabel: string;
  rightLabel: string;
  errorLabel?: string;
  value?: boolean;
  dataTestId?: string;
}

export const CustomSwitch = ({
  leftLabel,
  rightLabel,
  errorLabel,
  value,
  disabled,
  onChange,
  dataTestId,
}: CustomSwitchProps) => {
  const leftLabelClassName = disabled
    ? 'color-disabled margin-right-xs'
    : 'margin-right-xs';

  return (
    <FormGroup className="rows">
      <div className="columns">
        <Text className={leftLabelClassName}>{leftLabel}</Text>
        <FormControlLabel
          disabled={disabled}
          control={
            <Switch
              data-testid={dataTestId}
              checked={value}
              color={Color.Secondary}
              onChange={onChange}
            />
          }
          label={rightLabel}
        />
      </div>
      {errorLabel && <Caption color={Color.Error}>{errorLabel}</Caption>}
    </FormGroup>
  );
};
