import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, id, ...props }, ref) => (
        <div>
            {label && (
                <label htmlFor={id}>
                    {label}
                </label>
            )}
            <input id={id} ref={ref} {...props} />
            {error && <div>{error}</div>}
        </div>
    )
);

Input.displayName = "Input";

export default Input;
