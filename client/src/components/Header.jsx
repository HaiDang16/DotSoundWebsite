import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Logo } from "../assets/img";
import { useStateValue } from "../context/StateProvider";
import { useSelector, useDispatch } from "react-redux";
import SearchBar from "./SearchBar";
import { isActiveStyles, isNotActiveStyles } from "../utils/styles";
import { IoSearch, IoCartOutline, IoPersonSharp } from "react-icons/io5";
import { getAuth } from "firebase/auth";
import { app } from "../config/firebase.config";
import { motion } from "framer-motion";

import { FaCrown } from "react-icons/fa";
import { SET_USER, SET_AUTH } from "../store/actions";

const Header = () => {
  console.log("Header.jsx");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = JSON.parse(window.localStorage.getItem("userData"));

  const [isMenu, setIsMenu] = useState(false);
  const [isSearched, setIisSearched] = useState(false);

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
    <header className="flex fixed top-0 items-center w-full  background  md:px-20 z-30">
      <NavLink to={"/Trending"}>
        <div className="fonts-leOne text-white text-2xl  ">DotSounds</div>
      </NavLink>

      <ul className="flex items-center justify-center ml-7">
        {/* prettier-ignore */}
        <li className="mx-3 text-lg"><NavLink to={'/Trending'} className={({ isActive }) => isActive ? isActiveStyles : isNotActiveStyles}>Thịnh Hành</NavLink></li>
        {/* prettier-ignore */}
        <li className="mx-3 text-lg"><NavLink to={'/ForYou'} className={({ isActive }) => isActive ? isActiveStyles : isNotActiveStyles}>Dành Cho Bạn</NavLink></li>
      </ul>
      <div className="w-1/2">
        {" "}
        <SearchBar />
      </div>
      {user?.user.cusRole ? (
        <div
          className="flex items-center ml-auto cursor-pointer gap-2 relative "
          onMouseEnter={() => setIsMenu(true)}
          onMouseLeave={() => setIsMenu(false)}
        >
          <img
            className="w-12 min-w-[44px] object-cover rounded-full shadow-lg"
            src={user?.user?.cusAvatar}
            alt=""
            referrerpolicy="no-referrer"
          />
          <div className="flex flex-col">
            <p className="text-white text-lg hover:text-headingColor font-semibold">
              {`${user?.user.cusLastName} ${user?.user.cusFirstName}`}
            </p>
            {user?.user.cusRole === "vip" ? (
              <>
                <p className="flex items-center gap-2 text-xs text-black font-normal">
                  <FaCrown className="text-xm -ml-1 text-yellow-500" /> Thành
                  viên VIP{" "}
                </p>
              </>
            ) : (
              <>
                <p className="flex items-center gap-2 text-xs text-black font-normal">
                  <FaCrown className="text-xm -ml-1 text-black" /> Thành viên
                  thường
                </p>
              </>
            )}
          </div>
          {isMenu && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute z-20 top-10 right-0 w-275 p-4 gap-4 bg-card shadow-lg rounded-lg backdrop-blur-sm flex flex-col"
            >
              {user?.user.cusRole === "admin" ? (
                <>
                  <NavLink to={"/dashboard/home"}>
                    <p className="text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out">
                      Quản lý
                    </p>
                  </NavLink>
                  <hr />
                </>
              ) : (
                <NavLink to={"/UserProfile"}>
                  <p className="text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out">
                    Trang cá nhân
                  </p>
                </NavLink>
              )}
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
      ) : (
        <div
          onMouseEnter={() => setIsMenu(true)}
          onMouseLeave={() => setIsMenu(false)}
          className="flex items-center ml-auto cursor-pointer gap-2 relative"
        >
          <IoPersonSharp className="text-white w-8 h-8 min-w-[30px] object-cover rounded-full shadow-lg " />
          {isMenu && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute z-10 top-8 p-6 flex flex-col right-0 w-190 gap-3 bg-card shadow-lg rounded-lg backdrop-blur-sm "
            >
              <NavLink to={"/Login"}>
                <p className="text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out">
                  Đăng nhập
                </p>
              </NavLink>

              <NavLink
                to={"/Register"}
                className="text-base text-textColor hover:font-semibold 
              duration-150 transition-all ease-in-out"
              >
                Đăng ký
              </NavLink>
            </motion.div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
