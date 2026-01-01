import type React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

const UserHomePage: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    return (
        <>
            <div id='welcome-section' className="text-center max-w-lg">
                <h1 className="text-3xl text-dark-amethyst-300">Welcome {user?.userName}!</h1>
            </div>

        </>
    );
};

export default UserHomePage;