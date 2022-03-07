TRUNCATE translator CASCADE;
TRUNCATE meeting_date CASCADE;
TRUNCATE email CASCADE;

INSERT INTO meeting_date(date)
VALUES ('2020-10-03');
INSERT INTO meeting_date(date)
VALUES ('2021-04-09');
INSERT INTO meeting_date(date)
VALUES ('2021-12-20');
INSERT INTO meeting_date(date)
VALUES ('2022-02-15');
INSERT INTO meeting_date(date)
VALUES ('2022-08-30');
INSERT INTO meeting_date(date)
VALUES ('2022-11-01');
INSERT INTO meeting_date(date)
VALUES ('2025-01-01');

INSERT INTO translator(identity_number, first_name, last_name, email, phone_number, street, town, postal_code, country, extra_information)
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
           ELSE country[mod(i, array_length(country, 1)) + 1] END,
       extra_information[mod(i, array_length(extra_information, 1)) + 1]
FROM generate_series(1, 4900) AS i,
     (SELECT ('{Antti, Eero, Ilkka, Jari, Juha, Matti, Pekka, Timo, Iiro, Jukka, Kalle, ' ||
              'Kari, Marko, Mikko, Tapani, Ville, Anneli, Ella, Hanna, Iiris, Liisa, ' ||
              'Maria, Ninni, Viivi, Anna, Iida, Kerttu, Kristiina, Marjatta, Ronja, ' ||
              'Sara}')::text[] AS first_names) AS first_name_table,
     (SELECT ('{Aaltonen, Alanen, Eskola, Hakala, Heikkinen, Heinonen, Hiltunen, Hirvonen, ' ||
              'Hämäläinen, Kallio, Karjalainen, Kinnunen, Korhonen, Koskinen, Laakso, ' ||
              'Lahtinen, Laine, Lehtonen, Leinonen, Leppänen, Manninen, Mattila, Mäkinen, ' ||
              'Nieminen, Noronen, Ojala, Paavola, Pitkänen, Räsänen, Saarinen, Salo, ' ||
              'Salonen, Toivonen, Tuominen, Turunen, Valtonen, Virtanen, ' ||
              'Väisänen}')::text[] AS last_names) AS last_name_table,
     (SELECT ('{Malminkatu 1, Runebergintie 2, Sibeliuksenkuja 3, Veturitie 4, ' ||
              'Pirkkolantie 123}')::text[] AS street) AS street_table,
     (SELECT ('{Helsinki, Turku, Hämeenlinna, Kuopio, Lahti, Porvoo, Vantaa, Järvenpää, ' ||
              'Kouvola, Tampere, Oulu, Rovaniemi, Kajaani, Joensuu, Uusikaupunki, Kuopio, ' ||
              'Kotka}')::text[] AS town) AS town_table,
     (SELECT ('{00100, 01200, 06100, 13500, 31600, 48600, ' ||
              '54460}')::text[] AS postal_code) AS postal_code_table,
     (SELECT ('{Suomi, suomi, SUOMI, Finland, NULL}')::text[] AS country) AS country_table,
     (SELECT ('{Osoitetiedot päivitetty 1.1.1970., ' ||
              'Kääntäjän nimeä muutettu. Vanhassa nimessä oli typo., ' ||
              'Osoitetietoja muokattu 1.5.1999. Osoitetietoja muutettu uudelleen 2.5.1999. Uusi auktorisointi lisätty kääntäjälle 12.10.2000. Auktorisointi päivitetty julkiseksi 1.1.2001. Viimeisen muutoksen tekijä: Testi Testinen, ' ||
              'Lorem ipsum dolor sit amet consectetur adipiscing elit. Ut vehicula sem nulla eu placerat libero dapibus eget. Ut ac pretium velit ac hendrerit eros. Nullam in tortor in augue dignissim vehicula. Nulla ac cursus ligula. Nulla ut magna dapibus egestas tortor eget consequat augue. Pellentesque tempor sapien ut orci commodo et commodo mi condimentum. Aliquam lacinia commodo elit id bibendum quam condimentum suscipit. Phasellus nibh turpis laoreet non gravida sed gravida ac magna. Nulla ut lectus augue. Curabitur finibus laoreet ullamcorper. Nullam id dapibus ex et fermentum nulla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas varius lectus id felis mattis ac sodales purus posuere. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed a pharetra massa., ' ||
              'NULL}')::text[] AS extra_information) AS extra_information_table;

-- insert authorisations for translators, for some we add multiple authorisations
WITH translator_ids AS (
    SELECT translator_id, translator_id AS i
    FROM translator
    UNION ALL
    SELECT translator_id, translator_id + 1 AS i
    FROM translator
    WHERE mod(translator_id, 13) = 0
    UNION ALL
    SELECT translator_id, translator_id + 2 AS i
    FROM translator
    WHERE mod(translator_id, 15) = 0
    UNION ALL
    SELECT translator_id, translator_id + 3 AS i
    FROM translator
    WHERE mod(translator_id, 17) = 0
    UNION ALL
    SELECT translator_id, translator_id + 4 AS i
    FROM translator
    WHERE mod(translator_id, 19) = 0
    UNION ALL
    SELECT translator_id, translator_id + 5 AS i
    FROM translator
    WHERE mod(translator_id, 20) = 0
    UNION ALL
    SELECT translator_id, translator_id + 6 AS i
    FROM translator
    WHERE mod(translator_id, 21) = 0
    UNION ALL
    SELECT translator_id, translator_id + 7 AS i
    FROM translator
    WHERE mod(translator_id, 22) = 0
    UNION ALL
    SELECT translator_id, translator_id + 8 AS i
    FROM translator
    WHERE mod(translator_id, 23) = 0
    UNION ALL
    SELECT translator_id, translator_id + 9 AS i
    FROM translator
    WHERE mod(translator_id, 24) = 0
)
INSERT
INTO authorisation(translator_id, basis, meeting_date_id, aut_date, from_lang, to_lang, permission_to_publish)
SELECT translator_id,
       -- 11 KKT
       -- 13 VIR authorized
       -- 17 VIR not authorized
       -- else AUT
       CASE
           WHEN mod(i, 11) = 0 THEN 'KKT'
           WHEN mod(i, 13) = 0 THEN 'VIR'
           WHEN mod(i, 17) = 0 THEN 'VIR'
           ELSE 'AUT' END,
       CASE
           WHEN mod(i, 11) = 0 THEN (SELECT meeting_date_id FROM meeting_date WHERE date = '2020-10-03')
           WHEN mod(i, 13) = 0 THEN (SELECT meeting_date_id FROM meeting_date WHERE date = '2021-04-09')
           WHEN mod(i, 17) = 0 THEN NULL
           ELSE (SELECT meeting_date_id FROM meeting_date WHERE date = '2021-12-20') END,
       CASE
           WHEN mod(i, 11) = 0 THEN NULL
           WHEN mod(i, 13) = 0 THEN NULL
           WHEN mod(i, 17) = 0 THEN NULL
           ELSE now() END,
       from_langs[mod(i, array_length(from_langs, 1)) + 1],
       to_langs[mod(i, array_length(to_langs, 1)) + 1],
       mod(i, 21) <> 0
FROM translator_ids,
     (SELECT ('{FI, SEIN, SEKO, SEPO}')::text[] AS from_langs) AS from_langs_table,
     (SELECT ('{BN, CA, CS, DA, DE, EL, EN, ET, FJ, FO, FR, GA, HE, HR, HU, JA, RU, SV, TT, TY, UG, UK, VI}')::text[] AS to_langs) AS to_langs_table
;

-- add inverse language pairs
INSERT INTO authorisation(translator_id, basis, meeting_date_id, aut_date, from_lang, to_lang, permission_to_publish)
SELECT translator_id,
       basis,
       meeting_date_id,
       aut_date,
       -- note to_lang and from_lang are swapped
       to_lang,
       from_lang,
       mod(translator_id, 98) <> 0
FROM authorisation
WHERE mod(authorisation_id, 20) <> 0
;

-- set diary numbers to match the ids of authorisations
UPDATE authorisation
SET diary_number = authorisation_id
WHERE 1 = 1;

UPDATE authorisation
SET term_begin_date = (CASE
    WHEN mod(translator_id, 87) = 0 THEN '2019-01-01'
    ELSE '2022-01-01'
    END
)::date
WHERE meeting_date_id IS NOT NULL;

UPDATE authorisation
SET term_end_date = (CASE
    WHEN basis <> 'VIR' THEN CASE
        WHEN mod(translator_id, 87) = 0 THEN '2021-12-31'
        ELSE '2022-01-15'::date + (mod(translator_id, 365 * 5)::text || ' days')::interval
        END
    END
)::date
WHERE meeting_date_id IS NOT NULL;

-- add unauthorised VIR
INSERT INTO authorisation (translator_id, basis, meeting_date_id, from_lang, to_lang, permission_to_publish, diary_number)
VALUES ((SELECT max(translator_id) FROM translator), 'VIR', null, 'SEPO', 'DE', false, 'old unauthorised VIR');

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
