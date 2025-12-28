import React from "react";
import Button from "../Button";
import type { ButtonProps } from "../Button";

export interface FormButtonProps extends Omit<ButtonProps, "type"> { }

const FormButton: React.FC<FormButtonProps> = (props) => {
    return <Button type="submit" {...props} />;
};

export default FormButton;
