// @flow

declare type Student = {
  id: number,
  aNumber: string,
  firstName: string,
  lastName: string,
  preferredName: string
}

declare type StudentRecord = {
  id: number,
  a_number: string,
  first_name: string,
  last_name: string,
  preferred_name: string
}

declare type Course = {
  crn: number | string,
  number: number | string,
  title: string,
  termCode: number | string
}

declare type CourseRecord = {
  id?: number,
  crn: number | string,
  number: number | string,
  title: string,
  term_code: number | string
}

declare type StudentCourse = {
  courseId: number,
  studentId: number
}

declare type StudentCourseRecord = {
  course_id: number,
  student_id: number
}

// USU API Types
declare type USUPerson = {
  id: number,
  username: string,
  enabled: boolean,
  isStaff: boolean,
  isFaculty: boolean,
  isStudent: boolean,
  inDirectory: boolean,
  isConfidential: boolean,
  isBenefited: boolean,
  aggiemailEmail: string,
  preferredEmail: string,
  preferredName: string,
  profileImgUrl: string,
  middleName: string,
  firstName: string,
  nickName: string,
  lastName: string,
  fullName: string,
  staffHireDate: ?string,
  archiveDate: ?string,
  lastUpdated: string
}

declare type USUStudentCourseDetail = {
  crn: string,
  termCode: string,
  courseTitle: string,
  courseLevel: string,
  courseCampus: string,
  courseNumber: string,
  courseCredit: number,
  courseSubject: string,
  courseSequence: string,
  buildingCode: string,
  buildingRoom: string,
  sunday: boolean,
  monday: boolean,
  tuesday: boolean,
  wednesday: boolean,
  thursday: boolean,
  friday: boolean,
  saturday: boolean,
  endTime: string,
  startTime: string,
  endDate: string,
  startDate: string
}

declare type TermInfo = {
  termCode: string,
  termDesc: string,
  academicYearCode: string,
  academicYearDesc: string,
  termStartDate: string,
  termEndDate: string
}
