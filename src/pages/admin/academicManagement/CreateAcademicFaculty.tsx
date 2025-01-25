/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Col, Flex } from "antd";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import AHFrom from "../../../components/form/AHForm";
import AHInput from "../../../components/form/AHInput";
import { useAddAcademicFacultyMutation } from "../../../redux/features/admin/academicManagement.api";
import { academicFacultySchema } from "../../../schemas/academicManagement.schema";
import { TResponse } from "../../../types";
import { TAcademicFaculty } from "../../../types/academicManagement.type";

type TResponseData = Pick<TAcademicFaculty, "name">;

const CreateAcademicFaculty = () => {
  const [addAcademicFaculty] = useAddAcademicFacultyMutation();
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log(data);
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
      const res = (await addAcademicFaculty(data)) as TResponse<TResponseData>;
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
        toast.success("Faculty created", {
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
    <Flex justify="center" align="center">
      <Col span={6}>
        <AHFrom
          onSubmit={onSubmit}
          resolver={zodResolver(academicFacultySchema)}
        >
          <AHInput type="text" name="name" label="Academic Faculty Name:" />
          <Button htmlType="submit">Submit</Button>
        </AHFrom>
      </Col>
    </Flex>
  );
};
export default CreateAcademicFaculty;
