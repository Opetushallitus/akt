import { APIEndpoints } from 'enums/api';
import { onMeetingDatesPage } from 'tests/cypress/support/page-objects/meetingDatesPage';
import { runWithIntercept } from 'tests/cypress/support/utils/api';
import { useFixedDate } from 'tests/cypress/support/utils/date';

const fixedDateForTests = new Date('2022-01-17T12:35:00+0200');

beforeEach(() => {
  useFixedDate(fixedDateForTests);
  runWithIntercept(
    APIEndpoints.meetingDates,
    { fixture: 'meeting_dates.json' },
    () => cy.openMeetingDatesPage()
  );
});

describe('ClerkHomePage', () => {
  it('should display correct number of meeting dates in its header', () => {
    onMeetingDatesPage.expectTotalMeetingDatesCount(7);
  });
});
