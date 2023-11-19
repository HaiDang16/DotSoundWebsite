// import AlertError from "../../components/shared/AlertError";
// import AlertSuccess from "../../components/shared/AlertSuccess";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
// import Loading from "../../components/users/Loading";
// import User_ChangePass from "../../components/users/User_ChangePass";
import { FaCheckCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  FilterButtonsCategory,
  FilterButtons,
  ImageLoader,
  ImageUploader,
  DisabledButton,
  FilterButtonsArtist,
  FilterButtonsAlbum,
} from "../components";
import SideBar from "../layouts/UserLayout/SideBar";
import { NavLink } from "react-router-dom";
import {
  getAllSongs,
  createPlaylist,
  getPlaylistByUserID,
  getPlaylistDetails,
} from "../api";
import {
  SET_ALL_SONGS,
  SET_SONG_PLAYING,
  SET_ALL_USERS,
  SET_ARTISTS,
  SET_ALL_ALBUMS,
  SET_ALL_ARTISTS,
  RESET_PLAYLIST,
  SET_SONG,
  SET_CURRENT_PLAYLIST,
} from "../store/actions";
const moment = require("moment");

function splitFullName(fullName) {
  const parts = fullName.split(" ");
  const firstName = parts[parts.length - 1]; // Phần tên

  // Nếu có phần còn lại, nó sẽ là các phần trước phần cuối cùng
  const restOfName = parts.slice(0, parts.length - 1).join(" ");

  return {
    firstName,
    restOfName,
  };
}

const UserPlaylist = () => {
  const baseURL = "http://localhost:4000/";
  const userData = JSON.parse(window.localStorage.getItem("userData"));
  const userDataID = userData.user._id;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phoneRegex = /^\d{10,}$/;

  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [loadedDetails, setLoadedDetails] = useState();
  const [updated, setUpdated] = useState(0);
  const [userFullName, setUserFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhoneNum, setUserPhoneNum] = useState();
  const [userDOB, setUserDOB] = useState("");
  const [userSex, setUserSex] = useState(null);
  const [isUpdatedPopup, setIsUpdatedPopup] = useState(false);
  const [isChangePasswordPopup, setIsChangePasswordPopup] = useState(false);
  const [playlistName, setPlaylistName] = useState("");

  useEffect(() => {
    getPlaylistByUserID(userDataID).then((res) => {
      console.log("getPlaylistByUserID res: ", res);
      setLoadedDetails(res.playlists);
      console.log(res.playlists);
    });
  }, []);

  const samplePlaylists = [
    { id: 1, name: "Danh sách phát 1" },
    { id: 2, name: "Danh sách phát 2" },
  ];
  return (
    <div className="h-auto mt-[120px] mb-16 w-full flex justify-center items-center">
      <div className="w-10/12 flex justify-center">
        <SideBar updated={updated} />
        <div className="md:w-4/6 md:pl-[50px]">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold mb-4">Các danh sách phát</h1>
            <AddNewPlaylistForm />
          </div>{" "}
          <div className="flex flex-wrap mt-6">
            {loadedDetails?.map((playlist) => (
              <PlaylistItem
                key={playlist.id}
                playlistName={playlist.playlistName}
                playlistImageURL={playlist.playlistImageURL}
                playlistID={playlist.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AddNewPlaylistForm = () => {
  const [playlistName, setPlaylistName] = useState("");

  const handleSubmit = () => {};
  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex justify-between w-460">
        <NavLink
          to={"/UserPlaylist/Add"}
          className="bg-indigo-500 text-white text-center px-4 py-2 rounded-md hover:bg-indigo-600 w-1/2"
        >
          Thêm mới
        </NavLink>
      </div>
    </form>
  );
};
const PlaylistItem = ({ playlistName, playlistImageURL, playlistID }) => {
  const dispatch = useDispatch();
  console.log(playlistID);
  const isSongPlaying = useSelector(
    (state) => state.customization.isSongPlaying
  );
  const song = useSelector((state) => state.customization.song);
  const playlist = useSelector((state) => state.customization.playlist) || [];
  const handlePlayPlaylist = async () => {
    let response;
    await getPlaylistDetails(playlistID).then((res) => {
      console.log("getPlaylistDetails res: ", res);
      response = res.playlist.playlistItems;
      console.log("response: ", response);
    });

    try {
      dispatch({
        type: RESET_PLAYLIST,
      });

      const playlistItems = response;
      playlistItems.forEach((playlistItem) => {
        const songNew = playlistItem.playlistSongID;
        console.log(songNew);
        dispatch({
          type: SET_CURRENT_PLAYLIST,
          playlist: songNew,
        });
      });
      console.log("playlist: ", playlist);
      if (!isSongPlaying) {
        dispatch({
          type: SET_SONG_PLAYING,
          isSongPlaying: true,
        });
      }

      const songIndex = allSongs.findIndex(
        (song) =>
          song.songImageURL === playlistItems[0].playlistSongID.songImageURL
      );
      if (song !== songIndex) {
        dispatch({
          type: SET_SONG,
          song: songIndex,
        });
      }
    } catch (error) {
      console.error("Error fetching playlist details:", error);
    }
  };

  const allSongs = useSelector((state) => state.customization.allSongs);
  if (!allSongs) {
    getAllSongs().then((data) => {
      dispatch({
        type: SET_ALL_SONGS,
        allSongs: data.songs,
      });
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.3 }}
      key={playlistID}
      className="relative overflow-hidden max-w-[260px] py-3 px-3 hover:bg-cardOverlay bg-primary h-full min-w-180 gap-3 cursor-pointer hover:shadow-xl mr-4  rounded-xl flex flex-col items-center"
      onClick={handlePlayPlaylist}
    >
      <img
        className="w-full h-36  object-cover rounded-md"
        src={playlistImageURL}
      />
      <div className="flex items-center justify-center font-normal text-lg text-website">
        {playlistName}
      </div>
    </motion.div>
  );
};
export default UserPlaylist;
