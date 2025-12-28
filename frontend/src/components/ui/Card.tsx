import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: "default" | "accent" | "info" | "success" | "danger" | "custom";
    color?:
    | "pearl-aqua"
    | "pacific-blue"
    | "dusty-grape"
    | "dark-amethyst"
    | "midnight-violet";
    shade?: number;
}

export default function Card({
    children,
    className = "",
    variant = "default",
    color = "pearl-aqua",
    shade = 100,
    ...props
}: CardProps) {
    let style =
        "rounded-xl shadow-lg p-8 flex flex-col items-center transition-colors ";
    let size = 'w-full h-full';
    if (variant === "accent") {
        style +=
            "bg-dark-amethyst-100 dark:bg-dark-amethyst-800 text-dark-amethyst-700 dark:text-dark-amethyst-100";
    } else if (variant === "info") {
        style +=
            "bg-pacific-blue-100 dark:bg-pacific-blue-800 text-pacific-blue-900 dark:text-pacific-blue-100";
    } else if (variant === "success") {
        style +=
            "bg-pearl-aqua-100 dark:bg-pearl-aqua-800 text-pearl-aqua-900 dark:text-pearl-aqua-100";
    } else if (variant === "danger") {
        style +=
            "bg-midnight-violet-100 dark:bg-midnight-violet-800 text-midnight-violet-900 dark:text-midnight-violet-100";
    } else if (variant === "custom" && color) {
        style += `bg-${color}-${shade} text-${color}-${shade + 700}`;
    } else {
        style +=
            "bg-surface dark:bg-midnight-violet-900 text-dusty-grape-900 dark:text-dusty-grape-100";
    }
    return (
        <div className={`${style} ${size} ${className}`} {...props}>
            {children}
        </div>
    );
}
