// @flow
export const courseDetailToCourse = (courseDetail: USUStudentCourseDetail): Course => {
  return {
    crn: courseDetail.crn,
    number: courseDetail.courseNumber,
    title: courseDetail.courseTitle,
    termCode: courseDetail.termCode
  }
}
