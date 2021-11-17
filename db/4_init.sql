TRUNCATE translator CASCADE;
TRUNCATE meeting_date CASCADE;

INSERT INTO meeting_date(date)
    VALUES ('2020-12-24');

INSERT INTO translator(onr_oid)
    SELECT concat('1.2.246.562.24', '.', power(10, 10) + floor(9 * power(10, 10) * random()))
    FROM generate_series(1, 4000);

INSERT INTO authorisation(translator_id, basis, meeting_date_id, aut_date, assurance_date) (
    SELECT translator_id, 'AUT', (SELECT max(meeting_date_id) FROM meeting_date), now(), now()
    FROM translator
);

INSERT INTO authorisation_term(authorisation_id, begin_date, end_date) (
    SELECT authorisation_id, '2021-01-01', '2025-12-31'
    FROM authorisation
);

INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'fi', 'sv', true
    FROM authorisation
);

INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'fi', 'en', false
    FROM authorisation
);
