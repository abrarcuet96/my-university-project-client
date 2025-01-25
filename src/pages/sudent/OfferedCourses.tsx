import { useGetAllOfferedCoursesQuery } from "../../redux/features/student/studentCourseManagement.api";

const OfferedCourses = () => {
  const { data } = useGetAllOfferedCoursesQuery(undefined);
  console.log(data);

  return <div>OfferedCourses</div>;
};
export default OfferedCourses;
