import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AiOutlineClear } from "react-icons/ai";
import { deleteSongById, getAllSongs } from "../api";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import { IoAdd, IoPause, IoPlay, IoTrash } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import AlertSuccess from "../components/AlertSuccess";
import AlertError from "../components/AlertError";
import AlertErrorBottom from "../components/AlertErrorBottom";
import AlertSuccessBottom from "../components/AlertSuccessBottom";
import { useSelector, useDispatch } from "react-redux";
import { FaPlay } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { SET_ALL_SONGS, SET_SONG_PLAYING, SET_SONG } from "../store/actions";
const DashboardSongs = () => {
  const dispatch = useDispatch();

  const allSongs = useSelector((state) => state.customization.allSongs);
  const [songFilter, setSongFilter] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [filteredSongs, setFilteredSongs] = useState(null);

  useEffect(() => {
    if (!allSongs) {
      getAllSongs().then((data) => {
        console.log(" data.songs: ", data.songs);
        dispatch({
          type: SET_ALL_SONGS,
          allSongs: data.songs,
        });
      });
    }
  }, []);

  useEffect(() => {
    if (songFilter.length > 0) {
      const filtered = allSongs.filter((data) =>
        data.songName.toLowerCase().includes(songFilter)
      );
      setFilteredSongs(filtered);
    } else {
      setFilteredSongs(null);
    }
  }, [songFilter]);

  return (
    <div className="w-full p-4 flex items-center justify-center flex-col">
      <div className="w-full flex justify-center items-center gap-24">
        <NavLink
          to={"/Admin/ManageSongs/Add"}
          className="flex items-center px-4 py-3 border rounded-md border-gray-300 hover:border-gray-400 hover:shadow-md cursor-pointer"
        >
          <IoAdd />
        </NavLink>
        <input
          type="text"
          placeholder="Search here"
          className={`w-52 px-4 py-2 border ${
            isFocus ? "border-gray-500 shadow-md" : "border-gray-300"
          } rounded-md bg-transparent outline-none duration-150 transition-all ease-in-out text-base text-textColor font-semibold`}
          value={songFilter}
          onChange={(e) => setSongFilter(e.target.value)}
          onBlur={() => setIsFocus(false)}
          onFocus={() => setIsFocus(true)}
        />

        {songFilter && (
          <motion.i
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.75 }}
            onClick={() => {
              setSongFilter("");
              setFilteredSongs(null);
            }}
          >
            <AiOutlineClear className="text-3xl text-white cursor-pointer" />
          </motion.i>
        )}
      </div>

      <div className="relative w-full  my-4 p-4 py-12 border border-gray-300">
        <div className="absolute top-4 left-4">
          <p className="text-xl font-bold text-white">
            <span className="text-sm font-semibold text-white">
              Tổng bài hát :{" "}
            </span>
            {filteredSongs ? filteredSongs?.length : allSongs?.length}
          </p>
        </div>

        <SongContainer data={filteredSongs ? filteredSongs : allSongs} />
      </div>
    </div>
  );
};

export const SongContainer = ({ data }) => {
  return (
    <div className=" w-full flex flex-wrap gap-3  items-center justify-evenly">
      {data &&
        data.map((song, i) => (
          <SongCard key={song._id} data={song} index={i} />
        ))}
    </div>
  );
};

export const SongCard = ({ data, index }) => {
  const dispatch = useDispatch();
  const [isDeleted, setIsDeleted] = useState(false);
  console.log("isDeleted: ", isDeleted);
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const song = useSelector((state) => state.customization.song);
  const allSongs = useSelector((state) => state.customization.allSongs);
  const isSongPlaying = useSelector(
    (state) => state.customization.isSongPlaying
  );

  const addSongToContext = () => {
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

  const deleteObject = (id) => {
    console.log(id);
    deleteSongById(id).then((res) => {
      if (res.data.success) {
        setAlert("success");
        setAlertMsg(res.data.message);
        setTimeout(() => {
          setAlert(false);
          getAllSongs().then((data) => {
            dispatch({
              type: SET_ALL_SONGS,
              allSongs: data.songs,
            });
          });
        }, 1500);
      } else {
        setAlert("error");
        setAlertMsg(res.data.msg);
        setTimeout(() => {
          setAlert(false);
        }, 1500);
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative w-40 min-w-210 px-2 py-4 cursor-pointer hover:shadow-xl  bg_website_02 shadow-md rounded-lg flex flex-col items-center"
      //onClick={addSongToContext}
    >
      {isDeleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          className="absolute z-10 p-2 inset-0 bg-card backdrop-blur-md flex flex-col gap-6 items-center justify-center"
        >
          <p className="text-sm text-center text-black font-semibold">
            Bạn chắc chắn muốn xoá bài hát này?
          </p>

          <div className="flex items-center gap-3">
            <button
              className="text-sm px-4 py-1 rounded-md text-white hover:shadow-md bg-red-400"
              onClick={() => deleteObject(data._id)}
            >
              Xoá
            </button>
            <button
              className="text-sm px-4 py-1 rounded-md text-white hover:shadow-md bg-gray-400"
              onClick={() => setIsDeleted(false)}
            >
              Huỷ
            </button>
          </div>
        </motion.div>
      )}

      <div className="w-40 min-w-[160px] h-40 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={data.songImageURL}
          alt="Hình ảnh"
          className=" w-full h-full rounded-lg object-cover"
        />
      </div>

      <p className="w-full text-base text-white font-semibold my-3 text-center">
        {data.songName.length > 25
          ? `${data.songName.slice(0, 25)}`
          : data.songName}
        <span className="block text-sm text-gray-400 my-1">
          {data.songArtist.songArtistName}
        </span>
      </p>
      <div></div>
      <div className="py-2 z-10 w-full">
        <motion.i>
          <div className=" absolute z-10 bottom-4 left-40 px-4">
            <IoTrash
              size={20}
              className="text-base text-red-400 drop-shadow-md hover:text-red-600 "
              onClick={() => setIsDeleted(true)}
            />
          </div>
        </motion.i>

        <motion.i>
          <div className="absolute z-10 bottom-4 left-32 flex items-center justify-between px-4">
            <MdEdit
              size={20}
              className="text-base text-green-400 drop-shadow-md hover:text-green-600 "
              //onClick={() => setIsDeleted(true)}
            />
          </div>
        </motion.i>

        <motion.i>
          <div className="absolute z-10 bottom-4 left-1 flex items-center justify-between px-4">
            <IoPlay
              size={20}
              className="text-base text-white drop-shadow-md hover:text-gray-400 "
              onClick={addSongToContext}
            />
          </div>
        </motion.i>
      </div>

      {alert && (
        <>
          {alert === "success" ? (
            <AlertSuccessBottom msg={alertMsg} />
          ) : (
            <AlertErrorBottom msg={alertMsg} />
          )}
        </>
      )}
    </motion.div>
  );
};

export default DashboardSongs;
