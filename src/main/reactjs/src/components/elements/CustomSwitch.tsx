import {
  FormControlLabel,
  FormGroup,
  Switch,
  SwitchProps,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';

import { Text } from 'components/elements/Text';
import { Color } from 'enums/app';

interface CustomSwitchProps extends SwitchProps {
  onSwitchValueChange(newValue: boolean): void;
  leftLabel: string;
  rightLabel: string;
}

export const CustomSwitch = ({
  onSwitchValueChange,
  leftLabel,
  rightLabel,
}: CustomSwitchProps) => {
  const [checked, setChecked] = useState(true);

  const handleSwitchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setChecked(newValue);
    onSwitchValueChange(newValue);
  };

  return (
    <FormGroup>
      <div className="columns">
        <Text className="margin-right-xs">{leftLabel}</Text>
        <FormControlLabel
          control={
            <Switch
              checked={checked}
              color={Color.Secondary}
              onChange={handleSwitchChange}
            />
          }
          label={rightLabel}
        />
      </div>
    </FormGroup>
  );
};
