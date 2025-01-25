import { useParams } from "react-router-dom";

const StudentDetails = () => {
  const param = useParams();
  console.log(param);

  return <div>StudentDetails of {param.studentId}</div>;
};
export default StudentDetails;
