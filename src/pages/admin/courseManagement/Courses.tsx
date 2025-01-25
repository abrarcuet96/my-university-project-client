import { Button, Modal, Table, TableColumnsType } from "antd";
import { useRef, useState } from "react";
import { toast } from "sonner";
import AHForm from "../../../components/form/AHForm";
import AHSelect from "../../../components/form/AHSelect";
import {
  useAddFacultiesMutation,
  useGetAllCoursesQuery,
} from "../../../redux/features/admin/courseManagement.api";
import { useGetAllFacultiesQuery } from "../../../redux/features/admin/userManagment.api";
import { TCourse } from "../../../types";

type TTableData = Pick<TCourse, "title" | "code" | "prefix">;
// const items: MenuProps["items"] = [
//   {
//     label: "Upcoming",
//     key: "UPCOMING",
//   },
//   {
//     label: "Ongoing",
//     key: "ONGOING",
//   },
//   {
//     label: "Ended",
//     key: "ENDED",
//   },
// ];

const Courses = () => {
  // const [semesterId, setSemesterId] = useState("");
  const {
    data: courseData,
    isLoading,
    isFetching,
  } = useGetAllCoursesQuery(undefined);
  const tableData = courseData?.data?.map(({ title, code, _id, prefix }) => ({
    key: _id,
    title,
    code: `${prefix}${code}`,
  }));
  // const handleStatusUpdate = async (data) => {
  //   const toastId = toast.loading("Registering...", {
  //     style: {
  //       padding: "16px",
  //       borderRadius: "8px",
  //       fontSize: "16px",
  //       boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  //     },
  //     className: "class",
  //   });
  //   const updateData = {
  //     id: semesterId,
  //     data: {
  //       status: data.key,
  //     },
  //   };

  //   try {
  //     const res = await updateSemesterStatus(updateData);
  //     console.log(res);
  //     if (res.error) {
  //       toast.error("Oops! Something went wrong", {
  //         id: toastId,
  //         style: {
  //           padding: "16px",
  //           borderRadius: "8px",
  //           fontSize: "16px",
  //           boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  //         },
  //         className: "class",
  //       });
  //     } else {
  //       toast.success(res?.data?.message, {
  //         id: toastId,
  //         style: {
  //           padding: "16px",
  //           borderRadius: "8px",
  //           fontSize: "16px",
  //           boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  //         },
  //         className: "class",
  //       });
  //     }
  //   } catch (error) {
  //     toast.error("Something went wrong", {
  //       id: toastId,
  //       style: {
  //         padding: "16px",
  //         borderRadius: "8px",
  //         fontSize: "16px",
  //         boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  //       },
  //       className: "class",
  //     });
  //   }
  // };
  // const menuProps = {
  //   items,
  //   onClick: handleStatusUpdate,
  // };
  const columns: TableColumnsType<TTableData> = [
    {
      title: "Title",
      key: "title",
      dataIndex: "title",
    },
    {
      title: "Code",
      key: "code",
      dataIndex: "code",
    },
    {
      title: "Action",
      key: "x",
      render: (item) => {
        return <AddFacultyModal facultyInfo={item}></AddFacultyModal>;
      },
    },
  ];

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <Table<TTableData>
      loading={isFetching}
      columns={columns}
      dataSource={tableData}
      showSorterTooltip={{ target: "sorter-icon" }}
    />
  );
};

const AddFacultyModal = ({ facultyInfo }) => {
  const [addFaculties] = useAddFacultiesMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: facultiesData } = useGetAllFacultiesQuery(undefined);
  const facultiesOptions = facultiesData?.data?.map((item) => ({
    value: item._id,
    label: item.email,
  }));
  const formRef = useRef<any>();
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (formRef.current) {
      formRef.current.submit(); // Trigger form submission manually
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
    const facultyData = {
      courseId: facultyInfo.key,
      data,
    };

    try {
      const res = await addFaculties(facultyData);
      console.log(res);

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
          <AHSelect
            mode="multiple"
            name="faculties"
            label="Faculty"
            options={facultiesOptions}
          />
        </AHForm>
      </Modal>
    </>
  );
};
export default Courses;
