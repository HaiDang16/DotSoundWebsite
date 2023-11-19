import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import "react-h5-audio-player/lib/styles.css";
import { actionType } from "../context/reducer";
import { filterByLanguage, filters } from "../utils/supportfunctions";
import {
  SET_ALL_SONGS,
  SET_ARTISTS,
  SET_ALL_ARTISTS,
  SET_LANGUAGE_FILTER,
  SET_SONG,
  SET_SONG_PLAYING,
  SET_CURRENT_PLAYLIST,
} from "../store/actions";
import {
  getAllAlbums,
  deleteAlbumsById,
  getAllCategories,
  getAllSongs,
} from "../api";
const NewReleaseSongContainer = ({ musics }) => {
  const dispatch = useDispatch();
  const [filteredSongs, setFilteredSongs] = useState();

  const song = useSelector((state) => state.customization.song);
  const filterLang = useSelector((state) => state.customization.filterLang);
  const languageFilter = useSelector(
    (state) => state.customization.languageFilter
  );
  useEffect(() => {
    if (languageFilter !== null) {
      const filtered = musics.filter(
        (data) =>
          data.songLanguage.toLowerCase() === languageFilter.toLowerCase()
      );
      setFilteredSongs(filtered);
    } else {
      setFilteredSongs(null);
    }
  }, [languageFilter]);

  const updateFilterLanguage = (value) => {
    dispatch({
      type: SET_LANGUAGE_FILTER,
      languageFilter: value,
    });
  };

  const clearAllFilter = () => {
    setFilteredSongs(null);
    dispatch({ type: actionType.SET_ARTIST_FILTER, artistFilter: null });
    dispatch({ type: actionType.SET_LANGUAGE_FILTER, languageFilter: null });
    dispatch({ type: actionType.SET_ALBUM_FILTER, albumFilter: null });
    dispatch({ type: actionType.SET_FILTER_TERM, filterTerm: null });
  };
  return (
    <>
      <div className="w-full my-4 px-6 py-4 flex items-start md:justify-start gap-10 z-30 ">
        <div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileTap={{ scale: 0.75 }}
          onClick={clearAllFilter}
        >
          <p className="text-white font-normal text-base cursor-pointer border px-8 min-w-[120px] focus:bg-blue-700 hover:bg-blue-900 text-center rounded-full hover:font-semibold">
            Tất cả{" "}
          </p>
        </div>
        <div className=" flex items-center gap-16 mx-4">
          {filterByLanguage?.map((data) => (
            <p
              key={data.id}
              onClick={() => updateFilterLanguage(data.value)}
              className={`text-base text-center ${
                languageFilter &&
                data.value.toLowerCase() === languageFilter.toLowerCase()
                  ? "font-semibold"
                  : "font-normal"
              } text-white cursor-pointer hover:font-semibold transition-all duration-100 ease-in-out px-8 focus:bg-blue-700 hover:bg-blue-900 bg_website_02 border rounded-full min-w-[100px]`}
            >
              {data.name}
            </p>
          ))}
        </div>
      </div>
      {musics && (
        <SongContainer data={filteredSongs ? filteredSongs : musics} />
      )}
    </>
  );
};

export const SongContainer = ({ data }) => {
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
    songIndex = allSongs.findIndex(
      (song) => song.songImageURL === data[index].songImageURL
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
    console.log("data[index].id: ", data[index]);
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
    </div>
  );
};

export default NewReleaseSongContainer;
