import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import "react-h5-audio-player/lib/styles.css";
import { actionType } from "../context/reducer";

const NewReleaseSongContainer = ({ musics }) => {
  const dispatch = useDispatch();
  const isSongPlaying = useSelector(
    (state) => state.customization.isSongPlaying
  );
  const song = useSelector((state) => state.customization.song);

  const addSongToContext = (index) => {
    if (!isSongPlaying) {
      dispatch({
        type: actionType.SET_SONG_PLAYING,
        isSongPlaying: true,
      });
    }
    if (song !== index) {
      dispatch({
        type: actionType.SET_SONG,
        song: index,
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
          className="relative w-full min-w-0 sm:min-w-350 p-2 m-2 cursor-pointer hover:shadow-xl border-2 bg_website hover:bg-card  shadow-md rounded-lg items-center flex"
          onClick={() => addSongToContext(index)}
        >
          <div className=" max-w-[80px] h-40 max-h-[80px] rounded-lg drop-shadow-lg relative overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={data.songImageURL}
              alt=""
              className=" w-40 h-40 rounded-lg object-cover"
            />
          </div>

          <p className="text-base text-white font-semibold m-2">
            {data.songName.length > 25
              ? `${data.songName.slice(0, 25)}`
              : data.songName}
            <span className="block text-sm text-gray-400 my-1">
              {data.songArtist.songArtistName}
            </span>
          </p>
        </motion.div>
      ))}
    </>
  );
};

export default NewReleaseSongContainer;
