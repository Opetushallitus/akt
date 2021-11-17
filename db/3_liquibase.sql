--
-- PostgreSQL database dump
--

-- Dumped from database version 13.4 (Debian 13.4-4.pgdg110+1)
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
2021-11-02-create-meeting_date-table	terova	migrations.xml	2021-11-17 14:35:22.087546	1	EXECUTED	8:a1e92c8f7fd1420049d42d979a27b93a	createTable tableName=meeting_date		\N	4.3.5	\N	\N	7152521983
2021-11-02-create-authorisation_basis-table	terova	migrations.xml	2021-11-17 14:35:22.131273	2	EXECUTED	8:e3237db0c80a738e470dbfd514e657e4	createTable tableName=authorisation_basis; insert tableName=authorisation_basis; insert tableName=authorisation_basis; insert tableName=authorisation_basis		\N	4.3.5	\N	\N	7152521983
2021-11-02-create-translator-table	terova	migrations.xml	2021-11-17 14:35:22.149331	3	EXECUTED	8:4138e47fa4d12e1540c5834e58b81c0e	createTable tableName=translator		\N	4.3.5	\N	\N	7152521983
2021-11-02-create-authorisation-table	terova	migrations.xml	2021-11-17 14:35:22.187677	4	EXECUTED	8:f3dd004c7c277327a2846b0ceae5a5ec	createTable tableName=authorisation; addForeignKeyConstraint baseTableName=authorisation, constraintName=fk_authorisation_translator, referencedTableName=translator; addForeignKeyConstraint baseTableName=authorisation, constraintName=fk_authorisat...		\N	4.3.5	\N	\N	7152521983
2021-11-02-create-language_pair-table	terova	migrations.xml	2021-11-17 14:35:22.211622	5	EXECUTED	8:fcfcaa2a32865c4929340238e497e9be	createTable tableName=language_pair; addForeignKeyConstraint baseTableName=language_pair, constraintName=fk_language_pair_authorisation, referencedTableName=authorisation; createIndex indexName=language_pair_uniq, tableName=language_pair		\N	4.3.5	\N	\N	7152521983
2021-11-02-create-authorisation_term-table	terova	migrations.xml	2021-11-17 14:35:22.237009	6	EXECUTED	8:ba5ebcbc8a372a5aca62eec5fd81c1ae	createTable tableName=authorisation_term; addForeignKeyConstraint baseTableName=authorisation_term, constraintName=fk_authorisation_term_authorisation, referencedTableName=authorisation; sql		\N	4.3.5	\N	\N	7152521983
2021-11-02-create-email-table	terova	migrations.xml	2021-11-17 14:35:22.257288	7	EXECUTED	8:d6d306a7ecd9d787ebbec875b8286b0f	createTable tableName=email		\N	4.3.5	\N	\N	7152521983
2021-11-02-create-authorisation_term_reminder-table	terova	migrations.xml	2021-11-17 14:35:22.2819	8	EXECUTED	8:fce40a40cc7077fed2c6c1b4a0d7f40d	createTable tableName=authorisation_term_reminder; addForeignKeyConstraint baseTableName=authorisation_term_reminder, constraintName=fk_authorisation_term_reminder_authorisation_term, referencedTableName=authorisation_term; addForeignKeyConstraint...		\N	4.3.5	\N	\N	7152521983
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

