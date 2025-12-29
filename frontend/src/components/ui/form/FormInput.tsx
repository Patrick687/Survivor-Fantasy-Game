import React from "react";
import ErrorIconWithOverlay from "./ErrorIconWithOverlay";
import FormLabel from "./FormLabel";

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
        const [showOverlay, setShowOverlay] = React.useState(false);
        const [locked, setLocked] = React.useState(false);

        const errorText = error?.text?.trim();

        const labelText = label?.text?.trim();
        const labelTextSize = label?.textSize || 'text-sm';
        const labelColor = errorText ? 'text-red-500' : (label?.color || 'text-pacific-blue-900 dark:text-pearl-aqua-100');


        return (
            <div className="mb-4 text-lg relative">
                {(labelText || errorText) && (
                    <div className="flex items-center justify-between mb-1">
                        {labelText && (
                            <FormLabel htmlFor={id} text={labelText} textSize={labelTextSize} color={labelColor} />
                        )}
                        {errorText && (
                            <ErrorIconWithOverlay
                                id={id}
                                showOverlay={showOverlay}
                                locked={locked}
                                setShowOverlay={setShowOverlay}
                                setLocked={setLocked}
                            />
                        )}
                    </div>
                )}
                <div className="relative">
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
                    {/* Overlay error message rendered over the input, not inside the icon */}
                    {errorText && showOverlay && (
                        <div
                            id={`forminput-error-overlay-${id}`}
                            className="absolute left-0 top-0 z-30 w-full rounded-lg bg-red-600 text-white px-4 py-2 text-sm shadow-xl animate-fade-in pointer-events-auto whitespace-pre-line"
                            style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            {errorText}
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

FormInput.displayName = "FormInput";

export default FormInput;
