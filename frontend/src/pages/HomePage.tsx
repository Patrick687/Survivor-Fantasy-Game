import type React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import UserHomePage from "./UserHomePage";
import SplashPage from "./SplashPage";
const HomePage: React.FC = () => {
    const authState = useSelector((state: RootState) => state.auth);

    return authState.isAutheticated ? <UserHomePage /> : <SplashPage />;
};

export default HomePage;