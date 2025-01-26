import { Button, Modal, Table } from "antd";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import AHForm from "../../components/form/AHForm";
import AHInput from "../../components/form/AHInput";
import {
  useAddMarkMutation,
  useGetAllFacultyCoursesQuery,
} from "../../redux/features/faculty/facultyCourses.api";

const MyStudents = () => {
  const { registerSemisterId, courseId } = useParams();
  const { data: facultyCoursesData } = useGetAllFacultyCoursesQuery([
    {
      name: "semesterRegistration",
      value: registerSemisterId,
    },
    {
      name: "course",
      value: courseId,
    },
  ]);
  const tableData = facultyCoursesData?.data?.map(
    ({ _id, student, semesterRegistration, offeredCourse }) => ({
      key: _id,
      name: student.fullName,
      roll: student.id,
      semesterRegistration: semesterRegistration._id,
      student: student._id,
      offeredCourse: offeredCourse._id,
    })
  );
  const columns = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Roll",
      key: "roll",
      dataIndex: "roll",
    },
    {
      title: "Action",
      key: "x",
      render: (item) => {
        return <AddMarksModal studentInfo={item}></AddMarksModal>;
      },
    },
  ];

  return <Table columns={columns} dataSource={tableData} />;
};
const AddMarksModal = ({ studentInfo }) => {
  const [addMark] = useAddMarkMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formRef = useRef<any>();
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleSubmit = async (data) => {
    const toastId = toast.loading("Assigning...", {
      style: {
        padding: "16px",
        borderRadius: "8px",
        fontSize: "16px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      },
      className: "class",
    });
    const studentMark = {
      semesterRegistration: studentInfo.semesterRegistration,
      offeredCourse: studentInfo.offeredCourse,
      student: studentInfo.student,
      courseMarks: {
        ...data,
        classTest1: Number(data.classTest1),
        midTerm: Number(data.midTerm),
        classTest2: Number(data.classTest2),
        finalTerm: Number(data.finalTerm),
      },
    };

    try {
      const res = await addMark(studentMark);
      console.log(res);

      if (res.error) {
        toast.error(
          res?.error?.data?.errorSources.map((err) => {
            return (
              <div>
                <p>{`${err.path}: ${err.message}`}</p>
              </div>
            );
          }),
          {
            id: toastId,
            style: {
              padding: "16px",
              borderRadius: "8px",
              fontSize: "16px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            },
            className: "class",
          }
        );
      } else {
        toast.success(res?.data?.message, {
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
  return (
    <>
      <Button onClick={showModal}>Assign Faculty</Button>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <AHForm
          ref={formRef} // Reference the form
          onSubmit={handleSubmit}
        >
          <AHInput type="text" name="classTest1" label="Class Test 1" />
          <AHInput type="text" name="midTerm" label="Mid Term" />
          <AHInput type="text" name="classTest2" label="Class Test 2" />
          <AHInput type="text" name="finalTerm" label="Firnal Term" />
        </AHForm>
      </Modal>
    </>
  );
};
export default MyStudents;
