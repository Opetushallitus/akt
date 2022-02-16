package fi.oph.akt.service;

import fi.oph.akt.api.dto.clerk.MeetingDateDTO;
import fi.oph.akt.api.dto.clerk.modify.MeetingDateCreateDTO;
import fi.oph.akt.api.dto.clerk.modify.MeetingDateUpdateDTO;
import fi.oph.akt.model.MeetingDate;
import fi.oph.akt.repository.MeetingDateRepository;
import fi.oph.akt.util.MeetingDateComparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MeetingDateService {

  private final MeetingDateRepository meetingDateRepository;

  private static final MeetingDateComparator meetingDateComparator = new MeetingDateComparator();

  @Transactional(readOnly = true)
  public List<MeetingDateDTO> listMeetingDates() {
    return meetingDateRepository.findAll().stream().sorted(meetingDateComparator.reversed()).map(this::toDto).toList();
  }

  @Transactional
  public MeetingDateDTO createMeetingDate(final MeetingDateCreateDTO dto) {
    final MeetingDate meetingDate = new MeetingDate();
    meetingDate.setDate(dto.date());
    meetingDateRepository.saveAndFlush(meetingDate);
    return toDto(meetingDate);
  }

  @Transactional
  public MeetingDateDTO updateMeetingDate(final MeetingDateUpdateDTO dto) {
    final MeetingDate meetingDate = meetingDateRepository.getById(dto.id());
    meetingDate.assertVersion(dto.version());

    if (!meetingDate.getAuthorisations().isEmpty()) {
      throw new RuntimeException("Can not update meeting date which has authorisations");
    }

    meetingDate.setDate(dto.date());
    meetingDateRepository.flush();
    return toDto(meetingDate);
  }

  @Transactional
  public void deleteMeetingDate(final long meetingDateId) {
    final MeetingDate meetingDate = meetingDateRepository.getById(meetingDateId);
    if (!meetingDate.getAuthorisations().isEmpty()) {
      throw new RuntimeException("Can not delete meeting date which has authorisations");
    }
    meetingDateRepository.deleteAllByIdInBatch(List.of(meetingDateId));
  }

  private MeetingDateDTO toDto(final MeetingDate meetingDate) {
    return MeetingDateDTO
      .builder()
      .id(meetingDate.getId())
      .version(meetingDate.getVersion())
      .date(meetingDate.getDate())
      .build();
  }
}
