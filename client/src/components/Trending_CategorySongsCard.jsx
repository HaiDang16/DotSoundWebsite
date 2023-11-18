import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import "react-h5-audio-player/lib/styles.css";
import {
  SET_ALL_SONGS,
  SET_SONG_PLAYING,
  SET_SONG,
  SET_MINI_PLAYER,
  SET_CURRENT_PLAYLIST,
} from "../store/actions";

const CategorySongsCard = ({ musics }) => {
  const dispatch = useDispatch();
  const isSongPlaying = useSelector(
    (state) => state.customization.isSongPlaying
  );
  const song = useSelector((state) => state.customization.song);
  const playlist = useSelector((state) => state.customization.playlist);

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
      songExists = playlist.some((song) => song.id === musics[index].id);
    }
    if (!songExists) {
      dispatch({
        type: SET_CURRENT_PLAYLIST,
        playlist: musics[index],
      });
    }
  };
  return (
    <>
      {musics?.map((data, index) => (
        <div>
          <motion.div
            key={data._id}
            whileTap={{ scale: 0.8 }}
            initial={{ opacity: 0, translateX: -50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className=" cursor-pointer hover:shadow-xl hover:bg-card h-auto w-auto bg-slate-400 mr-10 rounded-lg border-4 border-gray-300"
            onClick={() => addSongToContext(index)}
          >
            <div className="h-28 min-w-[160px] w-275  rounded-lg drop-shadow-lg relative overflow-hidden">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={data.songImageURL}
                alt=""
                className=" w-full h-full rounded-lg object-cover"
              />
            </div>
          </motion.div>
        </div>
      ))}
    </>
  );
};
export default CategorySongsCard;
