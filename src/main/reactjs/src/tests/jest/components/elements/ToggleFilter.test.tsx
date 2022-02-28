import { fireEvent, render } from '@testing-library/react';
import renderer from 'react-test-renderer';

import { ToggleFilter } from 'components/elements/ToggleFilter';
import { MeetingStatus } from 'enums/meetingDate';
import { meetingDateToggleFilters } from 'tests/jest/__fixtures__/toggleFilters';

describe('ToggleFilter', () => {
  it('should render ToggleFilter correctly', () => {
    const tree = renderer
      .create(
        <ToggleFilter
          filters={meetingDateToggleFilters}
          activeStatus={MeetingStatus.Upcoming}
          onButtonClick={jest.fn()}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should call "onClick" prop on button click', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <ToggleFilter
        filters={meetingDateToggleFilters}
        activeStatus={MeetingStatus.Upcoming}
        onButtonClick={onClick}
      />
    );

    fireEvent.click(getByText(/label2/i));

    expect(onClick).toHaveBeenCalled();
  });
});
