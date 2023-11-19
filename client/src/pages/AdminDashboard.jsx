import React, { useEffect } from "react";
import { FaUsers } from "react-icons/fa";
import { GiLoveSong, GiMusicalNotes, GiNotebook } from "react-icons/gi";
import { RiUserStarFill } from "react-icons/ri";
import {
  getAllAlbums,
  getAllArtist,
  getAllCategories,
  getAllSongs,
  getAllUsers,
} from "../api";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import { bgColors } from "../utils/styles";
import { useSelector, useDispatch } from "react-redux";
import {
  SET_ALL_SONGS,
  SET_SONG_PLAYING,
  SET_ALL_USERS,
  SET_ARTISTS,
  SET_ALL_ALBUMS,
  SET_ALL_ARTISTS,
  SET_ALL_CATEGORIES,
} from "../store/actions";
import { NavLink } from "react-router-dom";
export const DashboardCard = ({ icon, name, count }) => {
  const dispatch = useDispatch();

  const bg_color = bgColors[parseInt(Math.random() * bgColors.length)];

  return (
    <div
      style={{ background: `${bg_color}` }}
      className={`p-4 w-40 gap-3 h-auto rounded-lg shadow-md flex flex-col items-center justify-center`}
    >
      {icon}
      <p className="text-xl text-black font-semibold">{name}</p>
      <p className="text-sm text-black">{count}</p>
    </div>
  );
};

const DashboardHome = () => {
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.customization.allUsers);
  const allSongs = useSelector((state) => state.customization.allSongs);
  const allArtists = useSelector((state) => state.customization.allArtists);
  const allAlbums = useSelector((state) => state.customization.allAlbums);
  const allCategories = useSelector(
    (state) => state.customization.allCategories
  );
  useEffect(() => {
    if (!allUsers) {
      getAllUsers().then((data) => {
        console.log(data.data);
        dispatch({
          type: SET_ALL_USERS,
          allUsers: data.users,
        });
        console.log("user: ", data);
      });
    }
    if (!allSongs) {
      getAllSongs().then((data) => {
        dispatch({
          type: SET_ALL_SONGS,
          allSongs: data.songs,
        });
      });
    }
    if (!allArtists) {
      getAllArtist().then((data) => {
        console.log("getAllArtist res: ", data.artists);
        dispatch({ type: SET_ALL_ARTISTS, allArtists: data.artists });
      });
    }
    if (!allAlbums) {
      getAllAlbums().then((data) => {
        dispatch({ type: SET_ALL_ALBUMS, allAlbums: data.data });
      });
    }
    if (!allCategories) {
      getAllCategories().then((data) => {
        dispatch({ type: SET_ALL_CATEGORIES, allCategories: data.data });
      });
    }
  }, []);
  return (
    <div className="w-full p-6 flex items-center justify-evenly flex-wrap h-screen">
      {/* prettier-ignore */}
      <NavLink
to={"/Admin/ManageUsers"}
      >
         <DashboardCard icon={<FaUsers className="text-3xl text-textColor" />} name={"Người dùng"} count={allUsers?.length > 0 ? allUsers?.length : 0} />
      </NavLink>
      <NavLink to={"/Admin/ManageSongs"}>
        {/* prettier-ignore */}
        <DashboardCard icon={<GiLoveSong className="text-3xl text-textColor" />} name={"Bài hát"} count={allSongs?.length > 0 ? allSongs?.length : 0} />
      </NavLink>
      <NavLink to={"/Admin/ManageArtists"}>
        {/* prettier-ignore */}
        <DashboardCard icon={<RiUserStarFill className="text-3xl text-textColor" />} name={"Nghệ sĩ"} count={allArtists?.length > 0 ? allArtists?.length : 0} />
      </NavLink>
      <NavLink to={"/Admin/ManageAlbums"}>
        {/* prettier-ignore */}
        <DashboardCard icon={<GiMusicalNotes className="text-3xl text-textColor" />} name={"Album bài hát"} count={allAlbums?.length > 0 ? allAlbums?.length : 0} />
      </NavLink>
      <NavLink to={"/Admin/ManageCategories"}>
        {/* prettier-ignore */}
        <DashboardCard icon={<GiNotebook className="text-3xl text-textColor" />} name={"Thể loại"} count={allCategories?.length > 0 ? allCategories?.length : 0} />
      </NavLink>
    </div>
  );
};

export default DashboardHome;
