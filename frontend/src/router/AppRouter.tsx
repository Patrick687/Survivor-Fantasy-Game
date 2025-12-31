import { Route, Routes } from "react-router-dom";
import LoginForm from "../components/page/loginPage/LoginForm";
import SignupForm from "../components/page/signupPage/SignupForm";
import HomePage from "../components/page/homePage/HomePage";

function AppRouter() {

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
        </Routes>
    );
}

export default AppRouter;