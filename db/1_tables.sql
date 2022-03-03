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
    from_lang character varying(10) NOT NULL,
    to_lang character varying(10) NOT NULL,
    permission_to_publish boolean NOT NULL,
    term_begin_date date,
    term_end_date date,
    diary_number character varying(255),
    CONSTRAINT ck_authorisation_aut_date CHECK ((((basis)::text = 'AUT'::text) OR (aut_date IS NULL))),
    CONSTRAINT ck_authorisation_from_to CHECK ((((from_lang)::text <> (to_lang)::text) AND (((from_lang)::text = ANY (ARRAY[('FI'::character varying)::text, ('SV'::character varying)::text, ('SEIN'::character varying)::text, ('SEKO'::character varying)::text, ('SEPO'::character varying)::text])) OR ((to_lang)::text = ANY (ARRAY[('FI'::character varying)::text, ('SV'::character varying)::text, ('SEIN'::character varying)::text, ('SEKO'::character varying)::text, ('SEPO'::character varying)::text]))))),
    CONSTRAINT ck_authorisation_term_end_date CHECK (((term_end_date IS NULL) OR (term_begin_date < term_end_date)))
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
    email_id bigint NOT NULL,
    authorisation_id bigint NOT NULL
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
    recipient_address text NOT NULL,
    subject text NOT NULL,
    body text NOT NULL,
    sent_at timestamp with time zone,
    error text,
    email_type character varying(255) NOT NULL,
    ext_id text,
    recipient_name text NOT NULL
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
    email character varying(255),
    phone_number text,
    street text,
    town text,
    postal_code text,
    country text,
    extra_information text,
    is_assured boolean NOT NULL
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
-- Name: authorisation authorisation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authorisation
    ADD CONSTRAINT authorisation_pkey PRIMARY KEY (authorisation_id);


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
-- Name: translator translator_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.translator
    ADD CONSTRAINT translator_email_key UNIQUE (email);


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
-- Name: authorisation_term_reminder fk_authorisation_term_reminder_authorisation; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authorisation_term_reminder
    ADD CONSTRAINT fk_authorisation_term_reminder_authorisation FOREIGN KEY (authorisation_id) REFERENCES public.authorisation(authorisation_id);


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

