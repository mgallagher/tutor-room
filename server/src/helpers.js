// @flow
import { getTutor, insertTutor } from '../src/db'
import { lookupByAggieNumber } from "../src/usuApi";

export const courseDetailToCourse = (courseDetail: USUStudentCourseDetail): Course => {
  return {
    crn: courseDetail.crn,
    number: courseDetail.courseNumber,
    title: courseDetail.courseTitle,
    termCode: courseDetail.termCode
  }
}

// TODO: Delete when Student and Tutors are merged into a single User table
export const syncTutor = async (aNumber: string) => {
  const tutor = await getTutor(aNumber)
  if (tutor != null) {
    console.log(aNumber, 'FOUND in database')
    return tutor
  } else {
    console.log(aNumber, 'not in database')
    const tutorDetails = await lookupByAggieNumber(aNumber)
    if (tutorDetails != null) {
      const tutor = {
        id: tutorDetails.id,
        aNumber: tutorDetails.username,
        firstName: tutorDetails.firstName,
        lastName: tutorDetails.lastName,
        preferredName: tutorDetails.preferredName
      }
      const savedTutor = await insertTutor(tutor)
      return savedTutor
    }
  }
}
