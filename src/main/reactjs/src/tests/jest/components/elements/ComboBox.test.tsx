import renderer from 'react-test-renderer';

import { ComboBox } from 'components/elements/ComboBox';

describe('ComboBox', () => {
  it('should render ComboBox correctly', () => {
    const values = new Map([
      ['bengali', 'BN'],
      ['suomi', 'FI'],
      ['ruotsi', 'SV'],
    ]);
    const tree = renderer
      .create(
        <ComboBox sortByKeys autoHighlight variant="outlined" values={values} />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
