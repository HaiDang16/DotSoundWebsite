import React from "react";
import { IoHome } from "react-icons/io5";
import { NavLink, Outlet, Route, Routes } from "react-router-dom";
import { isActiveStyles, isNotActiveStyles } from "../../utils/styles";
import { useSelector, useDispatch } from "react-redux";
import { HeaderAdmin } from "../../components";
// import {
//   DashboardAlbum,
//   DashboardArtist,
//   DashboardHome,
//   DashboardSongs,
//   DashboardUser,
//   DashboardNewSong,
// } from "../pages";

const AdminLayout = () => {
  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg_website">
      <HeaderAdmin />
      <div className="my-4 w-full p-4 mt-20 min-h-screen">
        <Outlet />
      </div>

      {/* <div className="my-4 w-full p-4">
        <Routes>
          <Route path="/home" element={<DashboardHome />} />
          <Route path="/user" element={<DashboardUser />} />
          <Route path="/songs" element={<DashboardSongs />} />
          <Route path="/artist" element={<DashboardArtist />} />
          <Route path="/albums" element={<DashboardAlbum />} />
          <Route path="/newSong" element={<DashboardNewSong />} />
        </Routes>
      </div> */}
    </div>
  );
};

export default AdminLayout;
