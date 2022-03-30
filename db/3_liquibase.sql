--
-- PostgreSQL database dump
--

-- Dumped from database version 12.9 (Debian 12.9-1.pgdg110+1)
-- Dumped by pg_dump version 14.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: databasechangelog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.databasechangelog (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    filename character varying(255) NOT NULL,
    dateexecuted timestamp without time zone NOT NULL,
    orderexecuted integer NOT NULL,
    exectype character varying(10) NOT NULL,
    md5sum character varying(35),
    description character varying(255),
    comments character varying(255),
    tag character varying(255),
    liquibase character varying(20),
    contexts character varying(255),
    labels character varying(255),
    deployment_id character varying(10)
);


ALTER TABLE public.databasechangelog OWNER TO postgres;

--
-- Name: databasechangeloglock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.databasechangeloglock (
    id integer NOT NULL,
    locked boolean NOT NULL,
    lockgranted timestamp without time zone,
    lockedby character varying(255)
);


ALTER TABLE public.databasechangeloglock OWNER TO postgres;

--
-- Data for Name: databasechangelog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) FROM stdin;
init-avoy-1-shedlock	init	migrations.xml	2022-03-30 14:58:21.209665	1	EXECUTED	8:8d3e6aaeff0d8838d329ebbaa95bc096	createTable tableName=shedlock		\N	4.3.5	\N	\N	8641501082
init-avoy-2-email	init	migrations.xml	2022-03-30 14:58:21.236403	2	EXECUTED	8:07d58a7024a5281f44fc27b0b1acc1b5	createTable tableName=email		\N	4.3.5	\N	\N	8641501082
init-avoy-3-email_type	init	migrations.xml	2022-03-30 14:58:21.255763	3	EXECUTED	8:d1a30f3b498ef3653dd0c13d91a8351d	createTable tableName=email_type; addForeignKeyConstraint baseTableName=email, constraintName=fk_email_email_type, referencedTableName=email_type		\N	4.3.5	\N	\N	8641501082
init-1-meeting_date	init	migrations.xml	2022-03-30 14:58:21.271745	4	EXECUTED	8:38cb174f5fb5a94de89639f7b5f0a77a	createTable tableName=meeting_date		\N	4.3.5	\N	\N	8641501082
init-2-authorisation_basis	init	migrations.xml	2022-03-30 14:58:21.289868	5	EXECUTED	8:e3237db0c80a738e470dbfd514e657e4	createTable tableName=authorisation_basis; insert tableName=authorisation_basis; insert tableName=authorisation_basis; insert tableName=authorisation_basis		\N	4.3.5	\N	\N	8641501082
init-3-translator	init-2	migrations.xml	2022-03-30 14:58:21.310943	6	EXECUTED	8:ec435ccb6ba917a2072656cada3fed22	createTable tableName=translator		\N	4.3.5	\N	\N	8641501082
init-4-authorisation	init	migrations.xml	2022-03-30 14:58:21.351041	7	EXECUTED	8:73ea07a0604c368d0a2bcd8eee2053eb	createTable tableName=authorisation; addForeignKeyConstraint baseTableName=authorisation, constraintName=fk_authorisation_translator, referencedTableName=translator; addForeignKeyConstraint baseTableName=authorisation, constraintName=fk_authorisat...		\N	4.3.5	\N	\N	8641501082
init-5-authorisation_term_reminder	init	migrations.xml	2022-03-30 14:58:21.371976	8	EXECUTED	8:5231e552f2b2141bbed8f87206802c8a	createTable tableName=authorisation_term_reminder; addForeignKeyConstraint baseTableName=authorisation_term_reminder, constraintName=fk_authorisation_term_reminder_authorisation, referencedTableName=authorisation; addForeignKeyConstraint baseTable...		\N	4.3.5	\N	\N	8641501082
init-6-contact_request	init	migrations.xml	2022-03-30 14:58:21.387178	9	EXECUTED	8:944cf8f9fef67a908ef0ab4067bc1a8d	createTable tableName=contact_request		\N	4.3.5	\N	\N	8641501082
init-7-contact_request_translator	init	migrations.xml	2022-03-30 14:58:21.40459	10	EXECUTED	8:7165914d18b46100505d10612231dfea	createTable tableName=contact_request_translator; addForeignKeyConstraint baseTableName=contact_request_translator, constraintName=fk_contact_request_translator_contact_request, referencedTableName=contact_request; addForeignKeyConstraint baseTabl...		\N	4.3.5	\N	\N	8641501082
init-8-add-email_types	init	migrations.xml	2022-03-30 14:58:21.418201	11	EXECUTED	8:3829f52d3350562cc1e3862f191deba5	insert tableName=email_type; insert tableName=email_type; insert tableName=email_type; insert tableName=email_type; insert tableName=email_type		\N	4.3.5	\N	\N	8641501082
\.


--
-- Data for Name: databasechangeloglock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.databasechangeloglock (id, locked, lockgranted, lockedby) FROM stdin;
1	f	\N	\N
\.


--
-- Name: databasechangeloglock databasechangeloglock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.databasechangeloglock
    ADD CONSTRAINT databasechangeloglock_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

