/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Col, Flex } from "antd";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import AHFrom from "../../../components/form/AHForm";
import AHSelect from "../../../components/form/AHSelect";
import { monthOptions } from "../../../constants/global";
import { semesterOptions } from "../../../constants/semester";
import { useAddAcademicSemesterMutation } from "../../../redux/features/admin/academicManagement.api";
import { academicSemesterSchema } from "../../../schemas/academicManagement.schema";
import { TAcademicSemester } from "../../../types/academicManagement.type";
import { TResponse } from "../../../types/global";

type TResponseData = Pick<
  TAcademicSemester,
  "code" | "name" | "year" | "startMonth" | "endMonth"
>;
const currentYear = new Date().getFullYear();
const yearOptions = [0, 1, 2, 3, 4].map((number) => ({
  value: String(currentYear + number),
  label: String(currentYear + number),
}));
const CretaeAcademicSemester = () => {
  const [addAcademicSemester] = useAddAcademicSemesterMutation();
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
    const name = semesterOptions[Number(data.name) - 1]?.label;
    const semesterData = {
      name,
      code: data.name,
      year: data.year,
      startMonth: data.startMonth,
      endMonth: data.endMonth,
    };
    try {
      const res = (await addAcademicSemester(
        semesterData
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
        toast.success("Semester created", {
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
      console.log(res);
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
          resolver={zodResolver(academicSemesterSchema)}
        >
          <AHSelect label="Name:" name="name" options={semesterOptions} />
          <AHSelect label="Year:" name="year" options={yearOptions} />
          <AHSelect
            label="Start Month:"
            name="startMonth"
            options={monthOptions}
          />
          <AHSelect label="End Month:" name="endMonth" options={monthOptions} />
          <Button htmlType="submit">Submit</Button>
        </AHFrom>
      </Col>
    </Flex>
  );
};
export default CretaeAcademicSemester;
