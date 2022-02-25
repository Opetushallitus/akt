class MeetingDatesPage {
  elements = {
    registryHeading: () => cy.findByTestId('meeting-dates-page__heading'),
  };

  expectTotalMeetingDatesCount(count: number) {
    this.elements
      .registryHeading()
      .should('contain.text', `Kokouspäivät(${count})`);
  }
}

export const onMeetingDatesPage = new MeetingDatesPage();
