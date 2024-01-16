import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

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
import {
  SET_ALL_SONGS,
  SET_ALL_USERS,
  SET_ALL_ALBUMS,
  SET_ALL_ARTISTS,
  SET_ALL_CATEGORIES,
} from "../store/actions";

//Import components
import { DashboardCard } from "../components";

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
        dispatch({ type: SET_ALL_ARTISTS, allArtists: data.artists });
      });
    }
    if (!allAlbums) {
      getAllAlbums().then((data) => {
        dispatch({ type: SET_ALL_ALBUMS, allAlbums: data.albums });
      });
    }
    if (!allCategories) {
      getAllCategories().then((data) => {
        dispatch({ type: SET_ALL_CATEGORIES, allCategories: data.categories });
      });
    }
  }, []);
  return (
    <div className="w-full p-6 flex items-center justify-evenly flex-wrap h-screen">
      <NavLink to={"/Admin/ManageUsers"}>
        <DashboardCard
          icon={<FaUsers className="text-3xl text-textColor" />}
          name={"Người dùng"}
          count={allUsers?.length > 0 ? allUsers?.length : 0}
        />
      </NavLink>
      <NavLink to={"/Admin/ManageSongs"}>
        <DashboardCard
          icon={<GiLoveSong className="text-3xl text-textColor" />}
          name={"Bài hát"}
          count={allSongs?.length > 0 ? allSongs?.length : 0}
        />
      </NavLink>
      <NavLink to={"/Admin/ManageArtists"}>
        <DashboardCard
          icon={<RiUserStarFill className="text-3xl text-textColor" />}
          name={"Nghệ sĩ"}
          count={allArtists?.length > 0 ? allArtists?.length : 0}
        />
      </NavLink>
      <NavLink to={"/Admin/ManageAlbums"}>
        <DashboardCard
          icon={<GiMusicalNotes className="text-3xl text-textColor" />}
          name={"Album bài hát"}
          count={allAlbums?.length > 0 ? allAlbums?.length : 0}
        />
      </NavLink>
      <NavLink to={"/Admin/ManageCategories"}>
        <DashboardCard
          icon={<GiNotebook className="text-3xl text-textColor" />}
          name={"Thể loại"}
          count={allCategories?.length > 0 ? allCategories?.length : 0}
        />
      </NavLink>
    </div>
  );
};

export default DashboardHome;
