TRUNCATE translator CASCADE;
TRUNCATE meeting_date CASCADE;

INSERT INTO meeting_date(date) VALUES ('2020-10-03');
INSERT INTO meeting_date(date) VALUES ('2021-04-09');
INSERT INTO meeting_date(date) VALUES ('2021-12-20');
INSERT INTO meeting_date(date) VALUES ('2022-02-15');
INSERT INTO meeting_date(date) VALUES ('2022-08-30');
INSERT INTO meeting_date(date) VALUES ('2022-11-01');
INSERT INTO meeting_date(date) VALUES ('2025-01-01');

INSERT INTO translator(identity_number, first_name, last_name, email, phone_number, street, town, postal_code, country)
SELECT 'id' || i::text,
       first_names[mod(i, array_length(first_names, 1)) + 1],
       last_names[mod(i, array_length(last_names, 1)) + 1],
       CASE mod(i, 11) WHEN 0 THEN null ELSE ('translator' || i::text || '@example.invalid') END,
       '+35840' || (1000000 + i)::text,
       CASE mod(i, 7)
           WHEN 0 THEN initcap(reverse(street[mod(i, array_length(street, 1)) + 1]))
           ELSE street[mod(i, array_length(street, 1)) + 1] END,
       CASE mod(i, 7)
           WHEN 0 THEN initcap(reverse(town[mod(i, array_length(town, 1)) + 1]))
           ELSE town[mod(i, array_length(town, 1)) + 1] END,
       postal_code[mod(i, array_length(postal_code, 1)) + 1],
       CASE mod(i, 7)
           WHEN 0 THEN 'Latvia'
           ELSE country[mod(i, array_length(country, 1)) + 1] END
FROM generate_series(1, 4900) AS i,
     (SELECT ('{"Antti", "Eero", "Ilkka", "Jari", "Juha", "Matti", "Pekka", "Timo", "Iiro", "Jukka", "Kalle", ' ||
              '"Kari", "Marko", "Mikko", "Tapani", "Ville","Anneli", "Ella", "Hanna", "Iiris", "Liisa", ' ||
              '"Maria", "Ninni", "Viivi", "Anna", "Iida", "Kerttu", "Kristiina", "Marjatta", "Ronja", ' ||
              '"Sara"}')::text[] AS first_names) AS first_name_table,
     (SELECT ('{"Aaltonen", "Alanen", "Eskola", "Hakala", "Heikkinen", "Heinonen", "Hiltunen", "Hirvonen", ' ||
              '"Hämäläinen", "Kallio", "Karjalainen", "Kinnunen", "Korhonen", "Koskinen", "Laakso", ' ||
              '"Lahtinen", "Laine", "Lehtonen", "Leinonen", "Leppänen", "Manninen", "Mattila", "Mäkinen", ' ||
              '"Nieminen", "Noronen", "Ojala", "Paavola", "Pitkänen", "Räsänen", "Saarinen", "Salo", ' ||
              '"Salonen", "Toivonen", "Tuominen", "Turunen", "Valtonen", "Virtanen", ' ||
              '"Väisänen"}')::text[] AS last_names) AS last_name_table,
     (SELECT ('{"Malminkatu 1", "Runebergintie 2", "Sibeliuksenkuja 3", "Veturitie 4", ' ||
              '"Pirkkolantie 123"}')::text[] AS street) AS street_table,
     (SELECT ('{"Helsinki", "Turku", "Hämeenlinna", "Kuopio", "Lahti", "Porvoo", "Vantaa", "Järvenpää", ' ||
              '"Kouvola", "Tampere", "Oulu", "Rovaniemi", "Kajaani", "Joensuu", "Uusikaupunki", "Kuopio", ' ||
              '"Kotka"}')::text[] AS town) AS town_table,
     (SELECT ('{"00100", "01200", "06100", "13500", "31600", "48600", ' ||
              '"54460"}')::text[] AS postal_code) AS postal_code_table,
     (SELECT ('{"Suomi", "suomi", "SUOMI", "Finland", "", NULL}')::text[] AS country) AS country_table;

INSERT INTO authorisation(translator_id, basis, meeting_date_id, aut_date, kkt_check, vir_date, assurance_date) (
    SELECT translator_id,
           -- 11 KKT
           -- 13 VIR authorized
           -- 17 VIR not authorized
           -- else AUT
           CASE
               WHEN mod(translator_id, 11) = 0 THEN 'KKT'
               WHEN mod(translator_id, 13) = 0 THEN 'VIR'
               WHEN mod(translator_id, 17) = 0 THEN 'VIR'
               ELSE 'AUT' END,
           CASE
               WHEN mod(translator_id, 11) = 0 THEN (SELECT meeting_date_id FROM meeting_date WHERE date = '2020-10-03')
               WHEN mod(translator_id, 13) = 0 THEN (SELECT meeting_date_id FROM meeting_date WHERE date = '2021-04-09')
               WHEN mod(translator_id, 17) = 0 THEN NULL
               ELSE (SELECT meeting_date_id FROM meeting_date WHERE date = '2021-12-20') END,
           CASE
               WHEN mod(translator_id, 11) = 0 THEN NULL
               WHEN mod(translator_id, 13) = 0 THEN NULL
               WHEN mod(translator_id, 17) = 0 THEN NULL
               ELSE now() END,
           CASE
               WHEN mod(translator_id, 11) = 0 THEN 'ToDo'
               WHEN mod(translator_id, 13) = 0 THEN NULL
               WHEN mod(translator_id, 17) = 0 THEN NULL
               ELSE NULL END,
           CASE
               WHEN mod(translator_id, 11) = 0 THEN NULL
               WHEN mod(translator_id, 13) = 0 THEN now()
               WHEN mod(translator_id, 17) = 0 THEN now()
               ELSE NULL END,
           CASE
               WHEN mod(translator_id, 11) = 0 THEN now()
               WHEN mod(translator_id, 13) = 0 THEN now()
               WHEN mod(translator_id, 17) = 0 THEN NULL
               ELSE now() END
    FROM translator
);

INSERT INTO authorisation_term(authorisation_id, begin_date, end_date) (
    SELECT authorisation_id,
           -- NOTE mod 87 is expired term, its needed also to set town to null
           (CASE WHEN mod(translator_id, 87) = 0 THEN '2019-01-01' ELSE '2022-01-01' END)::date,
           -- VIR never expires
           (CASE
                WHEN basis <> 'VIR' THEN CASE
                                             WHEN mod(translator_id, 87) = 0 THEN '2021-12-31'
                                             ELSE '2022-01-15'::date +
                                                  (mod(translator_id, 365 * 5)::text || ' days')::interval END
               END)::date
    FROM authorisation
    WHERE meeting_date_id IS NOT NULL
);

-- set some translator fields to null
UPDATE translator
SET identity_number=NULL
WHERE mod(translator_id, 50) = 0;

UPDATE translator
SET email=NULL
WHERE mod(translator_id, 51) = 0;

UPDATE translator
SET phone_number=NULL
WHERE mod(translator_id, 52) = 0;

UPDATE translator
SET street=NULL
WHERE mod(translator_id, 53) = 0;

-- NOTE mod 87 has expired term, but VIR never expires
UPDATE translator
SET town=NULL
WHERE translator_id IN (SELECT t.translator_id
                        FROM translator t
                                 JOIN authorisation a on t.translator_id = a.translator_id
                        WHERE mod(t.translator_id, 87) = 0
                          and basis <> 'VIR');

UPDATE translator
SET postal_code=NULL
WHERE mod(translator_id, 55) = 0;

-- fi <-> sv
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'FI', 'SV', true
    FROM authorisation
    where authorisation.authorisation_id % 2 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'SV', 'FI', true
    FROM authorisation
    where authorisation.authorisation_id % 3 = 0
);
-- fi <-> ru
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'FI', 'RU', true
    FROM authorisation
    where authorisation.authorisation_id % 5 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'RU', 'FI', true
    FROM authorisation
    where authorisation.authorisation_id % 5 = 0
);
-- fi <-> et
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'FI', 'ET', true
    FROM authorisation
    where authorisation.authorisation_id % 7 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'ET', 'FI', true
    FROM authorisation
    where authorisation.authorisation_id % 11 = 0
);
-- fi <-> de
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'FI', 'DE', true
    FROM authorisation
    where authorisation.authorisation_id % 11 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'DE', 'FI', true
    FROM authorisation
    where authorisation.authorisation_id % 13 = 0
);
-- fi <-> fr
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'FI', 'FR', true
    FROM authorisation
    where authorisation.authorisation_id % 17 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'FR', 'FI', true
    FROM authorisation
    where authorisation.authorisation_id % 17 = 0
);
-- sv <-> fr
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'SV', 'FR', true
    FROM authorisation
    where authorisation.authorisation_id % 19 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'FR', 'SV', true
    FROM authorisation
    where authorisation.authorisation_id % 19 = 0
);
-- misc languages
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'BN', 'FI', true
    FROM authorisation
    where authorisation.authorisation_id % 393 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'BO', 'SV', true
    FROM authorisation
    where authorisation.authorisation_id % 393 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'FI', 'CS', true
    FROM authorisation
    where authorisation.authorisation_id % 397 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'SV', 'CA', true
    FROM authorisation
    where authorisation.authorisation_id % 397 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'DA', 'FI', true
    FROM authorisation
    where authorisation.authorisation_id % 399 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'EL', 'SV', true
    FROM authorisation
    where authorisation.authorisation_id % 399 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'FI', 'FO', true
    FROM authorisation
    where authorisation.authorisation_id % 399 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'SV', 'FJ', true
    FROM authorisation
    where authorisation.authorisation_id % 399 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'GA', 'FI', true
    FROM authorisation
    where authorisation.authorisation_id % 401 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'HE', 'SV', true
    FROM authorisation
    where authorisation.authorisation_id % 401 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'FI', 'HU', true
    FROM authorisation
    where authorisation.authorisation_id % 601 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'SV', 'HR', true
    FROM authorisation
    where authorisation.authorisation_id % 601 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'TT', 'FI', true
    FROM authorisation
    where authorisation.authorisation_id % 607 = 0
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'TY', 'SV', true
    FROM authorisation
    where authorisation.authorisation_id % 607 = 0
);

-- en - not published
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish) (
    SELECT authorisation_id, 'FI', 'EN', false
    FROM authorisation
);
