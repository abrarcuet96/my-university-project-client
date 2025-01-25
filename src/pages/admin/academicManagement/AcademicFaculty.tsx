/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Table, TableColumnsType, TableProps } from "antd";
import { useGetAllAcademicFacultiesQuery } from "../../../redux/features/admin/academicManagement.api";
import { TAcademicFaculty } from "../../../types/academicManagement.type";

type TTableData = Pick<TAcademicFaculty, "name">;
const AcademicFaculty = () => {
  const {
    data: facultyData,
    isLoading,
    isFetching,
  } = useGetAllAcademicFacultiesQuery(undefined);
  const tableData = facultyData?.data?.map(({ name }) => ({
    name,
  }));
  const columns: TableColumnsType<TTableData> = [
    {
      title: "Faculty Name",
      key: "name",
      dataIndex: "name",
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
  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <Table<TTableData>
      loading={isFetching}
      columns={columns}
      dataSource={tableData}
      onChange={onChange}
      showSorterTooltip={{ target: "sorter-icon" }}
    />
  );
};
export default AcademicFaculty;
