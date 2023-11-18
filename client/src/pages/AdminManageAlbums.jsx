import React, { useEffect, useState } from "react";
import { useStateValue } from "../context/StateProvider";

import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import { actionType } from "../context/reducer";
import { getAllAlbums, deleteAlbumsById } from "../api";
import { MdEdit } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import {
  SET_ALL_SONGS,
  SET_SONG_PLAYING,
  SET_ALL_ALBUMS,
} from "../store/actions";
import { NavLink } from "react-router-dom";
import { IoAdd, IoPause, IoPlay, IoTrash } from "react-icons/io5";
import { AiOutlineClear } from "react-icons/ai";

const DashboardAlbum = () => {
  const dispatch = useDispatch();
  const allAlbums = useSelector((state) => state.customization.allAlbums);
  const [isFocus, setIsFocus] = useState(false);
  const [albumFilter, setAlbumFilter] = useState("");
  const [filteredAlbums, setFilteredAlbums] = useState(null);

  useEffect(() => {
    if (!allAlbums) {
      getAllAlbums().then((data) => {
        console.log("getAllAlbums res: ", data);
        dispatch({ type: SET_ALL_ALBUMS, allAlbums: data.albums });
      });
    }
  }, []);

  useEffect(() => {
    if (albumFilter.length > 0) {
      const filtered = allAlbums.filter(
        (data) =>
          data.albumName.toLowerCase().includes(albumFilter) ||
          data.albumArtist.albumArtistName.toLowerCase().includes(albumFilter)
      );
      console.log("filtered: ", filtered);
      setFilteredAlbums(filtered);
    } else {
      setFilteredAlbums(null);
    }
  }, [albumFilter]);

  return (
    <div className="w-full p-4 flex items-center justify-center flex-col">
      <div className="w-full flex justify-center items-center gap-24">
        <NavLink
          to={"/Admin/ManageAlbums/Add"}
          className="flex items-center px-4 py-3 border rounded-md border-gray-300 hover:border-gray-400 hover:shadow-md cursor-pointer"
        >
          <IoAdd />
        </NavLink>
        <input
          type="text"
          placeholder="Nhập từ khoá cần tìm kiếm"
          className={` w-64 px-4 py-2 border ${
            isFocus ? "border-gray-500 shadow-md" : "border-gray-300"
          } rounded-md bg-transparent outline-none duration-150 transition-all ease-in-out text-base text-white font-semibold`}
          value={albumFilter}
          onChange={(e) => setAlbumFilter(e.target.value)}
          onBlur={() => setIsFocus(false)}
          onFocus={() => setIsFocus(true)}
        />

        {albumFilter && (
          <motion.i
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.75 }}
            onClick={() => {
              setAlbumFilter("");
              setFilteredAlbums(null);
            }}
          >
            <AiOutlineClear className="text-3xl text-white cursor-pointer" />
          </motion.i>
        )}
      </div>
      <div className="relative w-full  my-4 p-4 py-12 border border-gray-300">
        <div className="absolute top-4 left-4">
          <p className="text-lg font-bold text-white">
            <span className="text-lg font-semibold text-white">
              Tổng album:{" "}
            </span>
            {filteredAlbums ? filteredAlbums?.length : allAlbums?.length}
          </p>
        </div>

        {allAlbums && (
          <AlbumContainer data={filteredAlbums ? filteredAlbums : allAlbums} />
        )}
      </div>
    </div>
  );
};
export const AlbumContainer = ({ data }) => {
  return (
    <div className=" w-full  flex flex-wrap gap-3  items-center justify-evenly mt-5">
      {data.map((data, index) => (
        <AlbumCard key={index} data={data} index={index} />
      ))}
    </div>
  );
};

export const AlbumCard = ({ data, index }) => {
  const [isDelete, setIsDelete] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  const dispatch = useDispatch();
  const deleteObject = (id) => {
    console.log(id);
    deleteAlbumsById(id).then((res) => {
      // console.log(res.data);
      if (res.data.success) {
        setAlert("success");
        setAlertMsg(res.data.msg);
        getAllAlbums().then((data) => {
          dispatch({
            type: SET_ALL_ALBUMS,
            allAlbums: data.data,
          });
        });
        setTimeout(() => {
          setAlert(false);
        }, 4000);
      } else {
        setAlert("error");
        setAlertMsg(res.data.msg);
        setTimeout(() => {
          setAlert(false);
        }, 4000);
      }
    });
  };
  return (
    <motion.div
      initial={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative  overflow-hidden w-44 min-w-180 px-2 py-4 gap-3 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-center"
    >
      <img
        src={data?.albumImageURL}
        className="w-full h-40 object-cover rounded-md"
        alt=""
      />

      <p className="w-full overflow-hidden text-base text-textColor text-center whitespace-nowrap overflow-ellipsis mb-2">
        {data.albumName}
      </p>

      <motion.i
        className="absolute bottom-2 right-2"
        whileTap={{ scale: 0.75 }}
        onClick={() => setIsDelete(true)}
      >
        <MdEdit className=" text-gray-400 hover:text-green-400 text-xl cursor-pointer" />
      </motion.i>

      {isDelete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="absolute inset-0 p-2 bg-darkOverlay  backdrop-blur-md flex flex-col items-center justify-center gap-4"
        >
          <p className="text-gray-100 text-base text-center">
            Are you sure do you want to delete this?
          </p>
          <div className="flex items-center w-full justify-center gap-3">
            <div className="bg-red-300 px-3 rounded-md">
              <p
                className="text-headingColor text-sm"
                onClick={() => deleteObject(data._id)}
              >
                Yes
              </p>
            </div>
            <div
              className="bg-green-300 px-3 rounded-md"
              onClick={() => setIsDelete(false)}
            >
              <p className="text-headingColor text-sm">No</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DashboardAlbum;
