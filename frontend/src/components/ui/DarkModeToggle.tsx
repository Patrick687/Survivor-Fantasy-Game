import { useEffect, useState } from "react";
import CircleButton from "./CircleButton";
import { HiMoon, HiSun } from "react-icons/hi";

export default function DarkModeToggle({ className = "" }: { className?: string; }) {
    const [dark, setDark] = useState(() =>
        typeof window !== "undefined"
            ? document.documentElement.classList.contains("dark")
            : false
    );

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [dark]);

    return (
        <CircleButton
            icon={dark ? (
                <HiSun className="h-full w-full" />
            ) : (
                <HiMoon className="h-full w-full" />
            )}
            aria-label="Toggle dark mode"
            onClick={() => setDark((d) => !d)}
            color={dark ? "pacific-blue" : "pearl-aqua"}
            variant="neutral"
            className={className}
        >
            {/* children prop required by CircleButton */}
            {/* Provide empty children */}
            <></>
        </CircleButton>
    );
}
