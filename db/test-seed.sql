--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.0
-- Dumped by pg_dump version 9.6.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: tutor_room; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA tutor_room;


ALTER SCHEMA tutor_room OWNER TO postgres;

--
-- Name: tutor_room_private; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA tutor_room_private;


ALTER SCHEMA tutor_room_private OWNER TO postgres;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = tutor_room, pg_catalog;

--
-- Name: tutoring_reason; Type: TYPE; Schema: tutor_room; Owner: postgres
--

CREATE TYPE tutoring_reason AS ENUM (
    'debugging',
    'syntax',
    'concept',
    'program_design'
);


ALTER TYPE tutoring_reason OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: classes; Type: TABLE; Schema: tutor_room; Owner: postgres
--

CREATE TABLE classes (
    crn integer NOT NULL,
    course_number integer NOT NULL,
    instructor text NOT NULL
);


ALTER TABLE classes OWNER TO postgres;

--
-- Name: courses; Type: TABLE; Schema: tutor_room; Owner: postgres
--

CREATE TABLE courses (
    course_number integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE courses OWNER TO postgres;

--
-- Name: student_classes; Type: TABLE; Schema: tutor_room; Owner: postgres
--

CREATE TABLE student_classes (
    student_id integer NOT NULL,
    crn integer NOT NULL
);


ALTER TABLE student_classes OWNER TO postgres;

--
-- Name: students; Type: TABLE; Schema: tutor_room; Owner: postgres
--

CREATE TABLE students (
    id integer NOT NULL,
    first_name text,
    last_name text,
    a_number text NOT NULL,
    created timestamp with time zone DEFAULT now()
);


ALTER TABLE students OWNER TO postgres;

--
-- Name: student_courses; Type: VIEW; Schema: tutor_room; Owner: postgres
--

CREATE VIEW student_courses AS
 SELECT classes.crn,
    courses.course_number,
    courses.name,
    classes.instructor,
    student_classes.student_id,
    students.id,
    students.first_name,
    students.last_name,
    students.a_number,
    students.created
   FROM (((courses
     JOIN classes USING (course_number))
     JOIN student_classes USING (crn))
     JOIN students ON ((students.id = student_classes.student_id)));


ALTER TABLE student_courses OWNER TO postgres;

--
-- Name: students_id_seq; Type: SEQUENCE; Schema: tutor_room; Owner: postgres
--

CREATE SEQUENCE students_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE students_id_seq OWNER TO postgres;

--
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: tutor_room; Owner: postgres
--

ALTER SEQUENCE students_id_seq OWNED BY students.id;


--
-- Name: visits; Type: TABLE; Schema: tutor_room; Owner: postgres
--

CREATE TABLE visits (
    id integer NOT NULL,
    student_id integer NOT NULL,
    crn integer NOT NULL,
    reason tutoring_reason,
    tutor_id integer,
    time_in timestamp with time zone DEFAULT now(),
    time_claimed timestamp with time zone,
    time_out timestamp with time zone,
    description text
);


ALTER TABLE visits OWNER TO postgres;

--
-- Name: visits_id_seq; Type: SEQUENCE; Schema: tutor_room; Owner: postgres
--

CREATE SEQUENCE visits_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE visits_id_seq OWNER TO postgres;

--
-- Name: visits_id_seq; Type: SEQUENCE OWNED BY; Schema: tutor_room; Owner: postgres
--

ALTER SEQUENCE visits_id_seq OWNED BY visits.id;


SET search_path = tutor_room_private, pg_catalog;

--
-- Name: tutors; Type: TABLE; Schema: tutor_room_private; Owner: postgres
--

CREATE TABLE tutors (
    id integer NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    CONSTRAINT tutors_email_check CHECK ((email ~* '^.+@.+\..+$'::text))
);


ALTER TABLE tutors OWNER TO postgres;

--
-- Name: tutors_id_seq; Type: SEQUENCE; Schema: tutor_room_private; Owner: postgres
--

CREATE SEQUENCE tutors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tutors_id_seq OWNER TO postgres;

--
-- Name: tutors_id_seq; Type: SEQUENCE OWNED BY; Schema: tutor_room_private; Owner: postgres
--

ALTER SEQUENCE tutors_id_seq OWNED BY tutors.id;


SET search_path = tutor_room, pg_catalog;

--
-- Name: students id; Type: DEFAULT; Schema: tutor_room; Owner: postgres
--

ALTER TABLE ONLY students ALTER COLUMN id SET DEFAULT nextval('students_id_seq'::regclass);


--
-- Name: visits id; Type: DEFAULT; Schema: tutor_room; Owner: postgres
--

ALTER TABLE ONLY visits ALTER COLUMN id SET DEFAULT nextval('visits_id_seq'::regclass);


SET search_path = tutor_room_private, pg_catalog;

--
-- Name: tutors id; Type: DEFAULT; Schema: tutor_room_private; Owner: postgres
--

ALTER TABLE ONLY tutors ALTER COLUMN id SET DEFAULT nextval('tutors_id_seq'::regclass);


SET search_path = tutor_room, pg_catalog;

--
-- Data for Name: classes; Type: TABLE DATA; Schema: tutor_room; Owner: postgres
--

COPY classes (crn, course_number, instructor) FROM stdin;
10925	1400	Jacob Christiansen
12986	1400	Apoorva Chauhan
10937	1410	James Mathias
14472	1440	Stephen Clyde
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: tutor_room; Owner: postgres
--

COPY courses (course_number, name) FROM stdin;
1400	Introduction to Computer Science - CS1
1410	Introduction to Computer Science - CS2
1440	Methods in Computer Science
\.


--
-- Data for Name: student_classes; Type: TABLE DATA; Schema: tutor_room; Owner: postgres
--

COPY student_classes (student_id, crn) FROM stdin;
1	10925
2	10925
3	12986
4	10925
5	12986
6	12986
7	12986
8	10925
9	10925
10	10925
11	10925
12	12986
13	12986
14	10925
15	12986
16	10925
17	10925
18	10925
19	12986
20	12986
21	12986
22	10925
23	10925
24	12986
25	12986
26	10925
27	10925
28	10925
29	12986
30	12986
31	12986
32	10925
33	10925
34	10925
35	10925
36	12986
37	12986
38	12986
39	12986
40	12986
41	12986
42	10925
43	10925
44	10925
45	10925
46	12986
47	10925
48	12986
49	10925
50	12986
51	10937
51	14472
52	10937
52	14472
53	10937
53	14472
54	10937
54	14472
55	10937
55	14472
56	10937
56	14472
57	10937
57	14472
58	10937
58	14472
59	10937
59	14472
60	10937
60	14472
61	10937
61	14472
62	10937
62	14472
63	10937
63	14472
64	10937
64	14472
65	10937
65	14472
66	10937
66	14472
67	10937
67	14472
68	10937
68	14472
69	10937
69	14472
70	10937
70	14472
71	10937
71	14472
72	10937
72	14472
73	10937
73	14472
74	10937
74	14472
75	10937
75	14472
76	10937
76	14472
77	10937
77	14472
78	10937
78	14472
79	10937
79	14472
80	10937
80	14472
81	10937
81	14472
82	10937
82	14472
83	10937
83	14472
84	10937
84	14472
85	10937
85	14472
86	10937
86	14472
87	10937
87	14472
88	10937
88	14472
89	10937
89	14472
90	10937
90	14472
91	10937
91	14472
92	10937
92	14472
93	10937
93	14472
94	10937
94	14472
95	10937
95	14472
96	10937
96	14472
97	10937
97	14472
98	10937
98	14472
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: tutor_room; Owner: postgres
--

COPY students (id, first_name, last_name, a_number, created) FROM stdin;
1	Amanda	Burton	A16293856	2017-02-17 04:09:36.099151+00
2	Samuel	Wright	A17248774	2017-02-17 04:09:36.099151+00
3	Stephen	Mccoy	A16651647	2017-02-17 04:09:36.099151+00
4	Albert	Parker	A16998096	2017-02-17 04:09:36.099151+00
5	Andrew	Meyer	A19542683	2017-02-17 04:09:36.099151+00
6	Fred	Williamson	A10364012	2017-02-17 04:09:36.099151+00
7	Douglas	Wells	A16655605	2017-02-17 04:09:36.099151+00
8	Ralph	Barnes	A16261763	2017-02-17 04:09:36.099151+00
9	Judy	George	A19030065	2017-02-17 04:09:36.099151+00
10	Howard	Franklin	A16881069	2017-02-17 04:09:36.099151+00
11	Janet	Cox	A16798327	2017-02-17 04:09:36.099151+00
12	Virginia	Sanders	A10918873	2017-02-17 04:09:36.099151+00
13	Wanda	Price	A11941166	2017-02-17 04:09:36.099151+00
14	Judy	Black	A10887201	2017-02-17 04:09:36.099151+00
15	Virginia	Davis	A18705570	2017-02-17 04:09:36.099151+00
16	Virginia	Carr	A14843274	2017-02-17 04:09:36.099151+00
17	Kenneth	Ferguson	A15048222	2017-02-17 04:09:36.099151+00
18	Carl	Castillo	A11405887	2017-02-17 04:09:36.099151+00
19	Fred	Brooks	A10634733	2017-02-17 04:09:36.099151+00
20	Debra	Allen	A18536360	2017-02-17 04:09:36.099151+00
21	Kimberly	White	A12301849	2017-02-17 04:09:36.099151+00
22	Ralph	Willis	A16666453	2017-02-17 04:09:36.099151+00
23	Roger	Peterson	A16731900	2017-02-17 04:09:36.099151+00
24	Harry	Ray	A11523666	2017-02-17 04:09:36.099151+00
25	Sean	Foster	A18414425	2017-02-17 04:09:36.099151+00
26	Rose	Jackson	A18072548	2017-02-17 04:09:36.099151+00
27	Jason	Moreno	A13641038	2017-02-17 04:09:36.099151+00
28	Sean	Watkins	A16474147	2017-02-17 04:09:36.099151+00
29	Chris	Knight	A14571132	2017-02-17 04:09:36.099151+00
30	Gregory	Fox	A14691815	2017-02-17 04:09:36.099151+00
31	Juan	Flores	A11726005	2017-02-17 04:09:36.099151+00
32	Rose	Gomez	A12060665	2017-02-17 04:09:36.099151+00
33	Rebecca	Rodriguez	A14773424	2017-02-17 04:09:36.099151+00
34	Donald	Adams	A10673645	2017-02-17 04:09:36.099151+00
35	Fred	Moreno	A12160235	2017-02-17 04:09:36.099151+00
36	Edward	Ferguson	A16134203	2017-02-17 04:09:36.099151+00
37	Edward	Cunningham	A12444159	2017-02-17 04:09:36.099151+00
38	Carol	Torres	A17744937	2017-02-17 04:09:36.099151+00
39	Helen	Vasquez	A19092137	2017-02-17 04:09:36.099151+00
40	Jennifer	Murphy	A18189133	2017-02-17 04:09:36.099151+00
41	Katherine	Scott	A19420012	2017-02-17 04:09:36.099151+00
42	Joan	Medina	A10542225	2017-02-17 04:09:36.099151+00
43	John	Young	A11602600	2017-02-17 04:09:36.099151+00
44	Judith	Castillo	A17768793	2017-02-17 04:09:36.099151+00
45	Christina	Rivera	A11466308	2017-02-17 04:09:36.099151+00
46	Russell	Spencer	A14994931	2017-02-17 04:09:36.099151+00
47	Jimmy	Little	A16396879	2017-02-17 04:09:36.099151+00
48	Frank	Allen	A13543996	2017-02-17 04:09:36.099151+00
49	Gerald	Palmer	A16029375	2017-02-17 04:09:36.099151+00
50	Julie	West	A13934202	2017-02-17 04:09:36.099151+00
51	Jose	Mitchell	A12238058	2017-02-17 04:09:36.099151+00
52	Jean	Alvarez	A15234314	2017-02-17 04:09:36.099151+00
53	Jack	Perkins	A12192050	2017-02-17 04:09:36.099151+00
54	Richard	Campbell	A15247431	2017-02-17 04:09:36.099151+00
55	Angela	Martin	A17736342	2017-02-17 04:09:36.099151+00
56	Teresa	Freeman	A17843983	2017-02-17 04:09:36.099151+00
57	Nancy	Ray	A10282907	2017-02-17 04:09:36.099151+00
58	Douglas	Butler	A19654129	2017-02-17 04:09:36.099151+00
59	Eugene	Garrett	A16892883	2017-02-17 04:09:36.099151+00
60	Jonathan	Watkins	A10430096	2017-02-17 04:09:36.099151+00
61	William	Ellis	A16105088	2017-02-17 04:09:36.099151+00
62	Virginia	Murphy	A17300484	2017-02-17 04:09:36.099151+00
63	Jason	Wagner	A12272997	2017-02-17 04:09:36.099151+00
64	Jennifer	Ellis	A17072126	2017-02-17 04:09:36.099151+00
65	Evelyn	Warren	A10615081	2017-02-17 04:09:36.099151+00
66	Sharon	Jones	A18731371	2017-02-17 04:09:36.099151+00
67	Tina	Washington	A19801885	2017-02-17 04:09:36.099151+00
68	Adam	Lopez	A11345360	2017-02-17 04:09:36.099151+00
69	Kenneth	Medina	A14680746	2017-02-17 04:09:36.099151+00
70	Shawn	Snyder	A19298296	2017-02-17 04:09:36.099151+00
71	Anne	Scott	A12724190	2017-02-17 04:09:36.099151+00
72	Bobby	Fuller	A17962216	2017-02-17 04:09:36.099151+00
73	Margaret	Hawkins	A18438112	2017-02-17 04:09:36.099151+00
74	Pamela	Stephens	A17221802	2017-02-17 04:09:36.099151+00
75	Joshua	Ramos	A15747328	2017-02-17 04:09:36.099151+00
76	Harold	Perez	A12584507	2017-02-17 04:09:36.099151+00
77	Steven	Cunningham	A16336310	2017-02-17 04:09:36.099151+00
78	Laura	Torres	A11475321	2017-02-17 04:09:36.099151+00
79	Harry	Lewis	A17338759	2017-02-17 04:09:36.099151+00
80	Debra	Fernandez	A17025409	2017-02-17 04:09:36.099151+00
81	Debra	Jackson	A15582170	2017-02-17 04:09:36.099151+00
82	Lillian	Powell	A16882313	2017-02-17 04:09:36.099151+00
83	Howard	King	A13406093	2017-02-17 04:09:36.099151+00
84	Debra	Carter	A18202812	2017-02-17 04:09:36.099151+00
85	Christopher	Wheeler	A17821645	2017-02-17 04:09:36.099151+00
86	Jimmy	Black	A13136550	2017-02-17 04:09:36.099151+00
87	Samuel	Gonzales	A12229996	2017-02-17 04:09:36.099151+00
88	Peter	Washington	A17403981	2017-02-17 04:09:36.099151+00
89	Evelyn	Rose	A13046570	2017-02-17 04:09:36.099151+00
90	Theresa	Larson	A12618998	2017-02-17 04:09:36.099151+00
91	Eugene	Bell	A17802559	2017-02-17 04:09:36.099151+00
92	Christina	Pierce	A18145282	2017-02-17 04:09:36.099151+00
93	Jack	Patterson	A11302145	2017-02-17 04:09:36.099151+00
94	Albert	Washington	A11714137	2017-02-17 04:09:36.099151+00
95	Keith	Kennedy	A17865447	2017-02-17 04:09:36.099151+00
96	Wanda	Flores	A12103750	2017-02-17 04:09:36.099151+00
97	Stephen	Burns	A13087927	2017-02-17 04:09:36.099151+00
98	Mike	Gallagher	A00883333	2017-02-17 04:09:36.099151+00
\.


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: tutor_room; Owner: postgres
--

SELECT pg_catalog.setval('students_id_seq', 98, true);


--
-- Data for Name: visits; Type: TABLE DATA; Schema: tutor_room; Owner: postgres
--

COPY visits (id, student_id, crn, reason, tutor_id, time_in, time_claimed, time_out, description) FROM stdin;
\.


--
-- Name: visits_id_seq; Type: SEQUENCE SET; Schema: tutor_room; Owner: postgres
--

SELECT pg_catalog.setval('visits_id_seq', 1, false);


SET search_path = tutor_room_private, pg_catalog;

--
-- Data for Name: tutors; Type: TABLE DATA; Schema: tutor_room_private; Owner: postgres
--

COPY tutors (id, email, password_hash) FROM stdin;
\.


--
-- Name: tutors_id_seq; Type: SEQUENCE SET; Schema: tutor_room_private; Owner: postgres
--

SELECT pg_catalog.setval('tutors_id_seq', 1, false);


SET search_path = tutor_room, pg_catalog;

--
-- Name: classes classes_pkey; Type: CONSTRAINT; Schema: tutor_room; Owner: postgres
--

ALTER TABLE ONLY classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (crn);


--
-- Name: courses courses_name_key; Type: CONSTRAINT; Schema: tutor_room; Owner: postgres
--

ALTER TABLE ONLY courses
    ADD CONSTRAINT courses_name_key UNIQUE (name);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: tutor_room; Owner: postgres
--

ALTER TABLE ONLY courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (course_number);


--
-- Name: student_classes student_classes_pkey; Type: CONSTRAINT; Schema: tutor_room; Owner: postgres
--

ALTER TABLE ONLY student_classes
    ADD CONSTRAINT student_classes_pkey PRIMARY KEY (student_id, crn);


--
-- Name: students students_a_number_key; Type: CONSTRAINT; Schema: tutor_room; Owner: postgres
--

ALTER TABLE ONLY students
    ADD CONSTRAINT students_a_number_key UNIQUE (a_number);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: tutor_room; Owner: postgres
--

ALTER TABLE ONLY students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: visits visits_pkey; Type: CONSTRAINT; Schema: tutor_room; Owner: postgres
--

ALTER TABLE ONLY visits
    ADD CONSTRAINT visits_pkey PRIMARY KEY (id);


SET search_path = tutor_room_private, pg_catalog;

--
-- Name: tutors tutors_email_key; Type: CONSTRAINT; Schema: tutor_room_private; Owner: postgres
--

ALTER TABLE ONLY tutors
    ADD CONSTRAINT tutors_email_key UNIQUE (email);


--
-- Name: tutors tutors_pkey; Type: CONSTRAINT; Schema: tutor_room_private; Owner: postgres
--

ALTER TABLE ONLY tutors
    ADD CONSTRAINT tutors_pkey PRIMARY KEY (id);


SET search_path = tutor_room, pg_catalog;

--
-- Name: classes classes_course_number_fkey; Type: FK CONSTRAINT; Schema: tutor_room; Owner: postgres
--

ALTER TABLE ONLY classes
    ADD CONSTRAINT classes_course_number_fkey FOREIGN KEY (course_number) REFERENCES courses(course_number) ON DELETE CASCADE;


--
-- Name: student_classes student_classes_crn_fkey; Type: FK CONSTRAINT; Schema: tutor_room; Owner: postgres
--

ALTER TABLE ONLY student_classes
    ADD CONSTRAINT student_classes_crn_fkey FOREIGN KEY (crn) REFERENCES classes(crn);


--
-- Name: student_classes student_classes_student_id_fkey; Type: FK CONSTRAINT; Schema: tutor_room; Owner: postgres
--

ALTER TABLE ONLY student_classes
    ADD CONSTRAINT student_classes_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id);


--
-- Name: visits visits_crn_fkey; Type: FK CONSTRAINT; Schema: tutor_room; Owner: postgres
--

ALTER TABLE ONLY visits
    ADD CONSTRAINT visits_crn_fkey FOREIGN KEY (crn) REFERENCES classes(crn);


--
-- Name: visits visits_student_id_fkey; Type: FK CONSTRAINT; Schema: tutor_room; Owner: postgres
--

ALTER TABLE ONLY visits
    ADD CONSTRAINT visits_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id);


--
-- Name: visits visits_tutor_id_fkey; Type: FK CONSTRAINT; Schema: tutor_room; Owner: postgres
--

ALTER TABLE ONLY visits
    ADD CONSTRAINT visits_tutor_id_fkey FOREIGN KEY (tutor_id) REFERENCES tutor_room_private.tutors(id);


--
-- PostgreSQL database dump complete
--

