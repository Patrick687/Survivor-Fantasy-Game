import React from "react";
import Button, { type ButtonProps } from "./Button";

interface CircleButtonProps extends Omit<ButtonProps, "size"> {
    icon: React.ReactNode;
    "aria-label": string;
    className?: string;
}

export default function CircleButton({ icon, className = "", ...props }: CircleButtonProps) {
    return (
        <button
            type="button"
            className={`w-10 h-10 rounded-full flex items-center justify-center focus:outline-none ${className}`}
            {...props}
        >
            {/* Make icon fill the button */}
            {icon && (
                <span className="w-6 h-6 flex items-center justify-center">
                    {icon}
                </span>
            )}
        </button>
    );
}
