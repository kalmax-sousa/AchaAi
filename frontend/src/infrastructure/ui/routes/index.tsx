import React from "react"
import { createBrowserRouter } from "react-router-dom"
import Login from "@/infrastructure/ui/pages/public/login"
import Register from "../pages/public/register"
import Home from "../pages/private/Home"
import PrivateRoutes from "./PrivateRoutes"
import AutenticatedRoutes from "./AutenticatedRoutes"
import ConfirmateAccount from "../pages/public/confirmateAccount"
import SendRecoveryPassword from "../pages/public/sendRecoveryPassword"
import RecoveryPassword from "../pages/public/recoveryPassword"

const NotFound: React.FC = () => <h1>404</h1>

export const router = createBrowserRouter([
    {
        path: "auth",
        element: <AutenticatedRoutes />,
        children: [
            {
                path: "login",
                element: <Login />
            }, 
            {
                path: "register",
                element: <Register />
            },
            {
                path: "confirmate-account/:token",
                element: <ConfirmateAccount />
            },
            {
                path: "recovery-password",
                element: <SendRecoveryPassword />
            },
            {
                path: "recovery-password/:token",
                element: <RecoveryPassword />
            },
        ]
    },
    {
        path: "/",
        element: <PrivateRoutes />,
        children: [
            {
                path: "",
                element: <Home />
            }
        ]
    },
    {
        path: "*",
        element: <NotFound />
    },
]);
