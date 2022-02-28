import { CustomButton } from 'components/elements/CustomButton';
import { Color, Variant } from 'enums/app';

interface ToggleFilterItem<T> {
  status: T;
  label: string;
  count?: number;
  testId?: string;
}
interface ToggleFilterProps<T> {
  filters: Array<ToggleFilterItem<T>>;
  activeStatus: T;
  onButtonClick(T: T): void;
}

export function ToggleFilter<T>({
  filters,
  activeStatus,
  onButtonClick,
}: ToggleFilterProps<T>) {
  return (
    <>
      {filters.map(({ count, status, testId, label }, i) => (
        <CustomButton
          key={i}
          data-testid={testId}
          color={Color.Secondary}
          variant={
            activeStatus === status ? Variant.Contained : Variant.Outlined
          }
          onClick={() => onButtonClick(status)}
        >
          <div className="columns gapped">
            <div className="grow">{label}</div>
            {count && <div>{`(${count})`}</div>}
          </div>
        </CustomButton>
      ))}
    </>
  );
}
