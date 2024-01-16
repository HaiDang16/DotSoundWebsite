import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { isActiveStyles, isNotActiveStyles } from "../utils/styles";
import { IoSearch, IoPersonSharp } from "react-icons/io5";
import { getAuth } from "firebase/auth";
import { app } from "../config/firebase.config";
import { motion } from "framer-motion";
import { getUserDetails, updateAvatar } from "../api";
import { FaCrown } from "react-icons/fa";
import { SET_USER, SET_AUTH } from "../store/actions";
import { SearchCard } from "../components";
import { deleteSongById, getAllSongs } from "../api";
import { SET_ALL_SONGS, SET_SONG_PLAYING, SET_SONG } from "../store/actions";
const Header = () => {
  console.log("Header.jsx");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = JSON.parse(window.localStorage.getItem("userData"));
  const user = useSelector((state) => state.customization.user);
  useEffect(() => {
    getUserDetails(userData?.user?._id).then((res) => {
      console.log("getUserDetails res: ", res);
      dispatch({
        type: SET_USER,
        user: res,
      });
    });
  }, []);

  const allSongs = useSelector((state) => state.customization.allSongs);
  const [isMenu, setIsMenu] = useState(false);
  const [isSreach, setIsSearch] = useState(false);
  const [filteredSongs, setFilteredSongs] = useState(null);
  const [songFilter, setSongFilter] = useState("");
  const fadeDownVariant = {
    initial: {
      opacity: 0,
      y: -20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
      },
    },
  };
  const handleClickSearch = () => {
    setIsSearch(true);
  };
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

  useEffect(() => {
    if (!allSongs) {
      getAllSongs().then((data) => {
        dispatch({
          type: SET_ALL_SONGS,
          allSongs: data.songs,
        });
      });
    }
  }, []);
  useEffect(() => {
    if (songFilter.length > 0) {
      const filtered = allSongs.filter(
        (data) =>
          data.songName.toLowerCase().includes(songFilter.toLowerCase()) ||
          data.songArtist.songArtistName
            .toLowerCase()
            .includes(songFilter.toLowerCase()) |
            data.songAlbum.songAlbumName
              .toLowerCase()
              .includes(songFilter.toLowerCase())
      );
      setFilteredSongs(filtered.slice(0, 5));
    } else {
      setFilteredSongs(null);
    }
  }, [songFilter]);

  const handleOutsideClick = (event) => {
    if (filteredSongs !== 0 && songFilter) {
      const searchContainer = document.getElementById("searchContainer");
      if (searchContainer && !searchContainer.contains(event.target)) {
        setFilteredSongs(null);
        setSongFilter("");
      }
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [songFilter, filteredSongs]);

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
        <div className="w-full  h-16 flex items-center justify-center">
          <div className="w-full gap-4 p-2 md:w-2/3  shadow-xl rounded-md flex items-center">
            <IoSearch className="text-3xl text-white" />
            <input
              type="text"
              value={songFilter}
              className="w-full h-full bg-transparent text-lg text-white  border-none outline-none "
              placeholder="Tìm kiếm bài hát, nghệ sĩ,..."
              onChange={(e) => setSongFilter(e.target.value)}
              onClick={handleClickSearch}
            />
          </div>
          {isSreach && filteredSongs && filteredSongs.length !== 0 && (
            <motion.div
              variants={fadeDownVariant}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fade-down absolute z-10 top-16 flex flex-col gap-3 w-96 bg-slate-200 shadow-lg rounded-b-lg backdrop-blur-sm py-2"
              id="searchContainer"
            >
              {filteredSongs && filteredSongs.length !== 0 ? (
                filteredSongs?.map((search, index) => (
                  <SearchCard
                    key={search._id}
                    songName={search.songName}
                    songImageURL={search.songImageURL}
                    index={index}
                    songID={search._id}
                    songAlbum={search.songAlbum.songAlbumName}
                    songArtist={search.songArtist.songArtistName}
                  />
                ))
              ) : (
                <div className="flex-auto h-full w-full flex flex-col py-4">
                  <div className="flex items-center">
                    <p className="text-gray-700 font-medium tracking-widest text-center p-5">
                      Không có kết quả tìm kiếm phù hợp
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
      {user?.user?.cusRole ? (
        <div
          className="flex items-center ml-auto cursor-pointer gap-2 relative "
          onMouseEnter={() => setIsMenu(true)}
          onMouseLeave={() => setIsMenu(false)}
        >
          {user?.user?.cusAvatar ? (
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
              {`${user?.user?.cusLastName} ${user?.user?.cusFirstName}`}
            </p>
            {user?.user?.cusRole === "vip" ? (
              <>
                <p className="flex items-center gap-2 text-xs text-black font-normal">
                  <FaCrown className="text-xm -ml-1 text-yellow-500" /> Thành
                  viên VIP{" "}
                </p>
              </>
            ) : user?.user?.cusRole === "admin" ? (
              <>
                <p className="flex items-center gap-2 text-xs text-black font-normal">
                  <FaCrown className="text-xm -ml-1 text-red-500" /> Quản trị
                  viên
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
              {user?.user?.cusRole === "admin" ? (
                <>
                  <NavLink to={"/Admin/Dashboard"}>
                    <p className="text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out">
                      Quản lý
                    </p>
                  </NavLink>
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
