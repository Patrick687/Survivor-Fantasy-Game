import React from "react";

interface FormContainerProps {
    children: React.ReactNode;
    className?: string;
    maxWidth?: string; // e.g. 'max-w-md', 'max-w-lg', etc.
    padding?: string; // e.g. 'p-8', 'p-4', etc.
}

const FormContainer: React.FC<FormContainerProps> = ({
    children,
    className = "",
    maxWidth = "max-w-lg",
    padding = "p-8",
}) => (
    <div className={`flex flex-col m-auto w-full ${maxWidth} ${padding} bg-white dark:bg-pacific-blue-950 rounded-lg shadow-lg ${className}`}>
        {children}
    </div>
);

export default FormContainer;
