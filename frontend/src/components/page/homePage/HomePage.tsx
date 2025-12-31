import type React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import SplashPage from "./SplashPage";
import UserHomePage from "./UserHomePage";

const HomePage: React.FC = () => {
    const authState = useSelector((state: RootState) => state.auth);

    return authState.isAutheticated ? <UserHomePage /> : <SplashPage />;
};

export default HomePage;