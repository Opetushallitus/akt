import renderer from 'react-test-renderer';

import { LanguageSelect } from 'components/elements/LanguageSelect';
import { Variant } from 'enums/app';

describe('LanguageSelect', () => {
  it('should render correctly', () => {
    const languages = ['BN', 'FI', 'SV'];

    const tree = renderer
      .create(
        <LanguageSelect
          autoHighlight
          variant={Variant.Outlined}
          languages={languages}
          value={null}
          filterValue="BN"
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
