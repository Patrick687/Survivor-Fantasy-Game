import React from "react";
import { FaCircleExclamation } from "react-icons/fa6";

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

        // Show overlay on hover/focus only if not locked
        const handleMouseEnter = () => {
            if (!locked) setShowOverlay(true);
        };
        const handleMouseLeave = () => {
            if (!locked) setShowOverlay(false);
        };
        // Toggle lock on click
        const handleIconClick = (e: React.MouseEvent) => {
            e.preventDefault();
            setLocked((prev) => {
                const newLocked = !prev;
                setShowOverlay(newLocked);
                return newLocked;
            });
        };
        // Unlock overlay if clicking outside
        React.useEffect(() => {
            if (!locked) return;
            const handleClickOutside = (e: MouseEvent) => {
                // Only close if click is outside the icon or overlay
                const icon = document.getElementById(`forminput-error-icon-${id}`);
                const overlay = document.getElementById(`forminput-error-overlay-${id}`);
                if (
                    icon && !icon.contains(e.target as Node) &&
                    overlay && !overlay.contains(e.target as Node)
                ) {
                    setLocked(false);
                    setShowOverlay(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, [locked, id]);
        const labelText = label?.text?.trim();
        const labelTextSize = label?.textSize || 'text-sm';
        const labelColor = label?.color || 'text-pacific-blue-900 dark:text-pearl-aqua-100';

        const errorText = error?.text?.trim();
        const errorTextSize = error?.textSize || 'text-xs';
        const errorColor = error?.color || 'text-red-500';

        return (
            <div className="mb-4 text-lg relative">
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
                            <div className="relative ml-2 flex items-center">
                                <FaCircleExclamation
                                    id={`forminput-error-icon-${id}`}
                                    className="text-red-500 cursor-pointer"
                                    tabIndex={0}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    onFocus={handleMouseEnter}
                                    onBlur={handleMouseLeave}
                                    onClick={handleIconClick}
                                    aria-label="Show error message"
                                />
                            </div>
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
                    {/* Overlay error message */}
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
