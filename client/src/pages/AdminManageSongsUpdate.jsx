import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ref, deleteObject } from "firebase/storage";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { storage } from "../config/firebase.config";
import {
  getAllAlbums,
  getAllArtist,
  getAllCategories,
  getAllSongs,
  getSongDetails,
  updateSong,
} from "../api";
import { filterByLanguage } from "../utils/supportfunctions";
import {
  SET_ALL_SONGS,
  SET_ALL_ALBUMS,
  SET_ALL_CATEGORIES,
  SET_ALL_ARTISTS,
  SET_ARTIST_FILTER,
  SET_ALBUM_FILTER,
  SET_LANGUAGE_FILTER,
  SET_CATEGORY_FILTER,
  SET_FILTER_TERM,
} from "../store/actions";
import {
  FilterButtonsCategory,
  FilterButtons,
  ImageLoader,
  ImageUploader,
  DisabledButton,
  FilterButtonsArtist,
  FilterButtonsAlbum,
  AlertErrorBottom,
  AlertSuccessBottom,
} from "../components";

const DashboardNewSong = () => {
  const [searchParams] = useSearchParams();
  const songID = searchParams.get("id");
  console.log("songID: ", songID);

  const [isImageLoading, setIsImageLoading] = useState(false);
  const [songImageUrl, setSongImageUrl] = useState(null);
  const [setAlert, setSetAlert] = useState(null);
  const [alertMsg, setAlertMsg] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [songName, setSongName] = useState("");
  const [audioAsset, setAudioAsset] = useState(null);
  const audioRef = useRef();
  const dispatch = useDispatch();

  const allArtists = useSelector((state) => state.customization.allArtists);
  const allAlbums = useSelector((state) => state.customization.allAlbums);
  const allCategories = useSelector(
    (state) => state.customization.allCategories
  );
  let albumFilter = useSelector((state) => state.customization.albumFilter);
  let artistFilter = useSelector((state) => state.customization.artistFilter);
  let languageFilter = useSelector(
    (state) => state.customization.languageFilter
  );
  let categoryFilter = useSelector(
    (state) => state.customization.categoryFilter
  );
  console.log("albumFilter: ", albumFilter);
  console.log("categoryFilter: ", categoryFilter);

  let songData;
  useEffect(() => {
    getSongDetails(songID).then((data) => {
      console.log("getSongDetails res: ", data);
      songData = data.song;
      console.log("songData: ", songData);
      setSongName(songData.songName);
      artistFilter = songData.songArtist.songArtistID;
      console.log("artistFilter first: ", artistFilter);
      dispatch({
        type: SET_ARTIST_FILTER,
        artistFilter: songData.songArtist.songArtistID,
      });
      dispatch({
        type: SET_ALBUM_FILTER,
        albumFilter: songData.songAlbum.songAlbumID,
      });
      dispatch({
        type: SET_LANGUAGE_FILTER,
        languageFilter: songData.songLanguage,
      });
      dispatch({
        type: SET_CATEGORY_FILTER,
        categoryFilter: songData.songCategory.songCategoryID,
      });
      setSongImageUrl(songData.songImageURL);
      setAudioAsset(songData.songURL);
    });
  }, []);

  useEffect(() => {
    if (!allArtists) {
      getAllArtist().then((data) => {
        dispatch({ type: SET_ALL_ARTISTS, allArtists: data.artists });
      });
    }

    if (!allAlbums) {
      getAllAlbums().then((data) => {
        dispatch({ type: SET_ALL_ALBUMS, allAlbums: data.albums });
      });
    }

    if (!allCategories) {
      getAllCategories().then((res) => {
        dispatch({ type: SET_ALL_CATEGORIES, allCategories: res.categories });
      });
    }
  }, []);

  const deleteImageObject = (songURL, action) => {
    if (action === "image") {
      setIsImageLoading(true);
      setSongImageUrl(null);
    } else {
      setIsAudioLoading(true);
      setAudioAsset(null);
    }
    const deleteRef = ref(storage, songURL);
    deleteObject(deleteRef).then(() => {
      setSetAlert("success");
      setAlertMsg("Xoá thành công");
      setTimeout(() => {
        setSetAlert(null);
      }, 4000);
      setIsImageLoading(false);
      setIsAudioLoading(false);
    });
  };

  const saveSong = () => {
    if (
      !songImageUrl ||
      !audioAsset ||
      !songName ||
      !artistFilter ||
      !languageFilter ||
      !categoryFilter
    ) {
      setSetAlert("error");
      setAlertMsg("Required fields are missing");
      setTimeout(() => {
        setSetAlert(null);
      }, 4000);
      return;
    } else {
      setIsImageLoading(true);
      setIsAudioLoading(true);
      let albumName = null;
      if (albumFilter) {
        albumName = allAlbums.find(
          (album) => album._id === albumFilter
        )?.albumName;
      }

      const artistName = allArtists.find(
        (art) => art._id === artistFilter
      )?.artistName;

      const categoryName = allCategories.find(
        (cat) => cat._id === categoryFilter
      )?.catName;

      const dataReq = {
        songName,
        songImageUrl,
        audioAsset,
        albumFilter,
        artistFilter,
        languageFilter,
        categoryFilter,
        artistName,
        categoryName,
        albumName,
        songID,
      };
      console.log("dataReq: ", dataReq);

      const data = {
        songName: songName,
        songImageURL: songImageUrl,
        songURL: audioAsset,
        songAlbumID: albumFilter,
        songAlbumName: albumName,
        songArtistID: artistFilter,
        songArtistName: artistName,
        songLanguage: languageFilter,
        songCategoryID: categoryFilter,
        songCategoryName: categoryName,
        songID: songID,
      };
      console.log("Bắt đầu lưu bài hát");

      updateSong(data).then((res) => {
        console.log("createSong res: ", res);
        console.log("res.status: ", res.status);
        console.log("res.data.message: ", res.data.message);
        if (res.status === 200) {
          getAllSongs().then((songs) => {
            dispatch({ type: SET_ALL_SONGS, allSongs: data.songs });
          });
          setSetAlert("success");
          setAlertMsg(res.data.message);
          setTimeout(() => {
            setSetAlert(null);
          }, 4000);
          setIsImageLoading(false);
          setIsAudioLoading(false);
          setSongName("");
          setSongImageUrl(null);
          setAudioAsset(null);
          dispatch({ type: SET_ARTIST_FILTER, artistFilter: null });
          dispatch({
            type: SET_LANGUAGE_FILTER,
            languageFilter: null,
          });
          dispatch({ type: SET_ALBUM_FILTER, albumFilter: null });
          dispatch({ type: SET_FILTER_TERM, filterTerm: null });
        } else {
          setSetAlert("error");
          setAlertMsg(res.data.message);
          setTimeout(() => {
            setSetAlert(null);
          }, 4000);
          setIsImageLoading(false);
          setIsAudioLoading(false);
        }
      });
    }
  };

  return (
    <div className="flex items-center justify-center p-4 border border-gray-300 rounded-md">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        <div className="flex flex-col items-center justify-center gap-4">
          <input
            type="text"
            placeholder="Điền tên bài hát"
            className="w-full p-3 rounded-md text-base font-semibold text-white outline-none shadow-sm border border-gray-300 bg-transparent"
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
          />

          <div className="flex w-full justify-between flex-wrap items-center gap-4">
            <FilterButtonsArtist
              filterData={allArtists}
              flag={"Artist"}
              filterInit={artistFilter}
            />
            <FilterButtonsAlbum
              filterData={allAlbums}
              flag={"Albums"}
              filterInit={albumFilter}
            />
            <FilterButtons
              filterData={filterByLanguage}
              flag={"Language"}
              filterInit={languageFilter}
            />
            <FilterButtonsCategory
              filterData={allCategories}
              flag={"Category"}
              filterInit={categoryFilter}
            />
          </div>

          <div className="flex items-center justify-between gap-2 w-full flex-wrap">
            <div className="bg-card  backdrop-blur-md w-full lg:w-300 h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
              {isImageLoading && <ImageLoader progress={uploadProgress} />}
              {!isImageLoading && (
                <>
                  {!songImageUrl ? (
                    <ImageUploader
                      setImageURL={setSongImageUrl}
                      setAlert={setSetAlert}
                      alertMsg={setAlertMsg}
                      isLoading={setIsImageLoading}
                      setProgress={setUploadProgress}
                      isImage={true}
                    />
                  ) : (
                    <div className="relative w-full h-full overflow-hidden rounded-md">
                      <img
                        src={songImageUrl}
                        alt="uploaded image"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                        onClick={() => {
                          deleteImageObject(songImageUrl, "image");
                        }}
                      >
                        <MdDelete className="text-white" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="bg-card  backdrop-blur-md w-full lg:w-300 h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
              {isAudioLoading && <ImageLoader progress={uploadProgress} />}
              {!isAudioLoading && (
                <>
                  {!audioAsset ? (
                    <ImageUploader
                      setImageURL={setAudioAsset}
                      setAlert={setSetAlert}
                      alertMsg={setAlertMsg}
                      isLoading={setIsAudioLoading}
                      setProgress={setUploadProgress}
                      isImage={false}
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-md">
                      <audio ref={audioRef} src={audioAsset} controls />
                      <button
                        type="button"
                        className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                        onClick={() => {
                          deleteImageObject(audioAsset, "audio");
                        }}
                      >
                        <MdDelete className="text-white" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center justify-end w-full p-4">
              {isImageLoading || isAudioLoading ? (
                <DisabledButton />
              ) : (
                <motion.button
                  whileTap={{ scale: 0.75 }}
                  className="px-8 py-2 rounded-md text-white bg-red-600 hover:shadow-lg"
                  onClick={saveSong}
                >
                  Tải lên
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
      {setAlert && (
        <>
          {setAlert === "success" ? (
            <AlertSuccessBottom msg={alertMsg} />
          ) : (
            <AlertErrorBottom msg={alertMsg} />
          )}
        </>
      )}
    </div>
  );
};

export default DashboardNewSong;
