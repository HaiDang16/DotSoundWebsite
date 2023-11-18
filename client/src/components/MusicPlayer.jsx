import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useStateValue } from "../context/StateProvider";
import { IoMdClose } from "react-icons/io";
import { IoArrowRedo, IoArrowUndo, IoMusicalNote } from "react-icons/io5";
import { motion } from "framer-motion";

import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { actionType } from "../context/reducer";
import { MdPlaylistPlay } from "react-icons/md";
import { getAllSongs } from "../api";
import { RiPlayListFill } from "react-icons/ri";
import {
  SET_ALL_SONGS,
  SET_SONG_PLAYING,
  SET_SONG,
  SET_MINI_PLAYER,
} from "../store/actions";
import { PlaylistCard } from "../components";

const MusicPlayer = () => {
  const [isPlayList, setIsPlayList] = useState(false);
  const dispatch = useDispatch();
  const isSongPlaying = useSelector(
    (state) => state.customization.isSongPlaying
  );
  const song = useSelector((state) => state.customization.song);
  const allSongs = useSelector((state) => state.customization.allSongs);
  const miniPlayer = useSelector((state) => state.customization.miniPlayer);

  const closeMusicPlayer = () => {
    if (isSongPlaying) {
      dispatch({
        type: SET_SONG_PLAYING,
        isSongPlaying: false,
      });
    }
  };

  const togglePlayer = () => {
    if (miniPlayer) {
      dispatch({
        type: SET_MINI_PLAYER,
        miniPlayer: false,
      });
    } else {
      dispatch({
        type: SET_MINI_PLAYER,
        miniPlayer: true,
      });
    }
  };

  const nextTrack = () => {
    if (song > allSongs.length) {
      dispatch({
        type: SET_SONG,
        song: 0,
      });
    } else {
      dispatch({
        type: SET_SONG,
        song: song + 1,
      });
    }
  };

  const previousTrack = () => {
    if (song === 0) {
      dispatch({
        type: SET_SONG,
        song: 0,
      });
    } else {
      dispatch({
        type: SET_SONG,
        song: song - 1,
      });
    }
  };

  useEffect(() => {
    if (song > allSongs.length) {
      dispatch({
        type: SET_SONG,
        song: 0,
      });
    }
  }, [song]);

  return (
    <div className="w-full full flex items-center gap-3 overflow-hidden">
      <div
        className={`w-full full items-center gap-3 p-4 z-10 ${
          miniPlayer ? "absolute top-40" : "flex relative"
        }`}
      >
        <img
          src={allSongs[song]?.songImageURL}
          className="w-40 h-20 object-cover rounded-md"
          alt=""
        />
        <div className="flex items-start flex-col">
          <p className="text-xl text-headingColor font-semibold">
            {`${
              allSongs[song]?.songName.length > 20
                ? allSongs[song]?.songName.slice(0, 20)
                : allSongs[song]?.songName
            }`}{" "}
            <span className="text-base">
              ({allSongs[song]?.songAlbum.songAlbumName})
            </span>
          </p>
          <p className="text-textColor">
            {allSongs[song]?.songArtist.songArtistName}{" "}
            <span className="text-sm text-textColor font-semibold">
              ({allSongs[song]?.songCategory.songCategoryName})
            </span>
          </p>
          <motion.i
            whileTap={{ scale: 0.8 }}
            onClick={() => setIsPlayList(!isPlayList)}
          >
            <RiPlayListFill className="text-textColor hover:text-headingColor text-3xl cursor-pointer" />
          </motion.i>
        </div>
        <div className="flex-1">
          <AudioPlayer
            src={allSongs[song]?.songURL}
            onPlay={() => console.log("is playing")}
            autoPlay={true}
            showSkipControls={true}
            onClickNext={nextTrack}
            onClickPrevious={previousTrack}
          />
        </div>
        <div className="h-full flex items-center justify-center flex-col gap-3">
          <motion.i whileTap={{ scale: 0.8 }} onClick={closeMusicPlayer}>
            <IoMdClose className="text-textColor hover:text-headingColor text-2xl cursor-pointer" />
          </motion.i>
          <motion.i whileTap={{ scale: 0.8 }} onClick={togglePlayer}>
            <IoArrowRedo className="text-textColor hover:text-headingColor text-2xl cursor-pointer" />
          </motion.i>
        </div>
      </div>

      {isPlayList && (
        <>
          <PlaylistCard />
        </>
      )}

      {miniPlayer && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed right-2 bottom-2 "
        >
          <div className="w-40 h-40 rounded-full flex items-center justify-center  relative ">
            <div className="absolute inset-0 rounded-full bg-red-600 blur-xl animate-pulse"></div>
            <img
              onClick={togglePlayer}
              src={allSongs[song]?.songImageURL}
              className="z-50 w-32 h-32 rounded-full object-cover cursor-pointer"
              alt=""
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MusicPlayer;
