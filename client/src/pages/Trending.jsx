import React, { useEffect, useState } from "react";
import { getAllSongs } from "../api";
import BackgroundLogin from "../assets/img/background.jpg";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import { SongCard } from "./AdminManageSongs";
import Filter from "./Filter";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { blue_200, blue_600, banner } from "../assets/img";
import Release from "./Release";
import { filterByLanguage } from "../utils/supportfunctions";
import Footer from "../components/Footer";
import { useSelector, useDispatch } from "react-redux";
import { SET_ALL_SONGS, SET_SONG_PLAYING } from "../store/actions";
import {
  NewReleaseSongsCard,
  DiscoverySongsCard,
  Top10SongsCard,
  CategorySongsCard,
} from "../components";

const Home = () => {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.customization.searchTerm);
  const isSongPlaying = useSelector(
    (state) => state.customization.isSongPlaying
  );
  const song = useSelector((state) => state.customization.song);
  const allSongs = useSelector((state) => state.customization.allSongs);
  const artistFilter = useSelector((state) => state.customization.artistFilter);
  const filterTerm = useSelector((state) => state.customization.filterTerm);
  const albumFilter = useSelector((state) => state.customization.albumFilter);
  const languageFilter = useSelector(
    (state) => state.customization.languageFilter
  );
  const categoryFilter = useSelector(
    (state) => state.customization.categoryFilter
  );
  const [filteredSongs, setFilteredSongs] = useState(null);

  useEffect(() => {
    if (!allSongs) {
      getAllSongs().then((data) => {
        dispatch({
          type: SET_ALL_SONGS,
          allSongs: data.songs,
        });
        console.log("data getAllSong: ", data.songs);
      });
    }
  }, []);

  useEffect(() => {
    // if (searchTerm && searchTerm.length > 0) {
    //   const filtered = allSongs.filter(
    //     (data) =>
    //       data.artist.toLowerCase().includes(searchTerm) ||
    //       data.language.toLowerCase().includes(searchTerm) ||
    //       data.name.toLowerCase().includes(searchTerm) ||
    //       data.artist.includes(artistFilter)
    //   );
    //   setFilteredSongs(filtered);
    // } else {
    //   setFilteredSongs(null);
    // }
  }, [searchTerm]);

  // useEffect(() => {
  //   const filtered = allSongs?.filter((data) => data.artist === artistFilter);
  //   if (filtered) {
  //     setFilteredSongs(filtered);
  //   } else {
  //     setFilteredSongs(null);
  //   }
  // }, [artistFilter]);

  // useEffect(() => {
  //   const filterByLanguage = allSongs?.filter(
  //     (data) => data.songLanguage.toLowerCase() === languageFilter
  //   );
  //   if (filterByLanguage) {
  //     setFilteredSongs(filterByLanguage);
  //   } else {
  //     setFilteredSongs(null);
  //   }
  // }, [filterTerm]);

  // useEffect(() => {
  //   const filtered = allSongs?.filter((data) => data.album === albumFilter);
  //   if (filtered) {
  //     setFilteredSongs(filtered);
  //   } else {
  //     setFilteredSongs(null);
  //   }
  // }, [albumFilter]);

  useEffect(() => {
    const filterByLanguage = allSongs?.filter(
      (data) => data.songLanguage === languageFilter
    );
    if (filterByLanguage) {
      setFilteredSongs(filterByLanguage);
    } else {
      setFilteredSongs(null);
    }
  }, [languageFilter]);

  return (
    <div
      style={{ backgroundImage: `url(${BackgroundLogin})` }}
      className="relative w-full h-auto flex flex-col justify-center"
    >
      {/* Banner */}
      <div className="w-full h-full absolute z-0">
        <img
          className="w-656 h-510 right-0 absolute "
          src={blue_200}
          alt="Banner1"
        />
        <img src={blue_600} alt="blue_600" />
      </div>
      <div className="h-auto w-full mt-16 z-1-3">
        <img
          src={banner}
          alt="banner"
          className="absolute z-10 md:p-32 h-auto w-full flex justify-center "
        />
        <div className="w-full ">
          <img
            src={banner}
            alt="banner"
            className=" h-screen z-2-3 w-auto blur-sm items-center"
          />
        </div>
      </div>

      {/*       
      <div className="w-full h-auto flex items-center justify-evenly gap-4 flex-wrap p-4">
        <HomeSongContainer musics={filteredSongs ? filteredSongs : allSongs} />
      </div> */}

      {/* Content ThinhHanh */}
      <div className="md:px-20 z-0">
        <div className="my-10">
          <div className=" text-white font-medium flex justify-between">
            <div className="my-2 text-2xl">Khám phá</div>
            <div className="px-4 my-2 text-lg">Tất cả</div>
          </div>
          <div className="h-56 w-full grid grid-rows-1 scroll-hidden gap-10 items-center overscroll-behavior-x-contain overflow-x-scroll">
            <div className="flex flex-nowrap">
              <DiscoverySongsCard musics={allSongs} />
            </div>
          </div>
        </div>

        <div className="my-2 text-2xl text-white font-medium">
          Mới phát hành
        </div>

        <NewReleaseSongsCard musics={allSongs} />

        <div className="my-10">
          <div className=" text-white font-medium flex justify-between">
            <div className="my-2 text-2xl">Top 10</div>
            <div className="px-4 my-2 text-lg">Tất cả</div>
          </div>
          <div className="h-72 w-full grid grid-rows-1 scroll-hidden gap-10 items-center overscroll-behavior-x-contain overflow-x-scroll">
            <div className="flex flex-nowrap">
              <Top10SongsCard musics={allSongs} />
            </div>
          </div>
        </div>

        <div className="my-10">
          <div className=" text-white font-medium flex justify-between">
            <div className="my-2 text-2xl">Thể loại</div>
            <div className="px-4 my-2 text-lg">Tất cả</div>
          </div>
          <div className="h-40 w-full grid grid-rows-1 scroll-hidden gap-10 items-center overscroll-behavior-x-contain overflow-x-scroll">
            <div className="flex flex-nowrap">
              <CategorySongsCard musics={allSongs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
