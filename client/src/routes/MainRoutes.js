import { lazy } from "react";

// project imports
import Loadable from "../components/Loadable";
import HomeLayout from "../layouts/HomeLayout";
import AdminLayout from "../layouts/AdminLayout";

const Login = Loadable(lazy(() => import("../pages/Login")));
const Register = Loadable(lazy(() => import("../pages/Register")));
const Trending = Loadable(lazy(() => import("../pages/Trending")));
const UserProfile = Loadable(lazy(() => import("../pages/UserProfile")));

const UserPlaylist = Loadable(lazy(() => import("../pages/userPlaylist")));
const UserPlaylist_Add = Loadable(
  lazy(() => import("../pages/userPlaylist_Add"))
);

const ForgotPassword = Loadable(lazy(() => import("../pages/ForgotPass")));

const ResetPassword = Loadable(lazy(() => import("../pages/ResetPassword")));
const ForYou = Loadable(lazy(() => import("../pages/ForYou")));

const AdminDashboard = Loadable(lazy(() => import("../pages/AdminDashboard")));
const AdminManageSongs = Loadable(
  lazy(() => import("../pages/AdminManageSongs"))
);
const AdminManageAlbums = Loadable(
  lazy(() => import("../pages/AdminManageAlbums"))
);
const AdminManageArtists = Loadable(
  lazy(() => import("../pages/AdminManageArtists"))
);
const AdminManageUsers = Loadable(
  lazy(() => import("../pages/AdminManageUsers"))
);
const AdminManageSongsAdd = Loadable(
  lazy(() => import("../pages/AdminManageSongsAdd"))
);
const AdminManageArtistAdd = Loadable(
  lazy(() => import("../pages/AdminManageArtistAdd"))
);
const AdminManageAlbumAdd = Loadable(
  lazy(() => import("../pages/AdminManageAlbumAdd"))
);
const AdminManageUserAdd = Loadable(
  lazy(() => import("../pages/AdminManageUserAdd"))
);
const AdminManageUserUpdate = Loadable(
  lazy(() => import("../pages/AdminManageUserUpdate"))
);
const AdminManageSongUpdate = Loadable(
  lazy(() => import("../pages/AdminManageSongsUpdate"))
);
const AdminManageArtistUpdate = Loadable(
  lazy(() => import("../pages/AdminManageArtistUpdate"))
);
const AdminManageCategories = Loadable(
  lazy(() => import("../pages/AdminManageCategories"))
);
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
        path: "/UserProfile",
        element: <UserProfile />,
      },
      {
        path: "/ForYou",
        element: <ForYou />,
      },
      {
        path: "/UserPlaylist",
        element: <UserPlaylist />,
      },
      {
        path: "/UserPlaylist/Add",
        element: <UserPlaylist_Add />,
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
  {
    path: "/ForgotPassword",
    element: <ForgotPassword />,
  },
  {
    path: "/ResetPassword",
    element: <ResetPassword />,
  },
  {
    path: "/Admin",
    element: <AdminLayout />,
    children: [
      {
        path: "/Admin/Dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "/Admin/ManageSongs",
        element: <AdminManageSongs />,
      },
      {
        path: "/Admin/ManageAlbums",
        element: <AdminManageAlbums />,
      },
      {
        path: "/Admin/ManageArtists",
        element: <AdminManageArtists />,
      },
      {
        path: "/Admin/ManageUsers",
        element: <AdminManageUsers />,
      },
      {
        path: "/Admin/ManageCategories",
        element: <AdminManageCategories />,
      },
      {
        path: "/Admin/ManageSongs/Add",
        element: <AdminManageSongsAdd />,
      },
      {
        path: "/Admin/ManageArtists/Add",
        element: <AdminManageArtistAdd />,
      },
      {
        path: "/Admin/ManageAlbums/Add",
        element: <AdminManageAlbumAdd />,
      },
      {
        path: "/Admin/ManageUsers/Add",
        element: <AdminManageUserAdd />,
      },
      {
        path: "/Admin/ManageUsers/Update",
        element: <AdminManageUserUpdate />,
      },
      {
        path: "/Admin/ManageSongs/Update",
        element: <AdminManageSongUpdate />,
      },
      {
        path: "/Admin/ManageArtists/Update",
        element: <AdminManageArtistUpdate />,
      },
    ],
  },
];

export default MainRoutes;
