import { Layout, Menu } from "antd";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import { useAppSelector } from "../../redux/hooks";
import { adminPaths } from "../../routes/admin.routes";
import { facultyPaths } from "../../routes/faculty.routes";
import { studentPaths } from "../../routes/student.routes";
import { sidebarItemGenerator } from "../../utils/sidebarItemsGenerator";

const { Sider } = Layout;
const userRole = {
  ADMIN: "admin",
  Faculty: "faculty",
  Student: "student",
};
const Sidebar = () => {
  const user = useAppSelector(selectCurrentUser);
  let sidebarItems;
  switch (user!.userRole) {
    case userRole.ADMIN:
      sidebarItems = sidebarItemGenerator(adminPaths, userRole.ADMIN);
      break;
    case userRole.Faculty:
      sidebarItems = sidebarItemGenerator(facultyPaths, userRole.Faculty);
      break;
    case userRole.Student:
      sidebarItems = sidebarItemGenerator(studentPaths, userRole.Student);
      break;

    default:
      break;
  }
  return (
    <Sider breakpoint="lg" collapsedWidth="0">
      <div
        style={{
          fontSize: "30px",
          color: "white",
          textAlign: "center",
          height: "4rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className="demo-logo-vertical"
      >
        {" "}
        MY<span>uni</span>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["4"]}
        items={sidebarItems}
      />
    </Sider>
  );
};
export default Sidebar;
