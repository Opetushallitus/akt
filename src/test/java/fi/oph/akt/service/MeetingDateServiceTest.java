package fi.oph.akt.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;

import fi.oph.akt.Factory;
import fi.oph.akt.api.dto.clerk.MeetingDateDTO;
import fi.oph.akt.api.dto.clerk.modify.MeetingDateCreateDTO;
import fi.oph.akt.api.dto.clerk.modify.MeetingDateUpdateDTO;
import fi.oph.akt.audit.AktOperation;
import fi.oph.akt.audit.AuditService;
import fi.oph.akt.model.Authorisation;
import fi.oph.akt.model.AuthorisationTerm;
import fi.oph.akt.model.MeetingDate;
import fi.oph.akt.model.Translator;
import fi.oph.akt.repository.MeetingDateRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import javax.annotation.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;

@WithMockUser
@DataJpaTest
class MeetingDateServiceTest {

  private MeetingDateService meetingDateService;

  @Resource
  private MeetingDateRepository meetingDateRepository;

  @MockBean
  private AuditService auditService;

  @Resource
  private TestEntityManager entityManager;

  @BeforeEach
  public void setup() {
    meetingDateService = new MeetingDateService(meetingDateRepository, auditService);
  }

  @Test
  public void testMeetingDateCreate() {
    final MeetingDateCreateDTO dto = MeetingDateCreateDTO.builder().date(LocalDate.now()).build();

    final MeetingDateDTO response = meetingDateService.createMeetingDate(dto);

    assertEquals(dto.date(), response.date());

    final List<MeetingDate> allMeetingDates = meetingDateRepository.findAll();
    assertEquals(1, allMeetingDates.size());
    assertEquals(response.id(), allMeetingDates.get(0).getId());
    assertEquals(response.date(), allMeetingDates.get(0).getDate());

    verify(auditService).logById(AktOperation.CREATE_MEETING_DATE, response.id());
    verifyNoMoreInteractions(auditService);
  }

  @Test
  public void testMeetingDateUpdate() {
    final MeetingDate meetingDate = Factory.meetingDate();

    entityManager.persist(meetingDate);

    final MeetingDateUpdateDTO updateDTO = MeetingDateUpdateDTO
      .builder()
      .id(meetingDate.getId())
      .version(meetingDate.getVersion())
      .date(meetingDate.getDate().plusDays(1))
      .build();

    final MeetingDateDTO response = meetingDateService.updateMeetingDate(updateDTO);

    assertEquals(updateDTO.id(), response.id());
    assertEquals(updateDTO.version() + 1, response.version());
    assertEquals(updateDTO.date(), response.date());

    verify(auditService).logById(AktOperation.UPDATE_MEETING_DATE, response.id());
    verifyNoMoreInteractions(auditService);
  }

  @Test
  public void testMeetingDateDelete() {
    final MeetingDate meetingDate = Factory.meetingDate(LocalDate.now());
    final MeetingDate meetingDate2 = Factory.meetingDate(LocalDate.now().plusDays(1));

    entityManager.persist(meetingDate);
    entityManager.persist(meetingDate2);

    final long id = meetingDate.getId();
    meetingDateService.deleteMeetingDate(id);

    assertEquals(
      Set.of(meetingDate2.getId()),
      meetingDateRepository.findAll().stream().map(MeetingDate::getId).collect(Collectors.toSet())
    );

    verify(auditService).logById(AktOperation.DELETE_MEETING_DATE, id);
    verifyNoMoreInteractions(auditService);
  }

  @Test
  public void testMeetingDateDeleteFailsWhenMeetingDateHasAuthorisations() {
    final MeetingDate meetingDate = Factory.meetingDate();
    final Translator translator = Factory.translator();
    final Authorisation authorisation = Factory.authorisation(translator, meetingDate);
    final AuthorisationTerm authorisationTerm = Factory.authorisationTerm(authorisation);

    entityManager.persist(meetingDate);
    entityManager.persist(translator);
    entityManager.persist(authorisation);
    entityManager.persist(authorisationTerm);

    final RuntimeException ex = assertThrows(
      RuntimeException.class,
      () -> meetingDateService.deleteMeetingDate(meetingDate.getId())
    );
    assertEquals("Can not delete meeting date which has authorisations", ex.getMessage());

    verifyNoInteractions(auditService);
  }

  @Test
  public void testMeetingDateUpdateFailsWhenMeetingDateHasAuthorisations() {
    final MeetingDate meetingDate = Factory.meetingDate();
    final Translator translator = Factory.translator();
    final Authorisation authorisation = Factory.authorisation(translator, meetingDate);
    final AuthorisationTerm authorisationTerm = Factory.authorisationTerm(authorisation);

    entityManager.persist(meetingDate);
    entityManager.persist(translator);
    entityManager.persist(authorisation);
    entityManager.persist(authorisationTerm);

    final MeetingDateUpdateDTO updateDTO = MeetingDateUpdateDTO
      .builder()
      .id(meetingDate.getId())
      .version(meetingDate.getVersion())
      .date(meetingDate.getDate().plusDays(1))
      .build();

    final RuntimeException ex = assertThrows(
      RuntimeException.class,
      () -> meetingDateService.updateMeetingDate(updateDTO)
    );
    assertEquals("Can not update meeting date which has authorisations", ex.getMessage());

    verifyNoInteractions(auditService);
  }
}
