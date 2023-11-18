import React, { useEffect, useRef, useState } from "react";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { motion } from "framer-motion";

import { BiCloudUpload } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { storage } from "../config/firebase.config";
import {
  getAllAlbums,
  getAllArtist,
  getAllCategories,
  getAllSongs,
  saveNewAlbum,
  saveNewArtist,
  saveNewSong,
} from "../api";
import { actionType } from "../context/reducer";
import { filterByLanguage, filters } from "../utils/supportfunctions";
import { IoMusicalNote } from "react-icons/io5";
import AlertSuccess from "../components/AlertSuccess";
import AlertError from "../components/AlertError";
import { useSelector, useDispatch } from "react-redux";
import {
  SET_ALL_SONGS,
  SET_SONG_PLAYING,
  SET_ARTISTS,
  SET_ALL_ALBUMS,
  SET_ALL_CATEGORIES,
} from "../store/actions";

const ImageUploaderUserAvatar = ({
  setImageURL,
  setAlert,
  alertMsg,
  isLoading,
  setProgress,
}) => {
  const uploadImage = (e) => {
    isLoading(true);
    const imageFile = e.target.files[0];
    const storageRef = ref(
      storage,
      `PlaylistImages/${Date.now()}-${imageFile.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },

      (error) => {
        setAlert("error");
        alertMsg("File upload failed.");
        setTimeout(() => {
          setAlert(null);
        }, 4000);
        isLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageURL(downloadUrl);
          setProgress(0);
          isLoading(false);
          setAlert("success");
          alertMsg("File uploaded successfully");
          setTimeout(() => {
            setAlert(null);
          }, 4000);
        });
      }
    );
  };

  return (
    <label>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex flex-col justify-center items-center cursor-pointer">
          <p className="font-bold text-2xl">
            <BiCloudUpload />
          </p>
          <p className="text-lg">Tải ảnh</p>
        </div>
      </div>
      <input
        type="file"
        name="upload-image"
        accept={`"image/*"}`}
        onChange={uploadImage}
        className="w-0 h-0"
      />
    </label>
  );
};

export default ImageUploaderUserAvatar;
