import { Route, Routes } from "react-router-dom";
import SplashPage from "../components/page/SplashPage";
import LoginForm from "../components/page/loginPage/LoginForm";
import SignupForm from "../components/page/signupPage/SignupForm";

function AppRouter() {

    return (
        <Routes>
            <Route path="/" element={<SplashPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
        </Routes>
    );
}

export default AppRouter;