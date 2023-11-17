import { lazy } from "react";

// project imports
import Loadable from "../components/Loadable";

import HomeLayout from "../layouts/HomeLayout";

const Login = Loadable(lazy(() => import("../pages/Login")));
const Register = Loadable(lazy(() => import("../pages/Register")));
const Trending = Loadable(lazy(() => import("../pages/Trending")));
const Dashboard = Loadable(lazy(() => import("../pages/Dashboard")));
const UserProfile = Loadable(lazy(() => import("../pages/UserProfile")));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = [
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        path: "/",
        element: <Trending />,
      },
      {
        path: "/Trending",
        element: <Trending />,
      },
      {
        path: "/Dashboard",
        element: <Dashboard />,
      },
      {
        path: "/UserProfile",
        element: <UserProfile />,
      },
    ],
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/Register",
    element: <Register />,
  },
];

export default MainRoutes;
