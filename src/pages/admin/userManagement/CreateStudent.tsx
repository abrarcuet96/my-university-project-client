/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  Col,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  Modal,
  Pagination,
  Row,
  Space,
  Table,
  TableColumnsType,
} from "antd";
import { useRef, useState } from "react";
import { Controller, FieldValues, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import AHDatePicker from "../../../components/form/AHDatePicker";
import AHForm from "../../../components/form/AHForm";
import AHInput from "../../../components/form/AHInput";
import AHSelect, { TOptions } from "../../../components/form/AHSelect";
import { bloodGroupOptions, genderOptions } from "../../../constants/global";
import {
  useGetAllAcademicDepartmentsQuery,
  useGetAllSemestersQuery,
} from "../../../redux/features/admin/academicManagement.api";
import {
  useAddStudentMutation,
  useGetAllStudentsQuery,
} from "../../../redux/features/admin/userManagment.api";
import { TQueryParam, TStudent } from "../../../types";
const studentDefaultValues = {
  name: {
    firstName: "I am ",
    middleName: "Student",
    lastName: "Number 1",
  },
  gender: "Male",

  bloogGroup: "A+",

  contactNo: "1235678",
  emergencyContactNo: "987-654-3210",
  presentAddress: "123 Main St, Cityville",
  permanentAddress: "456 Oak St, Townsville",

  guardian: {
    fatherName: "James Doe",
    fatherOccupation: "Engineer",
    fatherContactNo: "111-222-3333",
    motherName: "Mary Doe",
    motherOccupation: "Teacher",
    motherContactNo: "444-555-6666",
  },

  localGuardian: {
    name: "Alice Johnson",
    occupation: "Doctor",
    contactNo: "777-888-9999",
    address: "789 Pine St, Villageton",
  },

  admissionSemester: "65bb60ebf71fdd1add63b1c0",
  academicDepartment: "65b4acae3dc8d4f3ad83e416",
};
type TTableData = Pick<
  TStudent,
  "fullName" | "id" | "profileImage" | "contactNumber" | "email"
>;
const CreateStudent = () => {
  const [params] = useState<TQueryParam[]>([]);
  const [page, setPage] = useState(1);
  const {
    data: studentData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllStudentsQuery([
    { name: "page", value: page },
    { name: "sort", value: "id" },
    ...params,
  ]);
  const metaData = studentData?.meta;
  const tableData = studentData?.data?.map(
    ({ fullName, _id, id, profileImage, email, contactNumber }) => ({
      key: _id,
      fullName,
      id,
      profileImage,
      email,
      contactNumber,
    })
  );

  const [openResponsive, setOpenResponsive] = useState(false);
  const [addStudent, { error }] = useAddStudentMutation();
  console.log(error);

  const {
    data: admissionSemesterData,
    isLoading: admissionSemesterDataisLoading,
  } = useGetAllSemestersQuery(undefined);
  const admissionSemesterOptions = admissionSemesterData?.data?.map((item) => ({
    value: item._id,
    label: `${item.name} (${item.year})`,
  })) as TOptions[];
  const {
    data: academicDepartmentData,
    isLoading: academicDepartmentDataisLoading,
  } = useGetAllAcademicDepartmentsQuery(undefined);
  const academicDepartmentOptions = academicDepartmentData?.data?.map(
    (item) => ({
      value: item._id,
      label: item.name,
    })
  ) as TOptions[];
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
      const studentdata = {
        password: "stu123",
        student: data,
      };
      const formData = new FormData();
      formData.append("data", JSON.stringify(studentdata));
      formData.append("file", data.profileImage);

      const res = await addStudent(formData);

      if (res.error) {
        toast.error("Failed to create student", {
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
        toast.success("Student created", {
          id: toastId,
          style: {
            padding: "16px",
            borderRadius: "8px",
            fontSize: "16px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
          className: "class",
        });
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
  const formRef = useRef<any>();

  const handleOk = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
    setOpenResponsive(false);
  };

  const handleCancel = () => {
    setOpenResponsive(false);
  };
  const columns: TableColumnsType<TTableData> = [
    {
      title: "Image",
      key: "profileImage",
      dataIndex: "profileImage",
      render: (profileImage) => {
        return (
          <Image
            width={40}
            height={40}
            src={profileImage}
            style={{
              objectFit: "cover",
              borderRadius: "5px",
            }}
            alt="Profile"
            placeholder={
              <Image
                preview={false}
                src="/placeholder.png"
                width={40}
                height={40}
              />
            }
          />
        );
      },
    },
    {
      title: "Name",
      key: "fullName",
      dataIndex: "fullName",
    },
    {
      title: "Roll No.",
      key: "id",
      dataIndex: "id",
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
    },
    {
      title: "Contact No.",
      key: "contactNumber",
      dataIndex: "contactNumber",
    },

    {
      title: "Action",
      key: "x",
      render: (item) => {
        return (
          <Space>
            <Link to={`/admin/students/${item.key}`}>
              <Button>Details</Button>
            </Link>

            <Button>Update</Button>
          </Space>
        );
      },
      width: "1%",
    },
  ];

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <Flex justify="end" style={{ marginBottom: "16px" }}>
        <Button type="primary" onClick={() => setOpenResponsive(true)}>
          Create New
        </Button>
      </Flex>
      <Modal
        centered
        open={openResponsive}
        onOk={handleOk}
        onCancel={handleCancel}
        style={{
          margin: "10px",
        }}
        width={{
          xs: "90%",
          sm: "80%",
          md: "70%",
          lg: "70%",
          xl: "70%",
          xxl: "70%",
        }}
      >
        <Flex>
          <Row>
            <Col span={24}>
              <AHForm
                ref={formRef}
                onSubmit={onSubmit}
                defaultValues={studentDefaultValues}
              >
                <Divider>Personal Information</Divider>
                <Row gutter={8}>
                  <Col span={24} lg={{ span: 8 }} md={{ span: 12 }}>
                    <AHInput
                      type="text"
                      name="name.firstName"
                      label="First Name"
                    />
                  </Col>
                  <Col span={24} lg={{ span: 8 }} md={{ span: 12 }}>
                    <AHInput
                      type="text"
                      name="name.middleName"
                      label="Middle Name"
                    />
                  </Col>
                  <Col span={24} lg={{ span: 8 }} md={{ span: 12 }}>
                    <AHInput
                      type="text"
                      name="name.lastName"
                      label="Last Name"
                    />
                  </Col>
                  <Col span={24} lg={{ span: 8 }} md={{ span: 12 }}>
                    <AHSelect
                      label="Gender"
                      name="gender"
                      options={genderOptions}
                    />
                  </Col>
                  <Col span={24} lg={{ span: 8 }} md={{ span: 12 }}>
                    <AHDatePicker name="dateOfBirth" label="Date of Birth" />
                  </Col>
                  <Col span={24} lg={{ span: 8 }} md={{ span: 12 }}>
                    <AHSelect
                      label="Blood Group"
                      name="bloodGroup"
                      options={bloodGroupOptions}
                    />
                  </Col>
                  <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
                    <Controller
                      name="image"
                      render={({ field: { onChange, value, ...field } }) => (
                        <Form.Item label="Picture">
                          <Input
                            type="file"
                            value={value?.fileName}
                            {...field}
                            onChange={(e) => onChange(e.target.files?.[0])}
                          />
                        </Form.Item>
                      )}
                    />
                  </Col>
                </Row>
                <Divider>Contact Information</Divider>
                <Row gutter={8}>
                  <Col span={24} lg={{ span: 8 }} md={{ span: 12 }}>
                    <AHInput type="text" name="email" label="Email" />
                  </Col>
                  <Col span={24} lg={{ span: 8 }} md={{ span: 12 }}>
                    <AHInput
                      type="text"
                      name="contactNumber"
                      label="Contact Number"
                    />
                  </Col>
                  <Col span={24} lg={{ span: 8 }} md={{ span: 12 }}>
                    <AHInput
                      type="text"
                      name="emergencyContactNo"
                      label="Emergency Contact No"
                    />
                  </Col>
                  <Col span={24} lg={{ span: 8 }} md={{ span: 12 }}>
                    <AHInput
                      type="text"
                      name="presentAddress"
                      label="Present Address"
                    />
                  </Col>
                  <Col span={24} lg={{ span: 8 }} md={{ span: 12 }}>
                    <AHInput
                      type="text"
                      name="permanentAddress"
                      label="Permanent Address"
                    />
                  </Col>
                </Row>
                <Divider>Guardian Information</Divider>
                <Row gutter={8}>
                  <Col span={24} lg={{ span: 8 }} md={{ span: 12 }}>
                    <AHInput
                      type="text"
                      name="guardian.fatherName"
                      label="Father Name"
                    />
                  </Col>
                  <Col span={24} lg={{ span: 8 }} md={{ span: 12 }}>
                    <AHInput
                      type="text"
                      name="guardian.fatherOccupation"
                      label="Father Occupation"
                    />
                  </Col>
                  <Col span={24} lg={{ span: 8 }} md={{ span: 12 }}>
                    <AHInput
                      type="text"
                      name="guardian.fatherContactNo"
                      label="Father Contact No"
                    />
                  </Col>
                  <Col span={24} lg={{ span: 8 }} md={{ span: 12 }}>
                    <AHInput
                      type="text"
                      name="guardian.motherName"
                      label="Mother Name"
                    />
                  </Col>
                  <Col span={24} lg={{ span: 8 }} md={{ span: 12 }}>
                    <AHInput
                      type="text"
                      name="guardian.motherOccupation"
                      label="Mother Occupation"
                    />
                  </Col>
                  <Col span={24} lg={{ span: 8 }} md={{ span: 12 }}>
                    <AHInput
                      type="text"
                      name="guardian.motherContactNo"
                      label="Mother Contact No"
                    />
                  </Col>
                </Row>
                <Divider>Local Guardian Information</Divider>
                <Row gutter={8}>
                  <Col span={24} lg={{ span: 8 }} md={{ span: 12 }}>
                    <AHInput
                      type="text"
                      name="localGuardian.name"
                      label="Name"
                    />
                  </Col>
                  <Col span={24} lg={{ span: 8 }} md={{ span: 12 }}>
                    <AHInput
                      type="text"
                      name="localGuardian.occupation"
                      label="Occupation"
                    />
                  </Col>
                  <Col span={24} lg={{ span: 8 }} md={{ span: 12 }}>
                    <AHInput
                      type="text"
                      name="localGuardian.contactNo"
                      label="Contact No"
                    />
                  </Col>
                  <Col span={24} lg={{ span: 8 }} md={{ span: 12 }}>
                    <AHInput
                      type="text"
                      name="localGuardian.address"
                      label="Address"
                    />
                  </Col>
                </Row>
                <Divider>Academic Information</Divider>
                <Row gutter={8}>
                  <Col span={24} lg={{ span: 8 }} md={{ span: 12 }}>
                    <AHSelect
                      label="Admission Semester:"
                      name="admissionSemester"
                      options={admissionSemesterOptions}
                      disabled={admissionSemesterDataisLoading}
                    />
                  </Col>
                  <Col span={24} lg={{ span: 8 }} md={{ span: 12 }}>
                    <AHSelect
                      label="Academic Department:"
                      name="academicDepartment"
                      options={academicDepartmentOptions}
                      disabled={academicDepartmentDataisLoading}
                    />
                  </Col>
                </Row>
              </AHForm>
            </Col>
          </Row>
        </Flex>
      </Modal>
      <Table
        loading={isFetching}
        columns={columns}
        dataSource={tableData}
        showSorterTooltip={{ target: "sorter-icon" }}
        pagination={false}
      />
      <Flex justify="center" align="center" style={{ marginTop: "16px" }}>
        <Pagination
          current={page}
          total={metaData?.total}
          pageSize={metaData?.limit}
          onChange={(value) => setPage(value)}
        />
      </Flex>
    </div>
  );
};
export default CreateStudent;
