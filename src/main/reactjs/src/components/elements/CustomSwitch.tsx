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
}

export const CustomSwitch = ({
  leftLabel,
  rightLabel,
  errorLabel,
  value,
  disabled,
  onChange,
}: CustomSwitchProps) => {
  const leftLabelClassName = disabled
    ? 'color-disabled margin-right-xs'
    : 'margin-right-xs';

  return (
    <FormGroup className="rows">
      <div className="columns margin-top-sm">
        <Text className={leftLabelClassName}>{leftLabel}</Text>
        <FormControlLabel
          disabled={disabled}
          control={
            <Switch
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
