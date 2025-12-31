import React from "react";


// Only allow palette color names from tailwind.config.js
export type ColorName =
    | "pearl-aqua"
    | "pacific-blue"
    | "dusty-grape"
    | "dark-amethyst"
    | "midnight-violet"
    | "primary"
    | "background"
    | "surface"
    | "border"
    | "text";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "danger"
    | "success"
    | "info"
    | "neutral"
    | "custom";
    color?: ColorName; // for custom palette, e.g. 'pacific-blue'
    shade?: number; // for custom palette, e.g. 500
    padding?: string; // Tailwind padding classes, e.g. 'py-2 px-4'
    children: React.ReactNode;
    loading?: boolean;
    loadingText?: React.ReactNode;
}



export default function Button({
    variant = "primary",
    color = "pacific-blue",
    shade = 500,
    children,
    className = "",
    loading = false,
    loadingText = "Loading...",
    padding,
    ...props
}: ButtonProps) {
    const base =
        "font-bold rounded transition shadow focus:outline-none focus:ring-2 focus:ring-offset-2 ";
    let style = "";
    // Use custom padding if provided, else default
    const sizeClass = padding ? padding : "py-2 px-4 w-full";

    if (variant === "primary") {
        style =
            "bg-pacific-blue-500 hover:bg-pacific-blue-700 text-white dark:bg-pacific-blue-700 dark:hover:bg-pacific-blue-500";
    } else if (variant === "secondary") {
        style =
            "bg-midnight-violet-500 hover:bg-midnight-violet-700 text-white dark:bg-midnight-violet-700 dark:hover:bg-midnight-violet-500";
    } else if (variant === "accent") {
        style =
            "bg-dark-amethyst-500 hover:bg-dark-amethyst-700 text-white dark:bg-dark-amethyst-700 dark:hover:bg-dark-amethyst-500";
    } else if (variant === "neutral") {
        style =
            "bg-pearl-aqua-100 hover:bg-pearl-aqua-200 text-pacific-blue-900 dark:bg-pearl-aqua-800 dark:hover:bg-pearl-aqua-700 dark:text-pearl-aqua-50";
    } else if (variant === "custom" && color) {
        style = `bg-${color}-${shade} hover:bg-${color}-${shade + 200} text-white`;
    } else {
        style = "bg-gray-400 text-white";
    }

    if (props.disabled || loading) {
        style +=
            " opacity-60 cursor-not-allowed pointer-events-none hover:bg-pacific-blue-500 dark:hover:bg-pacific-blue-700";
    }

    return (
        <button
            className={`${base} ${sizeClass} ${style} ${className}`}
            disabled={props.disabled || loading}
            {...props}
        >
            {loading ? loadingText : children}
        </button>
    );
}
