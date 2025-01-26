import { Button, Col, Row, Space, Typography } from "antd";
import { toast } from "sonner";
import {
  useEnrollCourseMutation,
  useGetAllOfferedCoursesQuery,
} from "../../redux/features/student/studentCourseManagement.api";

const { Title, Text } = Typography;
type TCourse = {
  [index: string]: any;
};
const OfferedCourses = () => {
  const { data: offeredCourseData } = useGetAllOfferedCoursesQuery(undefined);
  const [enroll] = useEnrollCourseMutation();
  console.log(offeredCourseData);
  const singleObject = offeredCourseData?.data?.reduce((acc: TCourse, item) => {
    const key = item.course.title;
    acc[key] = acc[key] || { courseTitle: key, sections: [] };
    acc[key].sections.push({
      section: item.section,
      _id: item._id,
      days: item.days,
      startTime: item.startTime,
      endTime: item.endTime,
    });
    return acc;
  }, {});
  const modifiedData = Object.values(singleObject ? singleObject : {});
  const handleEnroll = async (id) => {
    const toastId = toast.loading("Enrolling...", {
      style: {
        padding: "16px",
        borderRadius: "8px",
        fontSize: "16px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      },
      className: "class",
    });
    const enrollData = {
      offeredCourse: id,
    };
    try {
      const res = await enroll(enrollData);
      if (res.error) {
        toast.error(res?.error?.data?.message, {
          id: toastId,
          style: {
            padding: "16px",
            borderRadius: "8px",
            fontSize: "16px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
          className: "class",
        });
      } else {
        toast.success("Course is Enrolled Successfully", {
          id: toastId,
          style: {
            padding: "16px",
            borderRadius: "8px",
            fontSize: "16px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
          className: "class",
        });
      }
    } catch (error) {
      toast.error("Something went wrong", {
        id: toastId,
        style: {
          padding: "16px",
          borderRadius: "8px",
          fontSize: "16px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
        className: "class",
      });
    }
  };
  if (!modifiedData.length) {
    return <p>No available courses</p>;
  }
  return (
    <Row gutter={[16, 24]} style={{ padding: "16px", background: "#f9f9f9" }}>
      {modifiedData.map((item) => (
        <Col
          span={24}
          key={item.courseTitle}
          style={{
            background: "#ffffff",
            borderRadius: "8px",
            padding: "16px",
          }}
        >
          <Title
            level={4}
            style={{ borderBottom: "2px solid #1890ff", paddingBottom: "8px" }}
          >
            {item.courseTitle}
          </Title>

          {item.sections.map((section: any, index: number) => (
            <Row
              key={index}
              justify="space-between"
              align="middle"
              style={{
                padding: "12px 0",
                borderBottom:
                  index !== item.sections.length - 1
                    ? "1px solid #eaeaea"
                    : "none",
              }}
            >
              <Col span={5}>
                <Text strong>Section:</Text> {section.section}
              </Col>
              <Col span={5}>
                <Text strong>Days:</Text>{" "}
                <Space>
                  {section.days.map((day: string, i: number) => (
                    <Text key={i}>{day}</Text>
                  ))}
                </Space>
              </Col>
              <Col span={5}>
                <Text strong>Start:</Text> {section.startTime}
              </Col>
              <Col span={5}>
                <Text strong>End:</Text> {section.endTime}
              </Col>
              <Col>
                <Button
                  onClick={() => handleEnroll(section._id)}
                  type="primary"
                  size="small"
                >
                  Enroll
                </Button>
              </Col>
            </Row>
          ))}
        </Col>
      ))}
    </Row>
  );
};
export default OfferedCourses;
