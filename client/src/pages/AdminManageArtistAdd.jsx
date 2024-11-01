import React, { useState } from "react";
import { ref, deleteObject } from "firebase/storage";
import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import { storage } from "../config/firebase.config";
import { getAllArtist, createArtist } from "../api";
import AlertSuccess from "../components/AlertSuccess";
import AlertError from "../components/AlertError";
import { useSelector, useDispatch } from "react-redux";
import { SET_ARTISTS } from "../store/actions";
import { ImageLoader, ImageUploader, DisabledButton } from "../components";

const AddNewArtist = () => {
  const [isArtist, setIsArtist] = useState(false);
  const [artistProgress, setArtistProgress] = useState(0);

  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [artistCoverImage, setArtistCoverImage] = useState(null);

  const [artistName, setArtistName] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const dispatch = useDispatch();
  const artists = useSelector((state) => state.customization.artists);

  const deleteImageObject = (songURL) => {
    setIsArtist(true);
    setArtistCoverImage(null);
    const deleteRef = ref(storage, songURL);
    deleteObject(deleteRef).then(() => {
      setAlert("success");
      setAlertMsg("File removed successfully");
      setTimeout(() => {
        setAlert(null);
      }, 4000);
      setIsArtist(false);
    });
  };

  const saveArtist = () => {
    if (!artistCoverImage || !artistName) {
      setAlert("error");
      setAlertMsg("Required fields are missing");
      setTimeout(() => {
        setAlert(null);
      }, 4000);
    } else {
      setIsArtist(true);
      const data = {
        name: artistName,
        imageURL: artistCoverImage,
        twitter: twitter,
        instagram: instagram,
      };
      createArtist(data).then((res) => {
        getAllArtist().then((artistData) => {
          dispatch({ type: SET_ARTISTS, artists: artistData.data });
        });
      });
      setIsArtist(false);
      setArtistCoverImage(null);
      setArtistName("");
      setTwitter("");
      setInstagram("");
    }
  };

  return (
    <div className="flex items-center justify-evenly w-full flex-wrap mt-10">
      <div className="bg-card  backdrop-blur-md w-full lg:w-225 h-225 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
        {isArtist && <ImageLoader progress={artistProgress} />}
        {!isArtist && (
          <>
            {!artistCoverImage ? (
              <ImageUploader
                setImageURL={setArtistCoverImage}
                setAlert={setAlert}
                alertMsg={setAlertMsg}
                isLoading={setIsArtist}
                setProgress={setArtistProgress}
                isImage={true}
              />
            ) : (
              <div className="relative w-full h-full overflow-hidden rounded-md">
                <img
                  src={artistCoverImage}
                  alt="uploaded image"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                  onClick={() => {
                    deleteImageObject(artistCoverImage);
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
          placeholder="Tên nghệ sĩ"
          className="w-full lg:w-300 p-3 rounded-md text-base font-semibold text-white outline-none shadow-sm border border-gray-300 bg-transparent"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
        />

        <div className="w-full lg:w-300 p-3 flex items-center rounded-md  shadow-sm border border-gray-300">
          <p className="text-base font-semibold text-gray-400">
            www.twitter.com/
          </p>
          <input
            type="text"
            placeholder="your id"
            className="w-full text-base font-semibold text-white outline-none bg-transparent"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
          />
        </div>

        <div className="w-full lg:w-300 p-3 flex items-center rounded-md  shadow-sm border border-gray-300">
          <p className="text-base font-semibold text-gray-400">
            www.instagram.com/
          </p>
          <input
            type="text"
            placeholder="your id"
            className="w-full text-base font-semibold text-white outline-none bg-transparent"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
        </div>

        <div className="w-full lg:w-300 flex items-center justify-center lg:justify-end">
          {isArtist ? (
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
export default AddNewArtist;
