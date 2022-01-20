--
-- PostgreSQL database dump
--

-- Dumped from database version 11.2 (Debian 11.2-1.pgdg90+1)
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

--
-- Name: authorisation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authorisation (
    authorisation_id bigint NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    created_by text,
    modified_by text,
    deleted_by text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    modified_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    translator_id bigint NOT NULL,
    basis character varying(255) NOT NULL,
    meeting_date_id bigint,
    aut_date date,
    kkt_check text,
    vir_date date,
    assurance_date date,
    from_lang character varying(10) NOT NULL,
    to_lang character varying(10) NOT NULL,
    permission_to_publish boolean NOT NULL,
    diary_number character varying(255),
    CONSTRAINT ck_authorisation_by_basis CHECK (((((basis)::text = 'AUT'::text) AND (meeting_date_id IS NOT NULL) AND (aut_date IS NOT NULL) AND (kkt_check IS NULL) AND (vir_date IS NULL) AND (assurance_date IS NOT NULL)) OR (((basis)::text = 'KKT'::text) AND (meeting_date_id IS NOT NULL) AND (aut_date IS NULL) AND (kkt_check IS NOT NULL) AND (vir_date IS NULL) AND (assurance_date IS NOT NULL)) OR (((basis)::text = 'VIR'::text) AND (meeting_date_id IS NOT NULL) AND (aut_date IS NULL) AND (kkt_check IS NULL) AND (vir_date IS NOT NULL) AND (assurance_date IS NOT NULL)) OR (((basis)::text = 'VIR'::text) AND (meeting_date_id IS NULL) AND (aut_date IS NULL) AND (kkt_check IS NULL) AND (vir_date IS NOT NULL) AND (assurance_date IS NULL))))
);


ALTER TABLE public.authorisation OWNER TO postgres;

--
-- Name: authorisation_authorisation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.authorisation ALTER COLUMN authorisation_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.authorisation_authorisation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: authorisation_basis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authorisation_basis (
    name character varying(255) NOT NULL
);


ALTER TABLE public.authorisation_basis OWNER TO postgres;

--
-- Name: authorisation_term; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authorisation_term (
    authorisation_term_id bigint NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    created_by text,
    modified_by text,
    deleted_by text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    modified_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    authorisation_id bigint NOT NULL,
    begin_date date NOT NULL,
    end_date date,
    CONSTRAINT ck_authorisation_term_end_date CHECK (((end_date IS NULL) OR (begin_date < end_date)))
);


ALTER TABLE public.authorisation_term OWNER TO postgres;

--
-- Name: authorisation_term_authorisation_term_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.authorisation_term ALTER COLUMN authorisation_term_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.authorisation_term_authorisation_term_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: authorisation_term_reminder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authorisation_term_reminder (
    authorisation_term_reminder_id bigint NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    created_by text,
    modified_by text,
    deleted_by text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    modified_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    authorisation_term_id bigint NOT NULL,
    email_id bigint NOT NULL
);


ALTER TABLE public.authorisation_term_reminder OWNER TO postgres;

--
-- Name: authorisation_term_reminder_authorisation_term_reminder_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.authorisation_term_reminder ALTER COLUMN authorisation_term_reminder_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.authorisation_term_reminder_authorisation_term_reminder_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: contact_request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_request (
    contact_request_id bigint NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    created_by text,
    modified_by text,
    deleted_by text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    modified_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    phone_number text,
    message text NOT NULL,
    from_lang character varying(10) NOT NULL,
    to_lang character varying(10) NOT NULL
);


ALTER TABLE public.contact_request OWNER TO postgres;

--
-- Name: contact_request_contact_request_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.contact_request ALTER COLUMN contact_request_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.contact_request_contact_request_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: contact_request_translator; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_request_translator (
    contact_request_translator_id bigint NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    created_by text,
    modified_by text,
    deleted_by text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    modified_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    contact_request_id bigint NOT NULL,
    translator_id bigint NOT NULL
);


ALTER TABLE public.contact_request_translator OWNER TO postgres;

--
-- Name: contact_request_translator_contact_request_translator_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.contact_request_translator ALTER COLUMN contact_request_translator_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.contact_request_translator_contact_request_translator_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: email; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email (
    email_id bigint NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    created_by text,
    modified_by text,
    deleted_by text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    modified_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    sender text NOT NULL,
    recipient text NOT NULL,
    subject text NOT NULL,
    body text NOT NULL,
    sent_at timestamp with time zone,
    error text,
    email_type character varying(255) NOT NULL,
    ext_id text
);


ALTER TABLE public.email OWNER TO postgres;

--
-- Name: email_email_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.email ALTER COLUMN email_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.email_email_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: email_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email_type (
    name character varying(255) NOT NULL
);


ALTER TABLE public.email_type OWNER TO postgres;

--
-- Name: meeting_date; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.meeting_date (
    meeting_date_id bigint NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    created_by text,
    modified_by text,
    deleted_by text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    modified_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    date date NOT NULL
);


ALTER TABLE public.meeting_date OWNER TO postgres;

--
-- Name: meeting_date_meeting_date_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.meeting_date ALTER COLUMN meeting_date_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.meeting_date_meeting_date_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: shedlock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shedlock (
    name character varying(64) NOT NULL,
    lock_until timestamp without time zone NOT NULL,
    locked_at timestamp without time zone NOT NULL,
    locked_by character varying(255) NOT NULL
);


ALTER TABLE public.shedlock OWNER TO postgres;

--
-- Name: translator; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.translator (
    translator_id bigint NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    created_by text,
    modified_by text,
    deleted_by text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    modified_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    identity_number character varying(255),
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text,
    phone_number text,
    street text,
    town text,
    postal_code text,
    country text
);


ALTER TABLE public.translator OWNER TO postgres;

--
-- Name: translator_translator_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.translator ALTER COLUMN translator_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.translator_translator_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: authorisation_basis authorisation_basis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authorisation_basis
    ADD CONSTRAINT authorisation_basis_pkey PRIMARY KEY (name);


--
-- Name: authorisation authorisation_diary_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authorisation
    ADD CONSTRAINT authorisation_diary_number_key UNIQUE (diary_number);


--
-- Name: authorisation authorisation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authorisation
    ADD CONSTRAINT authorisation_pkey PRIMARY KEY (authorisation_id);


--
-- Name: authorisation_term authorisation_term_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authorisation_term
    ADD CONSTRAINT authorisation_term_pkey PRIMARY KEY (authorisation_term_id);


--
-- Name: authorisation_term_reminder authorisation_term_reminder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authorisation_term_reminder
    ADD CONSTRAINT authorisation_term_reminder_pkey PRIMARY KEY (authorisation_term_reminder_id);


--
-- Name: contact_request contact_request_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_request
    ADD CONSTRAINT contact_request_pkey PRIMARY KEY (contact_request_id);


--
-- Name: contact_request_translator contact_request_translator_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_request_translator
    ADD CONSTRAINT contact_request_translator_pkey PRIMARY KEY (contact_request_translator_id);


--
-- Name: email email_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email
    ADD CONSTRAINT email_pkey PRIMARY KEY (email_id);


--
-- Name: email_type email_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_type
    ADD CONSTRAINT email_type_pkey PRIMARY KEY (name);


--
-- Name: meeting_date meeting_date_date_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.meeting_date
    ADD CONSTRAINT meeting_date_date_key UNIQUE (date);


--
-- Name: meeting_date meeting_date_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.meeting_date
    ADD CONSTRAINT meeting_date_pkey PRIMARY KEY (meeting_date_id);


--
-- Name: shedlock shedlock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shedlock
    ADD CONSTRAINT shedlock_pkey PRIMARY KEY (name);


--
-- Name: translator translator_identity_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.translator
    ADD CONSTRAINT translator_identity_number_key UNIQUE (identity_number);


--
-- Name: translator translator_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.translator
    ADD CONSTRAINT translator_pkey PRIMARY KEY (translator_id);


--
-- Name: authorisation fk_authorisation_authorisation_basis; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authorisation
    ADD CONSTRAINT fk_authorisation_authorisation_basis FOREIGN KEY (basis) REFERENCES public.authorisation_basis(name);


--
-- Name: authorisation fk_authorisation_meeting_date; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authorisation
    ADD CONSTRAINT fk_authorisation_meeting_date FOREIGN KEY (meeting_date_id) REFERENCES public.meeting_date(meeting_date_id);


--
-- Name: authorisation_term fk_authorisation_term_authorisation; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authorisation_term
    ADD CONSTRAINT fk_authorisation_term_authorisation FOREIGN KEY (authorisation_id) REFERENCES public.authorisation(authorisation_id);


--
-- Name: authorisation_term_reminder fk_authorisation_term_reminder_authorisation_term; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authorisation_term_reminder
    ADD CONSTRAINT fk_authorisation_term_reminder_authorisation_term FOREIGN KEY (authorisation_term_id) REFERENCES public.authorisation_term(authorisation_term_id);


--
-- Name: authorisation_term_reminder fk_authorisation_term_reminder_email; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authorisation_term_reminder
    ADD CONSTRAINT fk_authorisation_term_reminder_email FOREIGN KEY (email_id) REFERENCES public.email(email_id);


--
-- Name: authorisation fk_authorisation_translator; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authorisation
    ADD CONSTRAINT fk_authorisation_translator FOREIGN KEY (translator_id) REFERENCES public.translator(translator_id);


--
-- Name: contact_request_translator fk_contact_request_translator_contact_request; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_request_translator
    ADD CONSTRAINT fk_contact_request_translator_contact_request FOREIGN KEY (contact_request_id) REFERENCES public.contact_request(contact_request_id);


--
-- Name: contact_request_translator fk_contact_request_translator_translator; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_request_translator
    ADD CONSTRAINT fk_contact_request_translator_translator FOREIGN KEY (translator_id) REFERENCES public.translator(translator_id);


--
-- Name: email fk_email_email_type; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email
    ADD CONSTRAINT fk_email_email_type FOREIGN KEY (email_type) REFERENCES public.email_type(name);


--
-- PostgreSQL database dump complete
--

