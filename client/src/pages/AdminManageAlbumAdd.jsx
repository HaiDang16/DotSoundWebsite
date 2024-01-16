import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ref, deleteObject } from "firebase/storage";
import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import { storage } from "../config/firebase.config";
import { getAllAlbums, getAllArtist, createAlbum } from "../api";
import { SET_ALL_ARTISTS, SET_ALL_ALBUMS } from "../store/actions";
import {
  ImageLoader,
  ImageUploader,
  DisabledButton,
  AlertSuccess,
  AlertError,
} from "../components";

const AddNewAlbum = () => {
  const [isAlbum, setIsAlbum] = useState(false);
  const [albumProgress, setAlbumProgress] = useState(0);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [albumCoverImage, setAlbumCoverImage] = useState(null);
  const [selectedArtistName, setSelectedArtistName] = useState("");
  const [albumName, setAlbumName] = useState("");
  const dispatch = useDispatch();
  const allArtists = useSelector((state) => state.customization.allArtists);

  useEffect(() => {
    if (!allArtists) {
      getAllArtist().then((data) => {
        console.log("getAllArtist res: ", data.artists);
        dispatch({ type: SET_ALL_ARTISTS, allArtists: data.artists });
      });
    }
  }, []);
  const handleArtistChange = (e) => {
    setSelectedArtist(e.target.value);
    const selectedName =
      allArtists.find((artist) => artist._id === e.target.value)?.artistName ||
      "";
    setSelectedArtistName(selectedName);
  };

  const deleteImageObject = (songURL) => {
    setIsAlbum(true);
    setAlbumCoverImage(null);
    const deleteRef = ref(storage, songURL);
    deleteObject(deleteRef).then(() => {
      setAlert("success");
      setAlertMsg("File removed successfully");
      setTimeout(() => {
        setAlert(null);
      }, 4000);
      setIsAlbum(false);
    });
  };

  const saveArtist = () => {
    if (!albumCoverImage || !albumName) {
      setAlert("error");
      setAlertMsg("Required fields are missing");
      setTimeout(() => {
        setAlert(null);
      }, 4000);
    } else {
      setIsAlbum(true);
      const data = {
        name: albumName,
        imageURL: albumCoverImage,
        artistID: selectedArtist,
        artistName: selectedArtistName,
      };
      createAlbum(data).then((res) => {
        getAllAlbums().then((albumData) => {
          console.log("getAllAlbums res:", res);
          dispatch({
            type: SET_ALL_ALBUMS,
            albumData: albumData.data,
          });
        });
      });
      setIsAlbum(false);
      setAlbumCoverImage(null);
      setAlbumName("");
    }
  };

  return (
    <div className="flex items-center justify-evenly w-full flex-wrap mt-10">
      <div className="bg-card  backdrop-blur-md w-full lg:w-225 h-225 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
        {isAlbum && <ImageLoader progress={albumProgress} />}
        {!isAlbum && (
          <>
            {!albumCoverImage ? (
              <ImageUploader
                setImageURL={setAlbumCoverImage}
                setAlert={setAlert}
                alertMsg={setAlertMsg}
                isLoading={setIsAlbum}
                setProgress={setAlbumProgress}
                isImage={true}
              />
            ) : (
              <div className="relative w-full h-full overflow-hidden rounded-md">
                <img
                  src={albumCoverImage}
                  alt="uploaded image"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                  onClick={() => {
                    deleteImageObject(albumCoverImage);
                  }}
                >
                  <MdDelete className="text-white" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col items-center justify-center gap-4 ">
        <input
          type="text"
          placeholder="Tên album"
          className="w-full lg:w-300 p-3 rounded-md text-base font-semibold text-white outline-none shadow-sm border border-gray-300 bg-transparent"
          value={albumName}
          onChange={(e) => setAlbumName(e.target.value)}
        />
        <select
          className="w-full p-3 rounded-md text-base font-semibold text-white outline-none shadow-sm border border-gray-300 bg-transparent"
          value={selectedArtist}
          onChange={handleArtistChange}
        >
          <option value="" disabled>
            Chọn nghệ sĩ
          </option>
          {allArtists &&
            allArtists.map((artist) => (
              <option
                key={artist._id}
                value={artist._id}
                className="text-black"
              >
                {artist.artistName}
              </option>
            ))}
        </select>
        <div className="w-full lg:w-300 flex items-center justify-center lg:justify-end mt-10">
          {isAlbum ? (
            <DisabledButton />
          ) : (
            <motion.button
              whileTap={{ scale: 0.75 }}
              className="px-8 py-2 rounded-md text-white bg-blue-700 hover:shadow-lg"
              onClick={saveArtist}
            >
              Tải lên
            </motion.button>
          )}
        </div>
      </div>

      {alert && (
        <>
          {alert === "success" ? (
            <AlertSuccess msg={alertMsg} />
          ) : (
            <AlertError msg={alertMsg} />
          )}
        </>
      )}
    </div>
  );
};
export default AddNewAlbum;
