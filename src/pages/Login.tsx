import { Button, Row } from "antd";
import { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AHFrom from "../components/form/AHForm";
import AHInput from "../components/form/AHInput";
import { useLoginMutation } from "../redux/features/auth/authApi";
import { setUser, TUser } from "../redux/features/auth/authSlice";
import { useAppDispatch } from "../redux/hooks";
import { verifyToken } from "../utils/verifyToken";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const { register, handleSubmit } = useForm({
  //   defaultValues: {
  //     id: "A-0001",
  //     password: "admin123",
  //   },
  // });
  const defaultValues = {
    id: "A-0001",
    password: "admin123",
  };
  const [login] = useLoginMutation();

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading("Logging in ...", {
      style: {
        padding: "16px",
        borderRadius: "8px",
        fontSize: "16px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      },
      className: "class",
    });

    try {
      const userInfo = {
        id: data.id,
        password: data.password,
      };
      const res = await login(userInfo).unwrap();
      const user = verifyToken(res.data.accessToken) as TUser;
      console.log(user);

      dispatch(setUser({ user: user, token: res.data.accessToken }));
      toast.success("Logged in successfully!", {
        id: toastId,
        duration: 2000,
        style: {
          padding: "16px",
          borderRadius: "8px",
          fontSize: "16px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
        className: "class",
      });
      navigate(`/${user.userRole}/dashboard`);
    } catch (error) {
      toast.error(`Something went wrong: ${error}`, {
        id: toastId,
        duration: 2000,
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
        <AHFrom onSubmit={onSubmit} defaultValues={defaultValues}>
          <AHInput type="text" name="id" label="ID:" />
          <AHInput type="password" name="password" label="Password:" />
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
export default Login;
