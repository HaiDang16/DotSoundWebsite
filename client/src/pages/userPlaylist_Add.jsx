// import AlertError from "../../components/shared/AlertError";
// import AlertSuccess from "../../components/shared/AlertSuccess";
import React, { useState, useEffect } from "react";
import SongtItemCard from "../components/SongItemCard";
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
  DisabledButton,
  FilterButtonsArtist,
  FilterButtonsAlbum,
} from "../components";
import { deleteSongById, getAllSongs } from "../api";
import SearchCard from "../pages/SearchCard";
import { SET_ALL_SONGS, SET_SONG_PLAYING, SET_SONG } from "../store/actions";
import SideBar from "../layouts/UserLayout/SideBar";
import { FaTrash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";

const moment = require("moment");
const baseURL = "http://localhost:4000/";
const OrderCard = ({
  data,
  index,
  id,
  songName,
  songImageURl,
  songArtist,
  songLanguage,
  onDelete,
  songID,
  setQuantity,
}) => {
  const handleDelete = () => {
    // Gọi hàm xóa với id của sản phẩm
    onDelete(id);
  };

  return (
    <div className="flex center">
      <div className="flex items-center gap-2 w-3/12 flex-auto">
        <div className="rounded-full w-full">
          <img src={songImageURl} alt="Rectangle4329" />
        </div>
        <div className=" w-2/4">
          <p>{songName}</p>
        </div>
      </div>
      <div className="flex items-center justify-center w-1/12 flex-auto pr-7">
        <p>{songArtist}</p>
      </div>

      <div className="flex items-center justify-center w-1/12 pr-5 flex-auto">
        <button onClick={handleDelete}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

const UserPlaylist_Add = () => {
  const user = JSON.parse(window.localStorage.getItem("userData"));
  const allSongs = useSelector((state) => state.customization.allSongs);
  const [isSreach, setIsSearch] = useState(false);
  const [filteredSongs, setFilteredSongs] = useState(null);
  const [songFilter, setSongFilter] = useState("");

  //hàm lưu trữ sản phẩm đã chọn
  const [selectedPlaylist, setSelectedPlaylist] = useState([]);
  const dispatch = useDispatch();

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
    /// Xóa sản phẩm khỏi danh sách
    const updatedPlaylist = selectedPlaylist.filter((p) => p.id !== id);
    setSelectedPlaylist(updatedPlaylist);
  };
  function SearchBar() {
    const [searchTerm, setSearchTerm] = useState("");

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

    const handleSearchCardSelect = (song) => {
      setSearchResults([...searchResults, song]);
    };

    const [isSreach, setIsSreach] = useState(false);
    return (
      <div
        onMouseEnter={() => setIsSreach(true)}
        onMouseLeave={() => setIsSreach(false)}
        className=" w-full my-3 flex justify-end"
      >
        <div className=" w-full gap-4 px-3 py-2 rounded-xl focus:outline-none flex items-center shadow-lg border-solid border-2 border-slate-300">
          <IoSearch className="text-2xl " />
          <input
            type="text"
            value={songFilter}
            className="w-full h-full bg-transparent text-lg text-black  border-none outline-none "
            placeholder="Tìm kiếm bài hát, nghệ sĩ,..."
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
                  <SearchCard
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
    );
  }
  const [selectedSongs, setSelectedSongs] = useState([]);
  const handleSongSelect = (song) => {
    setSelectedSongs([...selectedSongs, song]);
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
            <input placeholder="Tên playlist" className=" p-2 w-1/2" />
          </div>
          <div className="flex my-10">
            <label className="mr-4  p-2 font-medium  w-1/2">
              Chọn hình ảnh đại diện
            </label>
            <div className="w-150 h-150 border-2 rounded-lg ">
              <ImageUploader />
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className=" flex-col items-end justify-end w-1/2">
              <SearchBar setSearchResults={setSearchResults} />
            </div>

            <div className="mb-9 flex max-h-9 flex-col">
              <label className="w-full block font-bold p-2 pr-3">
                Danh sách bài hát:
              </label>
              {selectedSongs && selectedSongs.length > 0 ? (
                // Nếu có sản phẩm được chọn, hiển thị danh sách sản phẩm
                selectedSongs.map((song) => (
                  <div
                    key={song.id}
                    className="w-full border bg-gray-100 rounded-lg p-2 flex flex-col mb-1"
                  >
                    <OrderCard
                      songName={song.songName}
                      songArtist={song.songArtist}
                      songAlbum={song.songAlbum}
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
          <div className="my-4 mt-20">
            <button className="min-w-[120px] h-10 rounded-xl bg_website_02 text-lg font-normal text-white">
              Lưu
            </button>
            <button className="min-w-[120px] h-10 rounded-xl bg_website_02 text-lg font-normal text-white mx-4 ">
              Xóa
            </button>
            <button className="min-w-[120px] h-10 rounded-xl bg_website_02 text-lg font-normal text-white">
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserPlaylist_Add;
