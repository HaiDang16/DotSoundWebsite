import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { storage } from "../../config/firebase.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { IoSearch, IoCartOutline, IoPersonSharp } from "react-icons/io5";

import { useSelector, useDispatch } from "react-redux";
import { getUserDetails, updateAvatar } from "../../api";
import AlertErrorBottom from "../../components/AlertErrorBottom";
import AlertSuccessBottom from "../../components/AlertSuccessBottom";
import { SET_ALL_SONGS, SET_SONG_PLAYING, SET_USER } from "../../store/actions";
const SideBar = ({ updated }) => {
  console.log("Re-render sidebar");

  const dispatch = useDispatch();
  const [avatarURL, setAvatarURL] = useState();
  const [isAlert, setIsAlert] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loadedDetails, setLoadedDetails] = useState();
  const userData = JSON.parse(window.localStorage.getItem("userData"));
  const userDataID = userData.user._id;
  const location = useLocation();
  const fileInputRef = useRef(null);

  const handleClick = () => {
    // Trigger the file input click event
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    console.log("Selected file:", file);
    const storageRef = ref(
      storage,
      `UserAvatars/${Date.now()}-id:${userDataID}-${file.name}`
    );

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle upload progress if needed
      },
      (error) => {
        // Handle upload error
        console.error("File upload failed:", error);
      },
      () => {
        // On upload completion, get the download URL
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadUrl) => {
            console.log("Download URL:", downloadUrl);
            handleUploadImage(downloadUrl);
          })
          .catch((error) => {
            // Handle any errors in getting the download URL
            console.error("Error getting download URL:", error);
          });
      }
    );
  };
  const handleUploadImage = async (downloadUrl) => {
    const dataReq = {
      userID: userData?.user._id,
      imgURL: downloadUrl,
    };
    updateAvatar(dataReq).then((res) => {
      if (res.data.success) {
        setIsAlert("success");
        setAlertMessage(res.data.message);
        setTimeout(() => {
          setIsAlert(null);
          getUserDetails(userDataID).then((res) => {
            setLoadedDetails(res.user);
            dispatch({
              type: SET_USER,
              user: res,
            });
          });
        }, 2000);
      } else {
        setIsAlert("error");
        setAlertMessage(res.data.message);
        setTimeout(() => {
          setIsAlert(null);
        }, 2000);
      }
    });
  };

  useEffect(() => {
    getUserDetails(userDataID).then((res) => {
      console.log("getUserDetails res: ", res);
      setLoadedDetails(res.user);
      console.log(res.user);
    });
  }, [updated]);

  const INFO_SIDE_BAR = [
    { label: "Thông tin cá nhân", link: "/UserProfile" },
    { label: "Danh sách phát", link: "/UserPlaylist" },
  ];

  return (
    <div className="md:w-2/6 w-full pr-20">
      <div className="flex flex-row justify-start flex-nowrap pb-[30px] border-b-[1px] border-b-black border-b-solid">
        <div className="lg:min-w-[120px] min-w-[80px] lg:max-w-[120px] max-w-[80px] h-[80px] lg:h-[100px] mr-10">
          {loadedDetails?.cusAvatar ? (
            <img src={loadedDetails?.cusAvatar} alt="avatar" />
          ) : (
            <IoPersonSharp className="text-black w-full h-full min-w-[30px] object-cover mr-3" />
          )}
        </div>
        <div>
          <div className="text-sm mb-[10px] break-all">
            {`${loadedDetails?.cusLastName} ${loadedDetails?.cusFirstName}`}
          </div>
          <div className="text-sm mb-[10px] break-all">
            {loadedDetails && loadedDetails.cusEmail}
          </div>
          {!userData.user.googleID && (
            <>
              <button
                onClick={handleClick}
                className="text-[#64A9DB] cursor-pointer mb-[10px] text-sm"
              >
                Tải ảnh avatar
              </button>
              <input
                ref={fileInputRef}
                type="file"
                name="upload-file"
                accept={"image/*"}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <div className="text-sm break-all">Dung lượng tối đa 2MB</div>
            </>
          )}
        </div>
      </div>
      <div className="mt-[43px]">
        {INFO_SIDE_BAR?.map((item, index) => (
          <Link to={item.link} key={index}>
            <div
              className={`mb-[50px] text-lg ${
                item.link === location.pathname
                  ? "border-b-[2px] border-b-[#3A6FB5] border-y-solid py-[6px] w-fit"
                  : ""
              }`}
            >
              {item.label}
            </div>
          </Link>
        ))}
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

export default SideBar;
