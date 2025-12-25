import { BrowserRouter, Route, Routes } from "react-router-dom";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<p>Login Page</p>} />
                <Route path="/signup" element={<p>Signup Page</p>} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;