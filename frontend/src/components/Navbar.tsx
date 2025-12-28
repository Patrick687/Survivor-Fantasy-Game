// src/components/Navbar.tsx
import { Link } from "react-router-dom";
import { useState } from "react";
import Button from "./ui/Button";
import DropdownButton from "./ui/DropdownButton";
import DarkModeToggle from "./ui/DarkModeToggle";

export default function Navbar() {
    // TODO: Replace with real auth state
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    // Dropdown open/close state is now managed in DropdownButton

    return (
        <nav className="bg-pearl-aqua-100 dark:bg-pacific-blue-950 border-b border-pearl-aqua-300 dark:border-pacific-blue-800 px-4 py-2 flex items-center justify-between shadow">
            <div className="flex items-center">
                <Link to="/" className="font-bold text-xl text-dark-amethyst-700 dark:text-dark-amethyst-200">Survivor Fantasy</Link>
            </div>
            <div className="flex items-center gap-4">
                <DarkModeToggle className="mr-2" />
                {!isAuthenticated ? (
                    <>
                        <Link to="/login" className="text-pacific-blue-700 dark:text-pacific-blue-200 font-semibold hover:underline px-2 py-2 focus:outline-none focus:underline transition">
                            Sign In
                        </Link>
                        <Link to="/signup">
                            <Button variant="primary">Sign Up</Button>
                        </Link>
                    </>
                ) : (
                    <DropdownButton
                        avatar={
                            <span className="text-lg font-bold text-pacific-blue-900 dark:text-pacific-blue-100">P</span>
                        }
                        menu={
                            <>
                                <Button
                                    variant="neutral"
                                    className="block w-full text-left px-4 py-2 rounded hover:bg-pearl-aqua-100 dark:hover:bg-pacific-blue-800 transition"
                                    onClick={() => setIsAuthenticated(false)}
                                >
                                    Profile
                                </Button>
                                <Button
                                    variant="neutral"
                                    className="block w-full text-left px-4 py-2 rounded hover:bg-pearl-aqua-100 dark:hover:bg-pacific-blue-800 transition"
                                    onClick={() => setIsAuthenticated(false)}
                                >
                                    Logout
                                </Button>
                            </>
                        }
                        className=""
                        buttonClassName=""
                        ariaLabel="Open profile menu"
                    />
                )}
            </div>
        </nav>
    );
}