import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { loggedIn, setLoggedIn, user, setUser, setApi, api } =
        useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (loggedIn && user) {
            navigate(`/Stocks`);
        }
    }, [loggedIn, user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Both fields are required.");
            return;
        }

        setError("");

        try {
            const response = await fetch("http://localhost:8080/api/users");
            if (response.ok) {
                const users = await response.json();
                const foundUser = users.find(
                    (u) => u.username === username && u.password === password
                );
                if (foundUser) {
                    setLoggedIn(true); // Update global state
                    setUser(foundUser); // Set the user in global state
                    navigate(`/Stocks`);
                } else {
                    setError("Invalid credentials.");
                }
            } else {
                setError("Failed to fetch user data.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            setError("Something went wrong. Please try again.");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Both fields are required.");
            return;
        }

        setError("");

        try {
            const response = await fetch("http://localhost:8080/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const newUser = await response.json();
                setLoggedIn(true); // Update global state
                setUser(newUser.user); // Set the user in global state
                navigate(`/Stocks`);
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Registration failed.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-sm bg-white p-6 rounded shadow-md">
                <h4 className="text-xl font-bold mb-4 text-center">
                    Simple Portfolio Tracker
                </h4>
                {error && (
                    <div className="text-red-600 mb-4 text-center">{error}</div>
                )}
                <form>
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            autoComplete="off"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            API
                        </label>
                        <input
                            type="text"
                            id="api"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={api}
                            onChange={(e) => setApi(e.target.value)}
                            placeholder="Enter your Twelve Data API key"
                        />
                    </div>
                    <div className="flex justify-between gap-2">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200 w-full"
                            onClick={handleLogin}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-200 w-full"
                            onClick={handleRegister}
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
