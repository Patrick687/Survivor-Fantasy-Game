
import React from "react";



interface FormErrorProps {
    message?: string;
    loading: boolean;
    colorClassName?: string; // e.g. 'text-red-600', 'text-yellow-600'
    className?: string; // container className
    style?: React.CSSProperties; // container style
    textClassName?: string; // extra classes for text
}

export const FormError: React.FC<FormErrorProps> = ({ message, loading, colorClassName, className, style, textClassName }) => {
    return (
        <div
            className={`h-2 my-2 text-center text-sm font-medium flex items-center justify-center${className ? ` ${className}` : ''}`}
            aria-live="polite"
            style={{ minHeight: '1.5rem', ...style }}
        >
            {!loading && message ? (
                <span className={`${colorClassName || 'text-red-600'}${textClassName ? ` ${textClassName}` : ''}`}>{message}</span>
            ) : null}
        </div>
    );
};