import React from "react";
import { Navigate } from "react-router-dom";

const CheckAuth = ({ children }) => {

    const isAuth = localStorage.getItem("access_token") || undefined;

    return !isAuth ? children : <Navigate to="/" />;
};

export default CheckAuth;