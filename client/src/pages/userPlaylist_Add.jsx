// import AlertError from "../../components/shared/AlertError";
// import AlertSuccess from "../../components/shared/AlertSuccess";
import React, { useState, useEffect } from "react";
import SongtItemCard from "../components/SongItemCard";
import { storage } from "../config/firebase.config";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { MdDelete } from "react-icons/md";
// import Loading from "../../components/users/Loading";
import { NavLink, useNavigate } from "react-router-dom";
import { IoSearch, IoCartOutline, IoPersonSharp } from "react-icons/io5";
// import User_ChangePass from "../../components/users/User_ChangePass";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FilterButtonsCategory,
  FilterButtons,
  ImageLoader,
  ImageUploader,
  PlaylistSearchCard,
  ImageUploaderPlaylist,
} from "../components";
import { getAllSongs, createPlaylist } from "../api";
import SearchCard from "../pages/SearchCard";
import { SET_ALL_SONGS, SET_SONG_PLAYING, SET_SONG } from "../store/actions";
import SideBar from "../layouts/UserLayout/SideBar";
import { FaWindowClose } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import AlertErrorBottom from "../components/AlertErrorBottom";
import AlertSuccessBottom from "../components/AlertSuccessBottom";
const moment = require("moment");
const baseURL = "http://localhost:4000/";
const OrderCard = ({ data, index, id, onDelete, songID, setQuantity }) => {
  const dispatch = useDispatch();
  const [songData, setSongData] = useState();

  const allSongs = useSelector((state) => state.customization.allSongs);
  const handleDelete = () => {
    onDelete(id);
  };
  if (!allSongs) {
    getAllSongs().then((data) => {
      dispatch({
        type: SET_ALL_SONGS,
        allSongs: data.songs,
      });
    });
  }
  const foundSong = allSongs.find((song) => song._id === songID);
  console.log("foundSong: ", foundSong);
  return (
    <div className="relative flex center h-auto w-full px-4">
      <div className="rounded-full  flex items-center justify-center px-3 max-h-9">
        <img src={foundSong.songImageURL} className="w-10 h-10" />
      </div>
      <div className="flex items-center justify-center  text-gray-900">
        <p>{foundSong.songName}</p>
      </div>
      <div className="flex items-center justify-center flex-auto text-gray-500">
        <p>{foundSong.songArtist.songArtistName}</p>
      </div>

      <div className="flex items-center justify-center px-3">
        <button onClick={handleDelete}>
          <FaWindowClose className=" hover:text-red-800" />
        </button>
      </div>
    </div>
  );
};

const UserPlaylist_Add = () => {
  const userData = JSON.parse(window.localStorage.getItem("userData"));
  const allSongs = useSelector((state) => state.customization.allSongs);
  const [isSreach, setIsSearch] = useState(false);
  const [filteredSongs, setFilteredSongs] = useState(null);
  const [songFilter, setSongFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isAlert, setIsAlert] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [playlistImage, setPlaylistImage] = useState(null);
  const [playlistName, setPlaylistName] = useState("");

  //hàm lưu trữ sản phẩm đã chọn
  const [selectedPlaylist, setSelectedPlaylist] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  useEffect(() => {
    if (songFilter.length > 0) {
      const filtered = allSongs.filter(
        (data) =>
          data.songName.toLowerCase().includes(songFilter.toLowerCase()) ||
          data.songArtist.songArtistName
            .toLowerCase()
            .includes(songFilter.toLowerCase()) |
            data.songAlbum.songAlbumName
              .toLowerCase()
              .includes(songFilter.toLowerCase())
      );
      setFilteredSongs(filtered.slice(0, 5));
    } else {
      setFilteredSongs(null);
    }
  }, [songFilter]);

  const handleOutsideClick = (event) => {
    if (filteredSongs !== 0 && songFilter) {
      const searchContainer = document.getElementById("searchContainer");
      if (searchContainer && !searchContainer.contains(event.target)) {
        setFilteredSongs(null);
        setSongFilter("");
      }
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [songFilter, filteredSongs]);

  // Hàm xử lý xóa sản phẩm
  const handleDeletePlaylist = (id) => {
    const updatedPlaylist = selectedSongs.filter((p) => p.id !== id);
    setSelectedSongs(updatedPlaylist);
  };

  const fadeDownVariant = {
    initial: {
      opacity: 0,
      y: -20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
      },
    },
  };
  const handleClickSearch = () => {
    setIsSearch(true);
  };
  const handleAddPlaylist = () => {
    if (!playlistName) {
      setIsAlert("error");
      setAlertMessage("Vui lòng nhập tên cho danh sách phát");
      setTimeout(() => {
        setIsAlert(null);
      }, 2000);
    }

    const dataReq = {
      name: playlistName,
      imageURL: playlistImage,
      userID: userData.user._id,
      lstSong: selectedSongs,
    };

    createPlaylist(dataReq).then((res) => {
      console.log("createPlaylist res: ", res);
      if (res.status === 200) {
        setIsAlert("success");
        setAlertMessage(res.data.message);
        setTimeout(() => {
          setIsAlert(null);
          navigate("/UserPlaylist");
        }, 1500);
      } else {
        setIsAlert("error");
        setAlertMessage(res.data.message);
        setTimeout(() => {
          setIsAlert(null);
        }, 1500);
      }
    });
  };
  const handleBack = () => {
    navigate("/UserPlaylist");
  };

  const handleClear = () => {
    setPlaylistName("");
    setPlaylistImage(null);
    setSelectedSongs([]);
  };
  const [selectedSongs, setSelectedSongs] = useState([]);
  const handleSongSelect = (song) => {
    const isSongSelected = selectedSongs.some(
      (selectedSong) => selectedSong.songID === song.songID
    );

    if (!isSongSelected) {
      setSelectedSongs([...selectedSongs, song]);
      console.log(selectedSongs);
    } else {
      //Nếu trùng bài hát
    }
  };
  const deleteImageObject = (songURL) => {
    setIsLoading(true);
    setPlaylistImage(null);
    const deleteRef = ref(storage, songURL);
    deleteObject(deleteRef).then(() => {
      setIsAlert("success");
      setAlertMessage("Xoá hình ảnh thành công");
      setTimeout(() => {
        setIsAlert(null);
      }, 4000);
      setIsLoading(false);
    });
  };

  const [searchResults, setSearchResults] = useState([]); // Thêm state cho kết quả tìm kiếm
  const [updated, setUpdated] = useState(0);
  return (
    <div className="h-auto mt-[120px] mb-16 w-full flex justify-center items-center">
      <div className="w-10/12 flex justify-center">
        <SideBar updated={updated} />
        <div className="md:w-4/6 md:pl-[50px]">
          <h1 className="text-2xl font-bold mb-4">Các danh sách phát</h1>
          <div className="flex ">
            <label className="mr-4  p-2 font-medium  w-1/2">
              Tên danh sách phát:
            </label>
            <input
              placeholder="Tên playlist"
              className=" p-2 w-1/2"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
          </div>
          <div className="flex my-10">
            <label className="mr-4  p-2 font-medium  w-1/2">
              Tải ảnh cho danh sách phát
            </label>
            <div className="w-150 h-150 border-2 rounded-lg ">
              {isLoading && <ImageLoader progress={progress} />}
              {!isLoading && (
                <>
                  {!playlistImage ? (
                    <ImageUploaderPlaylist
                      setImageURL={setPlaylistImage}
                      setAlert={setIsAlert}
                      alertMsg={setAlertMessage}
                      isLoading={setIsLoading}
                      setProgress={setProgress}
                    />
                  ) : (
                    <div className="relative w-full h-full overflow-hidden rounded-md">
                      <img
                        src={playlistImage}
                        alt="uploaded image"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                        onClick={() => {
                          deleteImageObject(playlistImage);
                        }}
                      >
                        <MdDelete className="text-white" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex w-full justify-between h-auto">
            <div className=" flex-col items-end justify-end w-1/2">
              <div className=" w-full my-3 flex justify-end">
                <div className=" w-full gap-4 px-3 py-2 rounded-xl focus:outline-none flex items-center shadow-lg border-solid border-2 border-slate-300">
                  <IoSearch className="text-2xl " />
                  <input
                    type="text"
                    className="w-full h-full bg-transparent text-lg text-black border-none outline-none "
                    placeholder="Tìm kiếm bài hát, nghệ sĩ,..."
                    value={songFilter}
                    onChange={(e) => setSongFilter(e.target.value)}
                    onClick={handleClickSearch}
                  />
                  {isSreach && filteredSongs && filteredSongs.length !== 0 && (
                    <motion.div
                      variants={fadeDownVariant}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 50 }}
                      className="fade-down absolute z-10 top-16 flex flex-col gap-3 w-96 bg-slate-200 shadow-lg rounded-b-lg backdrop-blur-sm py-2"
                      id="searchContainer"
                    >
                      {filteredSongs && filteredSongs.length !== 0 ? (
                        filteredSongs?.map((search, index) => (
                          <PlaylistSearchCard
                            key={search._id}
                            songName={search.songName}
                            songImageURL={search.songImageURL}
                            index={index}
                            songID={search._id}
                            songAlbum={search.songAlbum.songAlbumName}
                            songArtist={search.songArtist.songArtistName}
                            onSelect={(song) => handleSongSelect(song)}
                          />
                        ))
                      ) : (
                        <div className="flex-auto h-full w-full flex flex-col py-4">
                          <div className="flex items-center">
                            <p className="text-gray-700 font-medium tracking-widest text-center p-5">
                              Không có kết quả tìm kiếm phù hợp
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-9 flex flex-col h-full w-3/4 mx-4">
              <label className="w-full  max-h-9 block font-bold p-2 pr-3">
                Danh sách bài hát:
              </label>
              {selectedSongs && selectedSongs.length > 0 ? (
                // Nếu có sản phẩm được chọn, hiển thị danh sách sản phẩm
                selectedSongs.map((song) => (
                  <div
                    key={song.songID}
                    className="w-full border bg-gray-100 rounded-lg p-2 flex flex-col mb-1 flex-wrap"
                  >
                    {console.log("song: ", song)}
                    <OrderCard
                      key={song.songID}
                      songID={song.songID}
                      onDelete={() => handleDeletePlaylist(song.id)}
                    />
                  </div>
                ))
              ) : (
                // Nếu chưa có sản phẩm được chọn, hiển thị thông báo hoặc nội dung khác
                <div className="w-full h-auto border bg-gray-100 rounded-lg p-2 flex flex-col mb-1">
                  Chưa có bài hát được chọn.
                </div>
              )}
            </div>
          </div>
          <div className="my-4">
            <button
              className="min-w-[120px] h-10 rounded-xl bg_website_02 text-lg font-normal text-white"
              onClick={handleAddPlaylist}
            >
              Lưu
            </button>
            <button
              className="min-w-[120px] h-10 rounded-xl bg_website_02 text-lg font-normal text-white mx-4 "
              onClick={handleClear}
            >
              Làm mới
            </button>
            <button
              className="min-w-[120px] h-10 rounded-xl bg_website_02 text-lg font-normal text-white"
              onClick={handleBack}
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
      {isAlert && (
        <>
          {isAlert === "success" ? (
            <AlertSuccessBottom msg={alertMessage} />
          ) : (
            <AlertErrorBottom msg={alertMessage} />
          )}
        </>
      )}
    </div>
  );
};
export default UserPlaylist_Add;
