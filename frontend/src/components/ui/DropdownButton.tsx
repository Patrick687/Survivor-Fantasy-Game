import { useRef, useEffect, useState, type ReactNode } from "react";
import Button from "./Button";

interface DropdownButtonProps {
    avatar?: ReactNode;
    menu: ReactNode;
    className?: string;
    buttonClassName?: string;
    ariaLabel?: string;
}

export default function DropdownButton({
    avatar,
    menu,
    className = "",
    buttonClassName = "",
    ariaLabel = "Open profile menu",
}: DropdownButtonProps) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        if (open) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                className={`w-10 h-10 rounded-full bg-pearl-aqua-300 dark:bg-pearl-aqua-700 flex items-center justify-center border-2 border-pacific-blue-500 dark:border-pacific-blue-300 focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-pacific-blue-400 shadow transition hover:scale-105 ${buttonClassName}`}
                onClick={() => setOpen((v) => !v)}
                aria-label={ariaLabel}
                type="button"
            >
                {avatar}
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-44 bg-pearl-aqua-50 dark:bg-pacific-blue-800 rounded-xl shadow-lg z-30 border border-pearl-aqua-200 dark:border-pacific-blue-700 animate-fade-in p-0">
                    {/* Subtle shadow, slightly lighter/darker shade for dropdown */}
                    {menu}
                </div>
            )}
        </div>
    );
}
