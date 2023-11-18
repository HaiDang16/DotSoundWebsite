import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllAlbums,
  deleteAlbumsById,
  getAllCategories,
  getAllSongs,
} from "../api";
import {
  SET_ALL_SONGS,
  SET_ARTISTS,
  SET_ALL_ARTISTS,
  SET_LANGUAGE_FILTER,
  SET_SONG,
  SET_SONG_PLAYING,
  SET_CURRENT_PLAYLIST,
} from "../store/actions";
const SearchCard = ({
  key,
  index,
  songName,
  songImageURL,
  songID,
  songArtist,
  songAlbum,
}) => {
  let songIndex;
  const navigate = useNavigate();

  console.log(songArtist);
  const dispatch = useDispatch();
  const song = useSelector((state) => state.customization.song);
  const isSongPlaying = useSelector(
    (state) => state.customization.isSongPlaying
  );
  const playlist = useSelector((state) => state.customization.playlist);
  const allSongs = useSelector((state) => state.customization.allSongs);
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

  const handleClick = () => {
    songIndex = allSongs.findIndex(
      (song) => song.songImageURL === songImageURL
    );
    addSongToContext(songIndex);
  };

  const addSongToContext = (index) => {
    if (!isSongPlaying) {
      dispatch({
        type: SET_SONG_PLAYING,
        isSongPlaying: true,
      });
    }
    if (song !== index) {
      dispatch({
        type: SET_SONG,
        song: index,
      });
    }

    let songExists;
    if (playlist.length > 0) {
      songExists = playlist.some((song) => song.id === allSongs[index].id);
    }
    if (!songExists) {
      dispatch({
        type: SET_CURRENT_PLAYLIST,
        playlist: allSongs[index],
      });
    }
  };
  return (
    <motion.div
      whileTap={{ scale: 0.8 }}
      initial={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex-auto h-full w-full flex flex-col py-1 px-5 cursor-pointer hover:bg-cardOverlay"
      key={key}
      onClick={handleClick}
    >
      <div className="flex items-center">
        <div className="w-14 h-14 ml-2 mr-4 rounded-full">
          <img
            src={songImageURL}
            alt="Hỉnh ảnh"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex flex-col">
          <p>{songName}</p>
          <p className="text-sm text-gray-600 mt-1">
            {songArtist} ({songAlbum})
          </p>
        </div>
      </div>
    </motion.div>
  );
};
export default SearchCard;
