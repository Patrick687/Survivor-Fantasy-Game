import React, { useRef } from "react";
import { FaCircleExclamation } from "react-icons/fa6";

import { useClickOutside } from "./useClickOutside";

interface ErrorIconWithOverlayProps {
    id?: string;
    showOverlay: boolean;
    locked: boolean;
    setShowOverlay: (show: boolean) => void;
    setLocked: (locked: boolean | ((prev: boolean) => boolean)) => void;
}

const ErrorIconWithOverlay: React.FC<ErrorIconWithOverlayProps> = ({
    id,
    showOverlay,
    locked,
    setShowOverlay,
    setLocked,
}) => {
    // Show overlay on hover/focus only if not locked
    const iconRef = useRef<HTMLSpanElement>(null);
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
    // Use custom hook for click outside
    useClickOutside([
        iconRef as React.RefObject<HTMLElement>
    ], () => {
        setLocked(false);
        setShowOverlay(false);
    }, locked);

    return (
        <div className="relative ml-2 flex items-center">
            <span ref={iconRef as React.RefObject<HTMLElement>}>
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
            </span>
        </div>
    );
};

export default ErrorIconWithOverlay;
