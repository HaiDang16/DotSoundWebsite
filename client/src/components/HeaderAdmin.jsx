import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Logo } from "../assets/img";
import { useSelector, useDispatch } from "react-redux";
import { isActiveStylesAdmin, isNotActiveStylesAdmin } from "../utils/styles";
import { IoSearch, IoCartOutline, IoPersonSharp } from "react-icons/io5";
import { getAuth } from "firebase/auth";
import { app } from "../config/firebase.config";
import { motion } from "framer-motion";

import { FaCrown } from "react-icons/fa";
import { SET_USER, SET_AUTH } from "../store/actions";
import { IoHome } from "react-icons/io5";

const Header = () => {
  console.log("Header.jsx");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = JSON.parse(window.localStorage.getItem("userData"));

  const [isMenu, setIsMenu] = useState(false);

  const logOut = () => {
    const firebaseAuth = getAuth(app);
    firebaseAuth
      .signOut()
      .then(() => {
        window.localStorage.setItem("auth", "false");
      })
      .catch((e) => console.log(e));
    window.localStorage.setItem("auth", "false");
    window.localStorage.removeItem("userData");
    dispatch({
      type: SET_AUTH,
      auth: false,
    });
    dispatch({
      type: SET_USER,
      user: null,
    });
    navigate("/", { replace: true });
  };

  return (
    <header className="flex fixed top-0 items-center w-full background md:px-20 z-30 py-2">
      <ul className="flex items-center justify-center ml-7">
        {/* prettier-ignore */}
        <NavLink to={"/Admin/Dashboard"}><IoHome className="text-2xl text-white mr-10" /></NavLink>
        {/* prettier-ignore */}
        <NavLink to={"/Admin/ManageUsers"} className={({ isActive }) => isActive ? isActiveStylesAdmin : isNotActiveStylesAdmin}> Người dùng </NavLink>

        {/* prettier-ignore */}
        <NavLink to={"/Admin/ManageSongs"} className={({ isActive }) => isActive ? isActiveStylesAdmin : isNotActiveStylesAdmin}> Bài hát </NavLink>

        {/* prettier-ignore */}
        <NavLink to={"/Admin/ManageArtists"} className={({ isActive }) => isActive ? isActiveStylesAdmin : isNotActiveStylesAdmin}> Nghệ sĩ </NavLink>

        {/* prettier-ignore */}
        <NavLink to={"/Admin/ManageAlbums"} className={({ isActive }) => isActive ? isActiveStylesAdmin : isNotActiveStylesAdmin}> Albums </NavLink>

        <NavLink
          to={"/Admin/ManageCategories"}
          className={({ isActive }) =>
            isActive ? isActiveStylesAdmin : isNotActiveStylesAdmin
          }
        >
          Thể loại
        </NavLink>
      </ul>

      <div
        className="flex items-center ml-auto cursor-pointer gap-2 relative "
        onMouseEnter={() => setIsMenu(true)}
        onMouseLeave={() => setIsMenu(false)}
      >
        {user?.user.cusAvatar ? (
          <img
            className="w-12 min-w-[44px] object-cover rounded-full shadow-lg mr-2"
            src={user?.user?.cusAvatar}
            alt=""
            referrerpolicy="no-referrer"
          />
        ) : (
          <IoPersonSharp className="text-white w-8 h-8 min-w-[30px] object-cover rounded-full shadow-lg mr-3" />
        )}

        <div className="flex flex-col">
          <p className="text-white text-lg hover:text-headingColor font-semibold">
            {`${user?.user.cusLastName} ${user?.user.cusFirstName}`}
          </p>
          <p className="flex items-center gap-2 text-xs text-black font-normal">
            <FaCrown className="text-xm -ml-1 text-red-500" /> Quản trị viên
          </p>
        </div>
        {isMenu && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute z-20 top-10 right-0 w-275 p-4 gap-4 bg-card shadow-lg rounded-lg backdrop-blur-sm flex flex-col"
          >
            <NavLink to={"/Admin/Dashboard"}>
              <p className="text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out">
                Quản lý
              </p>
            </NavLink>

            <hr />
            <p
              className="text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out"
              onClick={logOut}
            >
              Đăng xuất
            </p>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
