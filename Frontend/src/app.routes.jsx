import { createBrowserRouter, Navigate } from "react-router";
import Login from "./features/Auth/pages/login";
import Register from "./features/Auth/pages/Register";
import Protected from "./features/Auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <Protected>
        <Home />
      </Protected>
    ),
  },
  {
    path: "/interview/:interviewId",
    element: <Protected><Interview /></Protected>,
  },
  {
    path: "/interview",
    element: <Navigate to="/" replace />,
  },
])
