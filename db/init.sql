TRUNCATE translator CASCADE;
TRUNCATE meeting_date CASCADE;

INSERT INTO meeting_date(date)
VALUES ('2021-12-24');

WITH first_names AS (SELECT first_name
                     FROM (VALUES ('Juha'),
                                  ('Maria'),
                                  ('Timo'),
                                  ('Helena'),
                                  ('Matti'),
                                  ('Anneli'),
                                  ('Kari'),
                                  ('Johanna'),
                                  ('Mikko'),
                                  ('Kaarina'),
                                  ('Jari'),
                                  ('Hannele'),
                                  ('Antti'),
                                  ('Marjatta'),
                                  ('Jukka'),
                                  ('Kristiina'),
                                  ('Mika'),
                                  ('Emilia'),
                                  ('Markku'),
                                  ('Liisa')) AS f(first_name)),
     last_names AS (SELECT last_name
                    FROM (VALUES ('Korhonen'),
                                 ('Virtanen'),
                                 ('Mäkinen'),
                                 ('Nieminen'),
                                 ('Mäkelä'),
                                 ('Hämäläinen'),
                                 ('Laine'),
                                 ('Heikkinen'),
                                 ('Koskinen'),
                                 ('Järvinen'),
                                 ('Lehtonen'),
                                 ('Lehtinen'),
                                 ('Saarinen'),
                                 ('Salminen'),
                                 ('Heinonen'),
                                 ('Niemi'),
                                 ('Heikkilä'),
                                 ('Kinnunen'),
                                 ('Salonen'),
                                 ('Turunen'),
                                 ('Salo'),
                                 ('Laitinen'),
                                 ('Tuominen'),
                                 ('Rantanen'),
                                 ('Karjalainen'),
                                 ('Jokinen'),
                                 ('Mattila'),
                                 ('Savolainen'),
                                 ('Lahtinen'),
                                 ('Ahonen'),
                                 ('Ojala'),
                                 ('Leppänen'),
                                 ('Kallio'),
                                 ('Leinonen'),
                                 ('Väisänen'),
                                 ('Hiltunen'),
                                 ('Miettinen'),
                                 ('Pitkänen'),
                                 ('Aaltonen'),
                                 ('Manninen'),
                                 ('Koivisto'),
                                 ('Hakala'),
                                 ('Anttila'),
                                 ('Laaksonen'),
                                 ('Hirvonen'),
                                 ('Lehto'),
                                 ('Räsänen'),
                                 ('Laakso'),
                                 ('Toivonen'),
                                 ('Rantala')) AS ln(last_name))
INSERT
INTO translator(onr_oid) (SELECT ln.last_name || ', ' || fn.first_name || ' ' || fn2.first_name AS firstName
                          FROM last_names ln
                                   CROSS JOIN first_names fn
                                   CROSS JOIN first_names fn2
                          WHERE fn.first_name <> fn2.first_name
                          ORDER BY md5(ln.last_name || fn.first_name || fn2.first_name)) LIMIT 4000;

INSERT INTO authorisation(translator_id, basis, meeting_date_id, vir_date, assurance_date) (
    SELECT translator_id, 'VIR', (SELECT max(meeting_date_id) FROM meeting_date), now(), now() FROM translator
);
INSERT INTO authorisation_term(authorisation_id, begin_date, end_date) (
    SELECT authorisation_id, '2021-01-01', '2025-12-31'
    FROM authorisation
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish)(
    SELECT authorisation_id, 'fi', 'sv', true
    FROM authorisation
);
INSERT INTO language_pair(authorisation_id, from_lang, to_lang, permission_to_publish)(
    SELECT authorisation_id, 'fi', 'en', false
    FROM authorisation
);