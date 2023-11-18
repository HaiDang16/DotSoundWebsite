import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, NavLink } from "react-router-dom";
import { IoLogoInstagram, IoLogoTwitter } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { getAllArtist } from "../api";
import { actionType } from "../context/reducer";
import { MdEdit } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import {
  SET_ALL_SONGS,
  SET_SONG_PLAYING,
  SET_ARTISTS,
  SET_ALL_ARTISTS,
} from "../store/actions";
import { AiOutlineClear } from "react-icons/ai";
import { IoAdd, IoPause, IoPlay, IoTrash } from "react-icons/io5";

const DashboardArtist = () => {
  const dispatch = useDispatch();
  const allArtists = useSelector((state) => state.customization.allArtists);
  const [isFocus, setIsFocus] = useState(false);
  const [artistFilter, setArtistFilter] = useState("");
  const [filteredArtists, setFilteredArtists] = useState(null);

  useEffect(() => {
    if (!allArtists) {
      getAllArtist().then((data) => {
        console.log("getAllArtist res: ", data.artists);
        dispatch({ type: SET_ALL_ARTISTS, allArtists: data.artists });
      });
    }
  }, []);

  useEffect(() => {
    if (artistFilter.length > 0) {
      const filtered = allArtists.filter((data) =>
        data.artistName.toLowerCase().includes(artistFilter)
      );
      setFilteredArtists(filtered);
    } else {
      setFilteredArtists(null);
    }
  }, [artistFilter]);

  return (
    <div className="w-full p-4 flex items-center justify-center flex-col">
      <div className="w-full flex justify-center items-center gap-24">
        <NavLink
          to={"/Admin/ManageArtists/Add"}
          className="flex items-center px-4 py-3 border rounded-md border-gray-300 hover:border-gray-400 hover:shadow-md cursor-pointer"
        >
          <IoAdd />
        </NavLink>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên nghệ sĩ"
          className={` w-64 px-4 py-2 border ${
            isFocus ? "border-gray-500 shadow-md" : "border-gray-300"
          } rounded-md bg-transparent outline-none duration-150 transition-all ease-in-out text-base text-white font-semibold`}
          value={artistFilter}
          onChange={(e) => setArtistFilter(e.target.value)}
          onBlur={() => setIsFocus(false)}
          onFocus={() => setIsFocus(true)}
        />

        {artistFilter && (
          <motion.i
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.75 }}
            onClick={() => {
              setArtistFilter("");
              setFilteredArtists(null);
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
              Tổng nghệ sĩ:{" "}
            </span>
            {filteredArtists ? filteredArtists?.length : allArtists?.length}
          </p>
        </div>
        {console.log("allArtists: ", allArtists)}
        {allArtists && (
          <AritstContainer
            data={filteredArtists ? filteredArtists : allArtists}
          />
        )}
      </div>
    </div>
  );
};

export const AritstContainer = ({ data }) => {
  return (
    <div className=" w-full  flex flex-wrap gap-3  items-center justify-evenly mt-5">
      {data.map((data, index) => (
        <ArtistCard key={index} data={data} index={index} />
      ))}
    </div>
  );
};

export const ArtistCard = ({ data, index }) => {
  const [isDelete, setIsDelete] = useState(false);
  console.log("ArtistCard data: ", data);
  const navigate = useNavigate();
  const handleEditClick = () => {
    navigate(`/Admin/ManageArtists/Update?id=${data._id}`);
  };
  return (
    <motion.div
      initial={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative w-44 min-w-180 px-2 py-4 gap-3 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-center"
    >
      <img
        src={data?.artistImageURL}
        className="w-full h-40 object-cover rounded-md"
        alt=""
      />

      <p className="w-full overflow-hidden text-base text-textColor text-center whitespace-nowrap overflow-ellipsis">
        {data.artistName}
      </p>
      <div className="flex items-center gap-4">
        <motion.i whileTap={{ scale: 0.75 }} onClick={handleEditClick}>
          <MdEdit className="text-green-400 hover:text-green-600 text-xl" />
        </motion.i>

        <a href={data.artistInstagram} target="_blank">
          <motion.i whileTap={{ scale: 0.75 }}>
            <IoLogoInstagram className="text-gray-500 hover:text-headingColor text-xl" />
          </motion.i>
        </a>
        <a href={data.artistTwitter} target="_blank">
          <motion.i whileTap={{ scale: 0.75 }}>
            <IoLogoTwitter className="text-gray-500 hover:text-headingColor text-xl" />
          </motion.i>
        </a>
      </div>
      {/* <motion.i
        className="absolute bottom-2 right-2"
        whileTap={{ scale: 0.75 }}
        onClick={() => setIsDelete(true)}
      >
        <MdDelete className=" text-gray-400 hover:text-red-400 text-xl cursor-pointer" />
      </motion.i> */}

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
              <p className="text-headingColor text-sm">Yes</p>
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

export default DashboardArtist;
