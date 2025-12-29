import React from "react";

interface FormLabelProps {
    htmlFor?: string;
    text: string;
    textSize?: string;
    color?: string;
}

const FormLabel: React.FC<FormLabelProps> = ({ htmlFor, text, textSize = 'text-sm', color = 'text-pacific-blue-900 dark:text-pearl-aqua-100' }) => (
    <label
        htmlFor={htmlFor}
        className={`block font-medium ${color} ${textSize}`}
    >
        {text}
    </label>
);

export default FormLabel;
