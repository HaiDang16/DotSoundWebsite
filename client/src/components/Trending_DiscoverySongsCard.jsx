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

const DiscoverySongsContainer = ({ musics }) => {
  const dispatch = useDispatch();
  const isSongPlaying = useSelector(
    (state) => state.customization.isSongPlaying
  );
  const song = useSelector((state) => state.customization.song);

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
            className=" cursor-pointer hover:shadow-xl hover:bg-card h-auto w-275 bg-slate-400 mr-6 rounded-lg border-4 border-gray-300"
            onClick={() => addSongToContext(index)}
          >
            <div className="w-full min-w-[160px] h-40 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={data.imageURL}
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
export default DiscoverySongsContainer;
