import { Route, Routes } from "react-router-dom";
import SplashPage from "../components/page/SplashPage";
import LoginForm from "../components/page/loginPage/LoginForm";

function AppRouter() {

    return (
        <Routes>
            <Route path="/" element={<SplashPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<p>Signup Page</p>} />
        </Routes>
    );
}

export default AppRouter;