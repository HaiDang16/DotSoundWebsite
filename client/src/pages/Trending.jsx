import React, { useEffect, useState } from "react";
import { getAllSongs } from "../api";
import BackgroundLogin from "../assets/img/background.jpg";
import { blue_200, blue_600, banner } from "../assets/img";
import { useSelector, useDispatch } from "react-redux";
import { SET_ALL_SONGS, SET_USER, SET_AUTH } from "../store/actions";
import { getAuth } from "firebase/auth";
import { app } from "../config/firebase.config";
import {
  NewReleaseSongsCard,
  DiscoverySongsCard,
  Top10SongsCard,
  CategorySongsCard,
} from "../components";

const Home = () => {
  // useEffect =
  //   (() => {
  //     const firebaseAuth = getAuth(app);
  //     firebaseAuth
  //       .signOut()
  //       .then(() => {
  //         window.localStorage.setItem("auth", "false");
  //       })
  //       .catch((e) => console.log(e));
  //     window.localStorage.setItem("auth", "false");
  //     window.localStorage.removeItem("userData");
  //     dispatch({
  //       type: SET_AUTH,
  //       auth: false,
  //     });
  //     dispatch({
  //       type: SET_USER,
  //       user: null,
  //     });
  //   },[]);

  const dispatch = useDispatch();
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

      {/* Content ThinhHanh */}
      <div className="md:px-20 z-0">
        <div className="my-10">
          <div className=" text-white font-medium flex justify-between">
            <div className="my-2 text-2xl">Khám phá</div>
            <div className="px-4 my-2 text-lg">Tất cả</div>
          </div>
          <div className="h-56 w-full grid grid-rows-1 scroll-hidden gap-10 items-center overscroll-behavior-x-contain overflow-x-scroll">
            <div className="flex flex-nowrap">
              <DiscoverySongsCard
                musics={allSongs
                  .slice(0, 20)
                  .sort((a, b) => b.songName.localeCompare(a.songName))}
              />
            </div>
          </div>
        </div>

        <div className="my-2 text-2xl text-white font-medium">
          Mới phát hành
        </div>

        <NewReleaseSongsCard
          musics={allSongs
            .slice(0, 20)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))}
        />

        <div className="my-10">
          <div className=" text-white font-medium flex justify-between">
            <div className="my-2 text-2xl">Top 10</div>
            <div className="px-4 my-2 text-lg">Tất cả</div>
          </div>
          <div className="h-72 w-full grid grid-rows-1 scroll-hidden gap-10 items-center overscroll-behavior-x-contain overflow-x-scroll">
            <div className="flex flex-nowrap">
              <Top10SongsCard
                musics={allSongs
                  .slice(0, 20)
                  .sort((a, b) =>
                    b.songArtist.songArtistName.localeCompare(
                      a.songArtist.songArtistName
                    )
                  )}
              />
            </div>
          </div>
        </div>

        <div className="my-10">
          <div className=" text-white font-medium flex justify-between">
            <div className="my-2 text-2xl">Đề xuất</div>
            <div className="px-4 my-2 text-lg">Tất cả</div>
          </div>
          <div className="h-40 w-full grid grid-rows-1 scroll-hidden gap-10 items-center overscroll-behavior-x-contain overflow-x-scroll">
            <div className="flex flex-nowrap">
              <CategorySongsCard
                musics={allSongs
                  .slice(0, 20)
                  .sort((a, b) =>
                    a.songName
                      .toLowerCase()
                      .localeCompare(b.songName.toLowerCase())
                  )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
