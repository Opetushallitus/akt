package fi.oph.akt.service;

import fi.oph.akt.api.dto.LanguagePairsDictDTO;
import fi.oph.akt.api.dto.clerk.AuthorisationTermDTO;
import fi.oph.akt.api.dto.clerk.ClerkLanguagePairDTO;
import fi.oph.akt.api.dto.clerk.ClerkTranslatorAuthorisationDTO;
import fi.oph.akt.api.dto.clerk.ClerkTranslatorContactDetailsDTO;
import fi.oph.akt.api.dto.clerk.ClerkTranslatorDTO;
import fi.oph.akt.api.dto.clerk.ClerkTranslatorResponseDTO;
import fi.oph.akt.api.dto.clerk.MeetingDateDTO;
import fi.oph.akt.model.Translator;
import fi.oph.akt.repository.AuthorisationLanguagePairProjection;
import fi.oph.akt.repository.AuthorisationMeetingDateProjection;
import fi.oph.akt.repository.AuthorisationRepository;
import fi.oph.akt.repository.AuthorisationTermProjection;
import fi.oph.akt.repository.AuthorisationTermRepository;
import fi.oph.akt.repository.LanguagePairRepository;
import fi.oph.akt.repository.MeetingDateRepository;
import fi.oph.akt.repository.TranslatorAuthorisationProjection;
import fi.oph.akt.repository.TranslatorRepository;
import fi.oph.akt.util.AuthorisationTermProjectionComparator;
import fi.oph.akt.util.MeetingDateProjectionComparator;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StopWatch;

import javax.annotation.Resource;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClerkTranslatorService {

	private static final Logger LOG = LoggerFactory.getLogger(ClerkTranslatorService.class);

	private static final AuthorisationTermProjectionComparator authorisationTermProjectionComparator = new AuthorisationTermProjectionComparator();

	private static final MeetingDateProjectionComparator meetingDateProjectionComparator = new MeetingDateProjectionComparator();

	@Resource
	private final AuthorisationRepository authorisationRepository;

	@Resource
	private final AuthorisationTermRepository authorisationTermRepository;

	@Resource
	private final LanguagePairRepository languagePairRepository;

	@Resource
	private final MeetingDateRepository meetingDateRepository;

	@Resource
	private final TranslatorRepository translatorRepository;

	@Transactional(readOnly = true)
	public ClerkTranslatorResponseDTO listTranslators() {
		final StopWatch st = new StopWatch();

		st.start("translatorRepository.findAll");
		final List<Translator> translators = translatorRepository.findAll();
		st.stop();

		st.start("getTranslatorAuthorisationProjections");
		final Map<Long, List<TranslatorAuthorisationProjection>> translatorAuthProjections = getTranslatorAuthorisationProjections();
		st.stop();

		st.start("getAuthorisationLanguagePairProjections");
		final Map<Long, List<AuthorisationLanguagePairProjection>> authLanguagePairProjections = getAuthorisationLanguagePairProjections();
		st.stop();

		st.start("getAuthorisationTermProjections");
		final Map<Long, List<AuthorisationTermProjection>> authTermProjections = getAuthorisationTermProjections();
		st.stop();

		st.start("getAuthorisationMeetingDates");
		final Map<Long, LocalDate> authMeetingDates = getAuthorisationMeetingDates();
		st.stop();

		st.start("createClerkTranslatorDTOs");
		final List<ClerkTranslatorDTO> clerkTranslatorDTOS = createClerkTranslatorDTOs(translators,
				translatorAuthProjections, authLanguagePairProjections, authTermProjections, authMeetingDates);
		st.stop();

		st.start("getLanguagePairsDictDTO");
		final LanguagePairsDictDTO languagePairsDictDTO = getLanguagePairsDictDTO();
		st.stop();

		st.start("getDistinctTowns");
		final List<String> towns = getDistinctTowns(translators);
		st.stop();

		st.start("getMeetingDateDTOs");
		final List<MeetingDateDTO> meetingDateDTOS = getMeetingDateDTOs();
		st.stop();

		LOG.info(st.prettyPrint());

		// @formatter:off
		return ClerkTranslatorResponseDTO.builder()
				.translators(clerkTranslatorDTOS)
				.langs(languagePairsDictDTO)
				.towns(towns)
				.meetingDates(meetingDateDTOS)
				.build();
		// @formatter:on
	}

	private Map<Long, List<TranslatorAuthorisationProjection>> getTranslatorAuthorisationProjections() {
		return authorisationRepository.listTranslatorAuthorisationProjections().stream()
				.collect(Collectors.groupingBy(TranslatorAuthorisationProjection::translatorId));
	}

	private Map<Long, List<AuthorisationLanguagePairProjection>> getAuthorisationLanguagePairProjections() {
		return languagePairRepository.listAuthorisationLanguagePairProjections().stream()
				.collect(Collectors.groupingBy(AuthorisationLanguagePairProjection::authorisationId));
	}

	private Map<Long, List<AuthorisationTermProjection>> getAuthorisationTermProjections() {
		return authorisationTermRepository.listAuthorisationTermProjections().stream()
				.collect(Collectors.groupingBy(AuthorisationTermProjection::authorisationId));
	}

	private Map<Long, LocalDate> getAuthorisationMeetingDates() {
		return meetingDateRepository.listAuthorisationMeetingDateProjections().stream().collect(Collectors
				.toMap(AuthorisationMeetingDateProjection::authorisationId, AuthorisationMeetingDateProjection::date));
	}

	private List<ClerkTranslatorDTO> createClerkTranslatorDTOs(final List<Translator> translators,
			final Map<Long, List<TranslatorAuthorisationProjection>> translatorAuthProjections,
			final Map<Long, List<AuthorisationLanguagePairProjection>> languagePairProjections,
			final Map<Long, List<AuthorisationTermProjection>> termProjections,
			final Map<Long, LocalDate> meetingDates) {

		return translators.stream().map(translator -> {
			final List<TranslatorAuthorisationProjection> authProjections = translatorAuthProjections
					.get(translator.getId());

			final ClerkTranslatorContactDetailsDTO contactDetailsDTO = getContactDetailsDTO(translator);

			final List<ClerkTranslatorAuthorisationDTO> authorisationDTOS = getAuthorisationDTOs(authProjections,
					languagePairProjections, termProjections, meetingDates);

			// @formatter:off
			return ClerkTranslatorDTO.builder()
					.id(translator.getId())
					.contactDetails(contactDetailsDTO)
					.authorisations(authorisationDTOS)
					.build();
			// @formatter:on
		}).toList();
	}

	private ClerkTranslatorContactDetailsDTO getContactDetailsDTO(final Translator translator) {
		// @formatter:off
		return ClerkTranslatorContactDetailsDTO.builder()
				.firstName(translator.getFirstName())
				.lastName(translator.getLastName())
				.email(translator.getEmail())
				.phoneNumber(translator.getPhone())
				.identityNumber(translator.getIdentityNumber())
				.street(translator.getStreet())
				.postalCode(translator.getPostalCode())
				.town(translator.getTown())
				.country(translator.getCountry())
				.build();
		// @formatter:on
	}

	private List<ClerkTranslatorAuthorisationDTO> getAuthorisationDTOs(
			final List<TranslatorAuthorisationProjection> authProjections,
			final Map<Long, List<AuthorisationLanguagePairProjection>> languagePairProjections,
			final Map<Long, List<AuthorisationTermProjection>> termProjections,
			final Map<Long, LocalDate> meetingDates) {

		return authProjections.stream().map(authProjection -> {
			// @formatter:off
			long authorisationId = authProjection.authorisationId();

			final LocalDate meetingDate = meetingDates.get(authorisationId);

			List<AuthorisationTermDTO> termDTOS = null;
			final List<AuthorisationTermProjection> termProjectionsByAuthorisation = termProjections
					.getOrDefault(authorisationId, null);

			if (termProjectionsByAuthorisation != null) {
				termDTOS = termProjectionsByAuthorisation.stream()
						.sorted(authorisationTermProjectionComparator.reversed())
						.map(tp -> AuthorisationTermDTO.builder()
								.beginDate(tp.beginDate())
								.endDate(tp.endDate())
								.build()
						)
						.toList();
			}

			final List<ClerkLanguagePairDTO> languagePairDTOS = languagePairProjections.get(authorisationId)
					.stream()
					.map(lpp -> ClerkLanguagePairDTO.builder()
							.from(lpp.fromLang())
							.to(lpp.toLang())
							.permissionToPublish(lpp.permissionToPublish())
							.build()
					)
					.toList();

			return ClerkTranslatorAuthorisationDTO.builder()
					.basis(authProjection.authorisationBasis())
					.autDate(authProjection.autDate())
					.kktCheck(authProjection.kktCheck())
					.virDate(authProjection.virDate())
					.assuranceDate(authProjection.assuranceDate())
					.meetingDate(meetingDate)
					.terms(termDTOS)
					.languagePairs(languagePairDTOS)
					.build();
			// @formatter:on
		}).toList();
	}

	private LanguagePairsDictDTO getLanguagePairsDictDTO() {
		final List<String> fromLangs = languagePairRepository.getDistinctFromLangs();
		final List<String> toLangs = languagePairRepository.getDistinctToLangs();

		return LanguagePairsDictDTO.builder().from(fromLangs).to(toLangs).build();
	}

	private List<String> getDistinctTowns(final Collection<Translator> translators) {
		return translators.stream().map(Translator::getTown).filter(Objects::nonNull).distinct().sorted().toList();
	}

	private List<MeetingDateDTO> getMeetingDateDTOs() {
		return meetingDateRepository.listMeetingDateProjections().stream()
				.sorted(meetingDateProjectionComparator.reversed())
				.map(mdp -> MeetingDateDTO.builder().id(mdp.meetingDateId()).date(mdp.date()).build()).toList();
	}

}
