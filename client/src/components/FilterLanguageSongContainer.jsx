import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import "react-h5-audio-player/lib/styles.css";
import {
  SET_ALL_SONGS,
  SET_SONG,
  SET_SONG_PLAYING,
  SET_CURRENT_PLAYLIST,
} from "../store/actions";
import { getAllSongs } from "../api";

const FilterLanguageSongContainer = ({ data }) => {
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

  let songIndex;
  const handleClick = (index) => {
    songIndex = allSongs.findIndex((song) => song.id === data[index].id);
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
  const limitedData = data ? data.slice(0, 9) : [];

  return (
    <div className="w-full grid grid-cols-3 gap-4">
      {limitedData?.map((data, index) => (
        <motion.div
          key={data._id}
          whileTap={{ scale: 0.8 }}
          initial={{ opacity: 0, translateX: -50 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="relative w-full min-w-0 sm:min-w-350 p-2 m-2 cursor-pointer hover:shadow-xl border-2 bg_website hover:bg-card  shadow-md rounded-lg items-center flex"
          onClick={() => handleClick(index)}
        >
          <div className=" max-w-[80px] h-40 max-h-[80px] rounded-lg drop-shadow-lg relative overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={data.songImageURL}
              alt="Hình ảnh"
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
    </div>
  );
};
export default FilterLanguageSongContainer;
