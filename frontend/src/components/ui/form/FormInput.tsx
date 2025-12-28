import React from "react";

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: {
        text: string,
        textSize?: 'text-xs' | 'text-sm' | 'text-md';
        color?: string;
    };
    error?: {
        text?: string,
        textSize?: 'text-xs' | 'text-sm' | 'text-md';
        color?: string;
    };
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, id, ...props }, ref) => {
        const labelText = label?.text?.trim();
        const labelTextSize = label?.textSize || 'text-sm';
        const labelColor = label?.color || 'text-pacific-blue-900 dark:text-pearl-aqua-100';

        const errorText = error?.text?.trim();
        const errorTextSize = error?.textSize || 'text-xs';
        const errorColor = error?.color || 'text-red-500';

        return (
            <div className="mb-4 text-lg">
                {(labelText || errorText) && (
                    <div className="flex items-center justify-between mb-1">
                        {labelText && (
                            <label
                                htmlFor={id}
                                className={`block font-medium ${labelColor} ${labelTextSize}`}
                            >
                                {labelText}
                            </label>
                        )}
                        {errorText && (
                            <div className={`${errorColor} ml-2 whitespace-nowrap ${errorTextSize}`}>
                                {errorText}
                            </div>
                        )}
                    </div>
                )}
                <input
                    id={id}
                    ref={ref}
                    {...props}
                    className={
                        `block w-full rounded border px-3 py-2 text-pacific-blue-900 dark:text-pearl-aqua-100 bg-pearl-aqua-50 dark:bg-pacific-blue-900 focus:outline-none focus:ring-2 focus:ring-pacific-blue-400 ` +
                        (errorText
                            ? 'border-red-500 focus:ring-red-400'
                            : 'border-pearl-aqua-300 dark:border-pacific-blue-700') +
                        (props.className ? ` ${props.className}` : '')
                    }
                />
            </div>
        );
    }
);

FormInput.displayName = "FormInput";

export default FormInput;
