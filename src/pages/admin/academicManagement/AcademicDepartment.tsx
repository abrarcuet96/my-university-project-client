/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Col,
  Flex,
  Modal,
  Table,
  TableColumnsType,
  TableProps,
} from "antd";
import { useRef, useState } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import AHFrom from "../../../components/form/AHForm";
import AHInput from "../../../components/form/AHInput";
import AHSelect, { TOptions } from "../../../components/form/AHSelect";
import {
  useAddAcademicDepartmentMutation,
  useGetAllAcademicDepartmentsQuery,
  useGetAllAcademicFacultiesQuery,
} from "../../../redux/features/admin/academicManagement.api";
import { TResponse } from "../../../types";
import { TAcademicDepartment } from "../../../types/academicManagement.type";

type TResponseData = Pick<TAcademicDepartment, "name" | "academicFaculty">;
type TTableData = {
  key: string;
  name: string;
  academicFacultyName: string;
};

const AcademicDepartment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addAcademicDepartment] = useAddAcademicDepartmentMutation();
  const {
    data: departmentData,
    isFetching,
    refetch,
  } = useGetAllAcademicDepartmentsQuery(undefined);
  const { data: facultyData } = useGetAllAcademicFacultiesQuery(undefined);
  const facultyOptions = facultyData?.data?.map((item) => ({
    value: item._id,
    label: item.name,
  })) as TOptions[];

  const formRef = useRef<any>(); // Reference to the form

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (formRef.current) {
      formRef.current.submit(); // Trigger form submission manually
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const tableData = departmentData?.data?.map(
    ({ _id, name, academicFaculty }) => ({
      key: _id,
      name,
      academicFaculty,
    })
  );

  const newData: TTableData[] = [];
  tableData?.map((item) => {
    newData.push({
      key: item.key,
      name: item.name,
      academicFacultyName: item.academicFaculty.name,
    });
  });
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading("Creating...", {
      style: {
        padding: "16px",
        borderRadius: "8px",
        fontSize: "16px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      },
      className: "class",
    });

    try {
      const res = (await addAcademicDepartment(
        data
      )) as TResponse<TResponseData>;
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
        toast.success("Department created", {
          id: toastId,
          style: {
            padding: "16px",
            borderRadius: "8px",
            fontSize: "16px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
          className: "class",
        });
        setIsModalOpen(false); // Close modal on successful submission
        refetch();
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

  const columns: TableColumnsType<TTableData> = [
    {
      title: "Department Name",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Faculty Name",
      key: "academicFacultyName",
      dataIndex: "academicFacultyName",
    },
    {
      title: "Action",
      key: "x",
      render: () => {
        return (
          <div>
            <Button>Update</Button>
          </div>
        );
      },
    },
  ];

  const onChange: TableProps<TTableData>["onChange"] = (
    _pagination,
    _filters,
    _sorter,
    _extra
  ) => {};

  return (
    <div>
      <Flex justify="end" style={{ marginBottom: "16px" }}>
        <Button type="primary" onClick={showModal}>
          Create New
        </Button>
      </Flex>
      <Modal
        title="Add Academic Department"
        centered
        open={isModalOpen}
        onOk={handleOk} // Trigger form submission
        onCancel={handleCancel}
      >
        <Flex>
          <Col span={24}>
            <AHFrom
              ref={formRef} // Reference the form
              onSubmit={onSubmit}
            >
              <AHInput
                type="text"
                name="name"
                label="Academic Department Name:"
              />
              <AHSelect
                label="Academic Faculty:"
                name="academicFaculty"
                options={facultyOptions}
              />
            </AHFrom>
          </Col>
        </Flex>
      </Modal>
      <Table
        loading={isFetching}
        columns={columns}
        dataSource={newData}
        onChange={onChange}
        showSorterTooltip={{ target: "sorter-icon" }}
      />
    </div>
  );
};

export default AcademicDepartment;
