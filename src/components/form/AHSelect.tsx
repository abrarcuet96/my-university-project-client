import { Form, Select } from "antd";
import { Controller } from "react-hook-form";

export type TOptions = {
  value: string;
  label: string;
  disabled?: boolean;
};
type TSelectProps = {
  name: string;
  label: string;
  options: TOptions[] | undefined;
  disabled?: boolean;
  mode?: "multiple" | undefined;
};
const AHSelect = ({ label, name, options, disabled, mode }: TSelectProps) => {
  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Form.Item label={label}>
          <Select
            mode={mode}
            style={{ width: "100%" }}
            {...field}
            options={options}
            size="large"
            disabled={disabled}
          />
          {error && <small style={{ color: "red" }}>{error.message}</small>}
        </Form.Item>
      )}
    />
  );
};
export default AHSelect;
