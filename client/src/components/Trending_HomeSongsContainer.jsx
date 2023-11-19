import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import "react-h5-audio-player/lib/styles.css";
import {
  SET_ALL_SONGS,
  SET_SONG_PLAYING,
  SET_SONG,
  SET_MINI_PLAYER,
} from "../store/actions";
import {
  getAllAlbums,
  deleteAlbumsById,
  getAllCategories,
  getAllSongs,
} from "../api";
export const HomeSongContainer = ({ musics }) => {
  const dispatch = useDispatch();
  const isSongPlaying = useSelector(
    (state) => state.customization.isSongPlaying
  );
  const song = useSelector((state) => state.customization.song);
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

  let songIndex;
  const handleClick = (index) => {
    songIndex = allSongs.findIndex(
      (song) => song.songImageURL === musics[index].songImageURL
    );
    console.log("songIndex: ", songIndex);
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
    <>
      {musics?.map((data, index) => (
        <motion.div
          key={data._id}
          whileTap={{ scale: 0.8 }}
          initial={{ opacity: 0, translateX: -50 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="relative w-40 min-w-210 px-2 py-4 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-center"
          onClick={() => handleClick(index)}
        >
          <div className="w-40 min-w-[160px] h-40 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={data.songImageURL}
              alt=""
              className=" w-full h-full rounded-lg object-cover"
            />
          </div>

          <p className="text-base text-headingColor font-semibold my-2">
            {data.songName}
            <span className="block text-sm text-gray-400 my-1">
              {data.songArtist.songArtistName}
            </span>
          </p>
        </motion.div>
      ))}
    </>
  );
};
