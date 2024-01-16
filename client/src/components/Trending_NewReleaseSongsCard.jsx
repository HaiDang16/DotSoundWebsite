import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "react-h5-audio-player/lib/styles.css";
import { filterByLanguage } from "../utils/supportfunctions";
import {
  SET_LANGUAGE_FILTER,
  SET_ARTIST_FILTER,
  SET_FILTER_TERM,
  SET_ALBUM_FILTER,
} from "../store/actions";
import { FilterLanguageSongContainer } from "../components";

const NewReleaseSongContainer = ({ musics }) => {
  const dispatch = useDispatch();
  const [filteredSongs, setFilteredSongs] = useState();
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
    dispatch({ type: SET_ARTIST_FILTER, artistFilter: null });
    dispatch({ type: SET_LANGUAGE_FILTER, languageFilter: null });
    dispatch({ type: SET_ALBUM_FILTER, albumFilter: null });
    dispatch({ type: SET_FILTER_TERM, filterTerm: null });
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
        <FilterLanguageSongContainer
          data={filteredSongs ? filteredSongs : musics}
        />
      )}
    </>
  );
};

export default NewReleaseSongContainer;
