import React, { useEffect } from "react";
import Stocks from "./pages/Stocks";
import Login from "./pages/Login";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useNavigate,
} from "react-router-dom";
import AuthProvider from "./AuthProvider";

const NotFound = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/");
    }, [navigate]); // Runs only once when the component is mounted

    return <h1 className="text-red-500 text-2xl">404: Page Not Found</h1>;
};
const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/Stocks" element={<Stocks />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
