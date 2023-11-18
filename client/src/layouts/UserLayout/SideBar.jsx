import React, { useState, useEffect, useRef } from "react";

import { Link, useLocation } from "react-router-dom";
import { storage } from "../../config/firebase.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { IoSearch, IoCartOutline, IoPersonSharp } from "react-icons/io5";
import axios from "axios";
import { getUserDetails } from "../../api";
const SideBar = ({ updated }) => {
  console.log("Re-render sidebar");
  const baseURL = "http://localhost:4000/";
  const [avatarURL, setAvatarURL] = useState("");
  const [loadedDetails, setLoadedDetails] = useState();
  const userData = JSON.parse(window.localStorage.getItem("userData"));
  const userDataID = userData.user._id;
  const location = useLocation();
  const fileInputRef = useRef(null);

  const handleClick = () => {
    // Trigger the file input click event
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // Handle the file as needed
    console.log("Selected file:", file);
    // You can now upload the file or perform any other actions
    // Firebase Storage setup (replace with your actual setup)
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
            // Handle the download URL as needed (e.g., save it to state)
            console.log("Download URL:", downloadUrl);
            setAvatarURL(downloadUrl);
            handleUploadImage();
          })
          .catch((error) => {
            // Handle any errors in getting the download URL
            console.error("Error getting download URL:", error);
          });
      }
    );
  };
  const handleUploadImage = async () => {
    try {
      const data = {
        userID: userData.user._id,
        imgURL: avatarURL,
      };
      const response = await axios.put(
        `${baseURL}api/users/UpdateAvatar`,
        data
      );

      if (response.data.success) {
        console.log("Cập nhật avatar thành công");
      } else {
        console.error("Cập nhật avatar không thành công");
      }
    } catch (error) {
      console.error("Cập nhật avatar không thành công");
    }
  };

  useEffect(() => {
    getUserDetails(userDataID).then((res) => {
      console.log("getUserDetails res: ", res);
      setLoadedDetails(res.user);

      console.log(res.user);
    });
  }, [avatarURL, updated]);

  const INFO_SIDE_BAR = [
    { label: "Thông tin cá nhân", link: "/UserProfile" },
    { label: "Danh sách phát", link: "/UserPlaylist" },
  ];

  return (
    <div className="md:w-2/6 w-full pr-20">
      <div className="flex flex-row justify-start flex-nowrap pb-[30px] border-b-[1px] border-b-black border-b-solid">
        <div className="lg:min-w-[120px] min-w-[80px] lg:max-w-[120px] max-w-[80px] h-[80px] lg:h-[100px]">
          {loadedDetails?.cusAvatar ? (
            <img src={loadedDetails?.cusAvatar} alt="avatar" />
          ) : (
            <IoPersonSharp className="text-black w-full h-full min-w-[30px] object-cover mr-3" />
          )}
        </div>
        <div className="lg:ml-[36px] ml-[20px]">
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
    </div>
  );
};

export default SideBar;
