import React, { useEffect } from "react";
import { FaUsers } from "react-icons/fa";
import { GiLoveSong, GiMusicalNotes } from "react-icons/gi";
import { RiUserStarFill } from "react-icons/ri";
import { getAllAlbums, getAllArtist, getAllSongs, getAllUsers } from "../api";
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
} from "../store/actions";
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
  }, []);
  return (
    <div className="w-full p-6 flex items-center justify-evenly flex-wrap h-screen">
      {/* prettier-ignore */}
      <DashboardCard icon={<FaUsers className="text-3xl text-textColor" />} name={"Users"} count={allUsers?.length > 0 ? allUsers?.length : 0} />

      {/* prettier-ignore */}
      <DashboardCard icon={<GiLoveSong className="text-3xl text-textColor" />} name={"Songs"} count={allSongs?.length > 0 ? allSongs?.length : 0} />

      {/* prettier-ignore */}
      <DashboardCard icon={<RiUserStarFill className="text-3xl text-textColor" />} name={"Artist"} count={allArtists?.length > 0 ? allArtists?.length : 0} />

      {/* prettier-ignore */}
      <DashboardCard icon={<GiMusicalNotes className="text-3xl text-textColor" />} name={"Album"} count={allAlbums?.length > 0 ? allAlbums?.length : 0} />
    </div>
  );
};

export default DashboardHome;
