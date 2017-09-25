/* @flow */

declare type GraphQLResponseRoot = {
  data?: Query | Mutation;
  errors?: Array<GraphQLResponseError>;
}

declare type GraphQLResponseError = {
  message: string;            // Required for all errors
  locations?: Array<GraphQLResponseErrorLocation>;
  [propName: string]: any;    // 7.2.2 says 'GraphQL servers may provide additional entries to error'
}

declare type GraphQLResponseErrorLocation = {
  line: number;
  column: number;
}

/**
  The root query type which gives access points into the data universe.
*/
declare type Query = {
  /** Exposes the root query type nested one level down. This is helpful for Relay 1 which can only query top level fields if they are in a particular form. */
  query: Query;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: string;
  /** Fetches an object given its globally unique `ID`. */
  node: ?Node;
  /** Reads and enables pagination through a set of `Course`. */
  allCourses: ?CoursesConnection;
  /** Reads and enables pagination through a set of `Session`. */
  allSessions: ?SessionsConnection;
  /** Reads and enables pagination through a set of `Student`. */
  allStudents: ?StudentsConnection;
  /** Reads and enables pagination through a set of `StudentCourse`. */
  allStudentCourses: ?StudentCoursesConnection;
  courseByCrn: ?Course;
  sessionById: ?Session;
  studentById: ?Student;
  studentByANumber: ?Student;
  studentCourseByStudentIdAndCrn: ?StudentCourse;
  /** Reads and enables pagination through a set of `Student`. */
  currentStudent: ?Student;
  latestAverageWait: ?Interval;
  /** Reads a single `Course` using its globally unique `ID`. */
  course: ?Course;
  /** Reads a single `Session` using its globally unique `ID`. */
  session: ?Session;
  /** Reads a single `Student` using its globally unique `ID`. */
  student: ?Student;
  /** Reads a single `StudentCourse` using its globally unique `ID`. */
  studentCourse: ?StudentCourse;
}

/**
  An object with a globally unique `ID`.
*/
declare type Node = Query | Course | StudentCourse | Student | Session;

/**
  Methods to use when ordering `Course`.
*/
declare type CoursesOrderBy = "NATURAL" | "CRN_ASC" | "CRN_DESC" | "NUMBER_ASC" | "NUMBER_DESC" | "TITLE_ASC" | "TITLE_DESC" | "TERM_CODE_ASC" | "TERM_CODE_DESC" | "PRIMARY_KEY_ASC" | "PRIMARY_KEY_DESC";

/**
  A condition to be used against `Course` object types. All fields are tested for equality and combined with a logical ‘and.’
*/
declare type CourseCondition = {
  /** Checks for equality with the object’s `crn` field. */
  crn: ?number;
  /** Checks for equality with the object’s `number` field. */
  number: ?number;
  /** Checks for equality with the object’s `title` field. */
  title: ?string;
  /** Checks for equality with the object’s `termCode` field. */
  termCode: ?string;
}

/**
  A connection to a list of `Course` values.
*/
declare type CoursesConnection = {
  /** A list of `Course` objects. */
  nodes: Array<Course>;
  /** A list of edges which contains the `Course` and cursor to aid in pagination. */
  edges: Array<CoursesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Course` you could get from the connection. */
  totalCount: ?number;
}

declare type Course = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: string;
  crn: number;
  number: number;
  title: string;
  termCode: string;
  /** Reads and enables pagination through a set of `StudentCourse`. */
  studentCoursesByCrn: StudentCoursesConnection;
  /** Reads and enables pagination through a set of `Session`. */
  sessionsByCrn: SessionsConnection;
}

/**
  Methods to use when ordering `StudentCourse`.
*/
declare type StudentCoursesOrderBy = "NATURAL" | "STUDENT_ID_ASC" | "STUDENT_ID_DESC" | "CRN_ASC" | "CRN_DESC" | "PRIMARY_KEY_ASC" | "PRIMARY_KEY_DESC";

/**
  A condition to be used against `StudentCourse` object types. All fields are tested for equality and combined with a logical ‘and.’
*/
declare type StudentCourseCondition = {
  /** Checks for equality with the object’s `studentId` field. */
  studentId: ?number;
  /** Checks for equality with the object’s `crn` field. */
  crn: ?number;
}

/**
  A connection to a list of `StudentCourse` values.
*/
declare type StudentCoursesConnection = {
  /** A list of `StudentCourse` objects. */
  nodes: Array<StudentCourse>;
  /** A list of edges which contains the `StudentCourse` and cursor to aid in pagination. */
  edges: Array<StudentCoursesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `StudentCourse` you could get from the connection. */
  totalCount: ?number;
}

declare type StudentCourse = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: string;
  studentId: number;
  crn: number;
  /** Reads a single `Student` that is related to this `StudentCourse`. */
  studentByStudentId: ?Student;
  /** Reads a single `Course` that is related to this `StudentCourse`. */
  courseByCrn: ?Course;
}

declare type Student = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: string;
  id: number;
  aNumber: string;
  firstName: ?string;
  lastName: ?string;
  preferredName: ?string;
  created: ?any;
  /** Reads and enables pagination through a set of `StudentCourse`. */
  studentCoursesByStudentId: StudentCoursesConnection;
  /** Reads and enables pagination through a set of `Session`. */
  sessionsByStudentId: SessionsConnection;
}

/**
  Methods to use when ordering `Session`.
*/
declare type SessionsOrderBy = "NATURAL" | "ID_ASC" | "ID_DESC" | "STUDENT_ID_ASC" | "STUDENT_ID_DESC" | "CRN_ASC" | "CRN_DESC" | "REASON_ASC" | "REASON_DESC" | "TUTOR_ID_ASC" | "TUTOR_ID_DESC" | "TIME_IN_ASC" | "TIME_IN_DESC" | "TIME_CLAIMED_ASC" | "TIME_CLAIMED_DESC" | "TIME_OUT_ASC" | "TIME_OUT_DESC" | "DESCRIPTION_ASC" | "DESCRIPTION_DESC" | "TUTOR_TAG_ASC" | "TUTOR_TAG_DESC" | "TUTOR_NOTES_ASC" | "TUTOR_NOTES_DESC" | "REQUEUED_ASC" | "REQUEUED_DESC" | "PRIMARY_KEY_ASC" | "PRIMARY_KEY_DESC";

/**
  A condition to be used against `Session` object types. All fields are tested for equality and combined with a logical ‘and.’
*/
declare type SessionCondition = {
  /** Checks for equality with the object’s `id` field. */
  id: ?number;
  /** Checks for equality with the object’s `studentId` field. */
  studentId: ?number;
  /** Checks for equality with the object’s `crn` field. */
  crn: ?number;
  /** Checks for equality with the object’s `reason` field. */
  reason: ?SessionReason;
  /** Checks for equality with the object’s `tutorId` field. */
  tutorId: ?number;
  /** Checks for equality with the object’s `timeIn` field. */
  timeIn: ?any;
  /** Checks for equality with the object’s `timeClaimed` field. */
  timeClaimed: ?any;
  /** Checks for equality with the object’s `timeOut` field. */
  timeOut: ?any;
  /** Checks for equality with the object’s `description` field. */
  description: ?string;
  /** Checks for equality with the object’s `tutorTag` field. */
  tutorTag: ?SessionTag;
  /** Checks for equality with the object’s `tutorNotes` field. */
  tutorNotes: ?string;
  /** Checks for equality with the object’s `requeued` field. */
  requeued: ?boolean;
}

declare type SessionReason = "DEBUGGING" | "SYNTAX" | "CONCEPT" | "PROGRAM_DESIGN";

declare type SessionTag = "DEBUGGING" | "FUNCTIONS" | "CLASSES";

/**
  A connection to a list of `Session` values.
*/
declare type SessionsConnection = {
  /** A list of `Session` objects. */
  nodes: Array<Session>;
  /** A list of edges which contains the `Session` and cursor to aid in pagination. */
  edges: Array<SessionsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Session` you could get from the connection. */
  totalCount: ?number;
}

declare type Session = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: string;
  id: number;
  studentId: number;
  crn: number;
  reason: ?SessionReason;
  tutorId: ?number;
  timeIn: ?any;
  timeClaimed: ?any;
  timeOut: ?any;
  description: ?string;
  tutorTag: ?SessionTag;
  tutorNotes: ?string;
  requeued: boolean;
  /** Reads a single `Student` that is related to this `Session`. */
  studentByStudentId: ?Student;
  /** Reads a single `Course` that is related to this `Session`. */
  courseByCrn: ?Course;
}

/**
  A `Session` edge in the connection.
*/
declare type SessionsEdge = {
  /** A cursor for use in pagination. */
  cursor: ?any;
  /** The `Session` at the end of the edge. */
  node: Session;
}

/**
  Information about pagination in a connection.
*/
declare type PageInfo = {
  /** When paginating forwards, are there more items? */
  hasNextPage: boolean;
  /** When paginating backwards, are there more items? */
  hasPreviousPage: boolean;
  /** When paginating backwards, the cursor to continue. */
  startCursor: ?any;
  /** When paginating forwards, the cursor to continue. */
  endCursor: ?any;
}

/**
  A `StudentCourse` edge in the connection.
*/
declare type StudentCoursesEdge = {
  /** A cursor for use in pagination. */
  cursor: ?any;
  /** The `StudentCourse` at the end of the edge. */
  node: StudentCourse;
}

/**
  A `Course` edge in the connection.
*/
declare type CoursesEdge = {
  /** A cursor for use in pagination. */
  cursor: ?any;
  /** The `Course` at the end of the edge. */
  node: Course;
}

/**
  Methods to use when ordering `Student`.
*/
declare type StudentsOrderBy = "NATURAL" | "ID_ASC" | "ID_DESC" | "A_NUMBER_ASC" | "A_NUMBER_DESC" | "FIRST_NAME_ASC" | "FIRST_NAME_DESC" | "LAST_NAME_ASC" | "LAST_NAME_DESC" | "PREFERRED_NAME_ASC" | "PREFERRED_NAME_DESC" | "CREATED_ASC" | "CREATED_DESC" | "PRIMARY_KEY_ASC" | "PRIMARY_KEY_DESC";

/**
  A condition to be used against `Student` object types. All fields are tested for equality and combined with a logical ‘and.’
*/
declare type StudentCondition = {
  /** Checks for equality with the object’s `id` field. */
  id: ?number;
  /** Checks for equality with the object’s `aNumber` field. */
  aNumber: ?string;
  /** Checks for equality with the object’s `firstName` field. */
  firstName: ?string;
  /** Checks for equality with the object’s `lastName` field. */
  lastName: ?string;
  /** Checks for equality with the object’s `preferredName` field. */
  preferredName: ?string;
  /** Checks for equality with the object’s `created` field. */
  created: ?any;
}

/**
  A connection to a list of `Student` values.
*/
declare type StudentsConnection = {
  /** A list of `Student` objects. */
  nodes: Array<Student>;
  /** A list of edges which contains the `Student` and cursor to aid in pagination. */
  edges: Array<StudentsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Student` you could get from the connection. */
  totalCount: ?number;
}

/**
  A `Student` edge in the connection.
*/
declare type StudentsEdge = {
  /** A cursor for use in pagination. */
  cursor: ?any;
  /** The `Student` at the end of the edge. */
  node: Student;
}

/**
  An interval of time that has passed where the smallest distinct unit is a second.
*/
declare type Interval = {
  /** A quantity of seconds. This is the only non-integer field, as all the other fields will dump their overflow into a smaller unit of time. Intervals don’t have a smaller unit than seconds. */
  seconds: ?number;
  /** A quantity of minutes. */
  minutes: ?number;
  /** A quantity of hours. */
  hours: ?number;
  /** A quantity of days. */
  days: ?number;
  /** A quantity of months. */
  months: ?number;
  /** A quantity of years. */
  years: ?number;
}

/**
  The root mutation type which contains root level fields which mutate data.
*/
declare type Mutation = {
  /** Reads and enables pagination through a set of `Session`. */
  finishSession: FinishSessionPayload;
  /** Reads and enables pagination through a set of `Session`. */
  startSession: StartSessionPayload;
}

/**
  All input for the `finishSession` mutation.
*/
declare type FinishSessionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId: ?string;
  sessionId: ?number;
  tag: ?SessionTag;
  notes: ?string;
  requeued: ?boolean;
}

/**
  The output of our `finishSession` mutation.
*/
declare type FinishSessionPayload = {
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId: ?string;
  session: ?Session;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query: ?Query;
  /** Reads a single `Student` that is related to this `Session`. */
  studentByStudentId: ?Student;
  /** Reads a single `Course` that is related to this `Session`. */
  courseByCrn: ?Course;
  /** An edge for the type. May be used by Relay 1. */
  sessionEdge: ?SessionsEdge;
}

/**
  All input for the `startSession` mutation.
*/
declare type StartSessionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId: ?string;
  crn: ?number;
  reason: ?SessionReason;
  description: ?string;
}

/**
  The output of our `startSession` mutation.
*/
declare type StartSessionPayload = {
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId: ?string;
  session: ?Session;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query: ?Query;
  /** Reads a single `Student` that is related to this `Session`. */
  studentByStudentId: ?Student;
  /** Reads a single `Course` that is related to this `Session`. */
  courseByCrn: ?Course;
  /** An edge for the type. May be used by Relay 1. */
  sessionEdge: ?SessionsEdge;
}