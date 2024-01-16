import React, { useEffect } from "react";
import { actionType } from "../context/reducer";
import { getAllAlbums, getAllArtist } from "../api";
import { filterByLanguage, filters } from "../utils/supportfunctions";

import { useSelector, useDispatch } from "react-redux";

const Filter = ({ setFilteredSongs }) => {
  const dispatch = useDispatch();
  const filterLang = useSelector((state) => state.customization.filterLang);
  const artists = useSelector((state) => state.customization.artists);
  const allAlbums = useSelector((state) => state.customization.allAlbums);

  useEffect(() => {
    if (!artists) {
      getAllArtist().then((data) => {
        dispatch({ type: actionType.SET_ARTISTS, artists: data.data });
      });
    }

    if (!allAlbums) {
      getAllAlbums().then((data) => {
        dispatch({ type: actionType.SET_ALL_ALBUMS, allAlbums: data.data });
      });
    }
  }, []);

  const updateFilterLanguage = (value) => {
    dispatch({
      type: actionType.SET_LANGUAGE_FILTER,
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
    <div className="w-full my-4 px-6 py-4 flex items-start md:justify-start gap-10">
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
              data.value === filterLang ? "font-semibold" : "font-normal"
            } text-white cursor-pointer hover:font-semibold transition-all duration-100 ease-in-out px-8 focus:bg-blue-700 hover:bg-blue-900 bg_website_02 border rounded-full min-w-[100px]`}
          >
            {data.name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Filter;
