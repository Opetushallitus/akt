export interface DatePickerProps {
  value: string;
  setValue: (value: string) => void;
  label: string;
  minDate: Date;
  maxDate: Date;
}
