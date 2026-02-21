import type React from "react";
import { FaUsers } from "react-icons/fa6";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { useState } from "react";

const SideNavBar: React.FC = () => {

    const isAuthenticated = useSelector((state: RootState) => state.auth.isAutheticated);
    const [activeNav, setActiveNav] = useState<'leagues' | 'other'>('leagues');

    return (
        <>
            {/* Vertical sidebar for md+ screens */}
            <aside className="hidden md:flex flex-col w-14 bg-pearl-aqua-100 dark:bg-pacific-blue-900 border-r border-pearl-aqua-200 dark:border-pacific-blue-800 py-1 items-center space-y-2 transition-colors">
                <button
                    className={`p-3 rounded-lg hover:bg-pearl-aqua-200 dark:hover:bg-pacific-blue-800 transition-colors ${activeNav === 'leagues' ? 'bg-pearl-aqua-300 dark:bg-pacific-blue-700' : ''}`}
                    title="Leagues"
                    onClick={() => setActiveNav('leagues')}
                >
                    <FaUsers size={24} />
                </button>
            </aside>
            {/* Horizontal nav for small screens, fixed to bottom */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden flex-row justify-around items-center h-14 bg-pearl-aqua-100 dark:bg-pacific-blue-900 border-t border-pearl-aqua-200 dark:border-pacific-blue-800 transition-colors">
                <button
                    className={`p-3 rounded-lg hover:bg-pearl-aqua-200 dark:hover:bg-pacific-blue-800 transition-colors ${activeNav === 'leagues' ? 'bg-pearl-aqua-300 dark:bg-pacific-blue-700' : ''}`}
                    title="Leagues"
                    onClick={() => setActiveNav('leagues')}
                >
                    <FaUsers size={24} />
                </button>
            </nav>
        </>
    );
};

export default SideNavBar;