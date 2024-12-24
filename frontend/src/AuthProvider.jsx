import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    // localStorage.removeItem("loggedIn");
    // localStorage.removeItem("user");
    // localStorage.removeItem("api");

    const [loggedIn, setLoggedIn] = useState(() => {
        // Retrieve the initial value from localStorage
        return JSON.parse(localStorage.getItem("loggedIn")) || false;
    });
    const [user, setUser] = useState(() => {
        return JSON.parse(localStorage.getItem("user")) || null;
    });
    const [api, setApi] = useState(() => {
        return JSON.parse(localStorage.getItem("api")) || "";
    });
    useEffect(() => {
        // Persist the value in localStorage whenever it changes
        localStorage.setItem("loggedIn", JSON.stringify(loggedIn));
    }, [loggedIn]);
    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user));
    }, [user]);

    useEffect(() => {
        localStorage.setItem("api", JSON.stringify(api));
    }, [api]);
    return (
        <AuthContext.Provider
            value={{ loggedIn, setLoggedIn, user, setUser, api, setApi }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
