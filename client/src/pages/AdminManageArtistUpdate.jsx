import React, { useEffect, useState } from "react";
import { ref, deleteObject } from "firebase/storage";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { storage } from "../config/firebase.config";
import { getAllArtist, updateArtist, getArtistDetails } from "../api";
import { useSelector, useDispatch } from "react-redux";
import { SET_ALL_ARTISTS } from "../store/actions";
import { ImageLoader, ImageUploader, DisabledButton } from "../components";
import AlertErrorBottom from "../components/AlertErrorBottom";
import AlertSuccessBottom from "../components/AlertSuccessBottom";

const AddNewArtist = () => {
  const [searchParams] = useSearchParams();
  const artistID = searchParams.get("id");
  console.log("artistID: ", artistID);

  const [isArtist, setIsArtist] = useState(false);
  const [artistProgress, setArtistProgress] = useState(0);

  const [isAlert, setIsAlert] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [artistCoverImage, setArtistCoverImage] = useState(null);

  const [artistName, setArtistName] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const dispatch = useDispatch();

  let artData;
  useEffect(() => {
    getArtistDetails(artistID).then((data) => {
      artData = data.artist;
      setArtistName(artData.artistName);
      setTwitter(artData.artistTwitter);
      setInstagram(artData.artistInstagram);
      setArtistCoverImage(artData.artistImageURL);
    });
  }, []);

  const deleteImageObject = (songURL) => {
    setIsArtist(true);
    setArtistCoverImage(null);
    const deleteRef = ref(storage, songURL);
    deleteObject(deleteRef).then(() => {
      setIsAlert("success");
      setAlertMessage("Xoá hình ảnh thành công");
      setTimeout(() => {
        setIsAlert(null);
      }, 4000);
      setIsArtist(false);
    });
  };

  const saveArtist = () => {
    if (!artistCoverImage || !artistName) {
      setIsAlert("error");
      setAlertMessage("Vui lòng nhập đủ các thông tin cần thiết");
      setTimeout(() => {
        setIsAlert(null);
      }, 4000);
    } else {
      setIsArtist(true);
      const data = {
        name: artistName,
        imageURL: artistCoverImage,
        twitter: twitter,
        instagram: instagram,
        artistID: artistID,
      };
      updateArtist(data).then((res) => {
        console.log("updateArtist res: ", res);
        if (res.status === 200) {
          getAllArtist().then((artistData) => {
            setIsAlert("success");
            setAlertMessage(res.data.message);
            setTimeout(() => {
              setIsAlert(null);
              dispatch({
                type: SET_ALL_ARTISTS,
                allArtists: artistData.artists,
              });
            }, 1500);
          });
          setIsArtist(false);
          setArtistCoverImage(null);
          setArtistName("");
          setTwitter("");
          setInstagram("");
        }
      });
    }
  };

  return (
    <div className="flex items-center justify-evenly w-full flex-wrap">
      <div className="bg-card  backdrop-blur-md w-full lg:w-225 h-225 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
        {isArtist && <ImageLoader progress={artistProgress} />}
        {!isArtist && (
          <>
            {!artistCoverImage ? (
              <ImageUploader
                setImageURL={setArtistCoverImage}
                setAlert={setIsAlert}
                alertMsg={setAlertMessage}
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
              className="px-8 py-2 rounded-md text-white bg-red-600 hover:shadow-lg"
              onClick={saveArtist}
            >
              Cập nhật
            </motion.button>
          )}
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
export default AddNewArtist;
