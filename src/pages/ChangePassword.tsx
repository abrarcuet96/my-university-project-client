import { Button, Row } from "antd";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AHFrom from "../components/form/AHForm";
import AHInput from "../components/form/AHInput";
import { useChangePasswordMutation } from "../redux/features/admin/userManagment.api";
import { logout } from "../redux/features/auth/authSlice";
import { useAppDispatch } from "../redux/hooks";
import { TResponse } from "../types";
const ChangePassword = () => {
  const [changePassword] = useChangePasswordMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading("Changing Password...", {
      style: {
        padding: "16px",
        borderRadius: "8px",
        fontSize: "16px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      },
      className: "class",
    });

    try {
      const res = (await changePassword(data)) as TResponse<any>;
      if (res?.data?.success) {
        dispatch(logout());
        navigate("/login");
        toast.success("Password is changed successfully", {
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
        toast.error("Sorry! Can't change password", {
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
    <Row
      justify="center"
      align="middle"
      style={{
        height: "100vh",
      }}
    >
      <div
        style={{
          padding: "2rem",
          width: "100%",
          maxWidth: "400px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Login</h2>
        <AHFrom onSubmit={onSubmit}>
          <AHInput type="text" name="oldPassword" label="Old Password:" />
          <AHInput type="password" name="newPassword" label="New Password:" />
          <Button
            htmlType="submit"
            type="primary"
            style={{
              padding: "0.8rem",
              borderRadius: "5px",
              fontWeight: "bold",
              background: "#0E86D4",
              border: "none",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
          >
            Login
          </Button>
        </AHFrom>
      </div>
    </Row>
  );
};
export default ChangePassword;
