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
} from "../store/actions";
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
  const limitedData = data ? data.slice(0, 6) : [];

  return (
    <div className="h-full w-full grid grid-cols-2 gap-10 items-center ">
      {limitedData?.map((data, index) => (
        <div className=" flex flex-col-2 justify-center">
          <motion.div
            key={data._id}
            whileTap={{ scale: 0.8 }}
            initial={{ opacity: 0, translateX: -50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className=" cursor-pointer hover:shadow-xl hover:bg-card h-auto w-2/3 bg-slate-400 mr-16 rounded-xl border-4 border-gray-300"
            onClick={() => addSongToContext(index)}
          >
            <div className=" flex">
              <div className=" h-5 min-w-[160px] w-5 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={data.songImageURL}
                  alt=""
                  className=" w-full h-full rounded-lg object-cover"
                />
              </div>

              <p className="text-base text-white font-semibold my-2 pl-10">
                {data.songName.length > 25
                  ? `${data.songName.slice(0, 25)}`
                  : data.songName}
                <span className="block text-sm  my-2">
                  {data.songArtist.songArtistName}
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default NewReleaseSongContainer;
