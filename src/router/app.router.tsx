import { createBrowserRouter, Navigate } from "react-router";

import AuthLayout from "@/auth/layouts/AuthLayout";
import LoginPage from "@/auth/page/login/LoginPage";
import RegisterPage from "@/auth/page/register/RegisterPage";
import { HomePage } from "@/social/pages/home/HomePage";
import { SocialLayout } from "@/social/layouts/SocialLayout";
import { PerfilPage } from "@/social/pages/perfil/PerfilPage";
import { UsersPage } from "@/social/pages/users/UsersPage";
import { AuthenticatedRoute, GuestRoute } from "./ProtectedRoutes";

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <GuestRoute><AuthLayout /></GuestRoute>,
    children: [
      {
        index: true,
        element: <Navigate to='/auth/login' />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      }
    ]
  },
  {
    path: '/',
    element: <AuthenticatedRoute><SocialLayout /></AuthenticatedRoute>,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'perfil',
        element: <PerfilPage />
      },
      {
        path: 'usuarios',
        element: <UsersPage />
      },
    ]
  },
]);
