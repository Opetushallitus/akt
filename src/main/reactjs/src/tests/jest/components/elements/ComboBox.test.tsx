import renderer from 'react-test-renderer';

import { ComboBox } from 'components/elements/ComboBox';
import { Variant } from 'enums/app';

describe('ComboBox', () => {
  it('should render ComboBox correctly', () => {
    const values = [
      { value: 'BN', label: 'bengali' },
      { value: 'FI', label: 'suomi' },
      { value: 'SV', label: 'ruotsi' },
    ];

    const tree = renderer
      .create(
        <ComboBox
          autoHighlight
          variant={Variant.Outlined}
          values={values}
          value={null}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
