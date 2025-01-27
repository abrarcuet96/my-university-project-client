/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Col, Flex } from "antd";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import AHFrom from "../../../components/form/AHForm";
import AHInput from "../../../components/form/AHInput";
import AHSelect, { TOptions } from "../../../components/form/AHSelect";
import {
  useAddAcademicDepartmentMutation,
  useGetAllAcademicFacultiesQuery,
} from "../../../redux/features/admin/academicManagement.api";
import { TResponse } from "../../../types";
import { TAcademicDepartment } from "../../../types/academicManagement.type";

type TResponseData = Pick<TAcademicDepartment, "name" | "academicFaculty">;

const CreateAcademicDepartment = () => {
  const [addAcademicDepartment] = useAddAcademicDepartmentMutation();
  const { data: facultyData, isLoading } =
    useGetAllAcademicFacultiesQuery(undefined);

  const facultyOptions = facultyData?.data?.map((item) => ({
    value: item._id,
    label: item.name,
  })) as TOptions[];

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
  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <Flex justify="center" align="center">
      <Col span={6}>
        <AHFrom
          onSubmit={onSubmit}
          // resolver={zodResolver(academicSemesterSchema)}
        >
          <AHInput type="text" name="name" label="Academic Department Name:" />
          <AHSelect
            label="Academic Faculty:"
            name="academicFaculty"
            options={facultyOptions}
          />

          <Button htmlType="submit">Submit</Button>
        </AHFrom>
      </Col>
    </Flex>
  );
};
export default CreateAcademicDepartment;
