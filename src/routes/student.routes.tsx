import MySchedule from "../pages/sudent/MySchedule";
import OfferedCourses from "../pages/sudent/OfferedCourses";
import StudentDashboard from "../pages/sudent/StudentDashboard";

export const studentPaths = [
  {
    name: "Dashboard",
    path: "dashboard",
    element: <StudentDashboard></StudentDashboard>,
  },
  {
    name: "Offered Course",
    path: "offered-course",
    element: <OfferedCourses />,
  },
  {
    name: "My Schedule",
    path: "schedule",
    element: <MySchedule />,
  },
];
