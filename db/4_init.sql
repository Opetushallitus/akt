TRUNCATE translator CASCADE;
TRUNCATE meeting_date CASCADE;

INSERT INTO meeting_date(date)
    VALUES ('2020-12-24');

INSERT INTO translator(onr_oid)
    SELECT concat('1.2.246.562.24', '.', power(10, 10) + floor(9 * power(10, 10) * random()))
    FROM generate_series(1, 4900);

INSERT INTO authorisation(translator_id, basis, meeting_date_id, aut_date, assurance_date) (
    SELECT translator_id, 'AUT', (SELECT max(meeting_date_id) FROM meeting_date), now(), now()
    FROM translator
);

INSERT INTO authorisation_term(authorisation_id, begin_date, end_date) (
    SELECT authorisation_id, '2021-01-01', '2025-12-31'
    FROM authorisation
);
-- fi <-> sv
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'fi', 'sv', true
    FROM authorisation where authorisation.authorisation_id % 2 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'sv', 'fi', true
    FROM authorisation where authorisation.authorisation_id % 3 = 0
);
-- fi <-> ru
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'fi', 'ru', true
    FROM authorisation where authorisation.authorisation_id % 5 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'ru', 'fi', true
    FROM authorisation where authorisation.authorisation_id % 5 = 0
);
-- fi <-> et
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'fi', 'et', true
    FROM authorisation where authorisation.authorisation_id % 7 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'et', 'fi', true
    FROM authorisation where authorisation.authorisation_id % 11 = 0
);
-- fi <-> de
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'fi', 'de', true
    FROM authorisation where authorisation.authorisation_id % 11 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'de', 'fi', true
    FROM authorisation where authorisation.authorisation_id % 13 = 0
);
-- fi <-> fr
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'fi', 'fr', true
    FROM authorisation where authorisation.authorisation_id % 17 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'fr', 'fi', true
    FROM authorisation where authorisation.authorisation_id % 17 = 0
);
-- sv <-> fr
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'sv', 'fr', true
    FROM authorisation where authorisation.authorisation_id % 19 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'fr', 'sv', true
    FROM authorisation where authorisation.authorisation_id % 19 = 0
);
-- misc languages
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'bn', 'bo', true
    FROM authorisation where authorisation.authorisation_id % 393 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'ca', 'cs', true
    FROM authorisation where authorisation.authorisation_id % 397 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'da', 'el', true
    FROM authorisation where authorisation.authorisation_id % 399 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'fj', 'fo', true
    FROM authorisation where authorisation.authorisation_id % 399 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'ga', 'he', true
    FROM authorisation where authorisation.authorisation_id % 401 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'hr', 'hu', true
    FROM authorisation where authorisation.authorisation_id % 601 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'tt', 'ty', true
    FROM authorisation where authorisation.authorisation_id % 607 = 0
);

-- en - not published
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'fi', 'en', false
    FROM authorisation
);
