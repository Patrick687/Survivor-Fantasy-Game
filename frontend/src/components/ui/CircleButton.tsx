import React from "react";
import Button, { type ButtonProps } from "./Button";

interface CircleButtonProps extends Omit<ButtonProps, "size"> {
    icon: React.ReactNode;
    "aria-label": string;
    className?: string;
}

export default function CircleButton({ icon, className = "", ...props }: CircleButtonProps) {
    return (
        <Button
            {...props}
            className={`rounded-full p-0 w-10 h-10 flex items-center justify-center shadow focus:outline-none focus:ring-2 focus:ring-offset-2 transition ${className}`}
            size={undefined}
        >
            {icon}
        </Button>
    );
}
