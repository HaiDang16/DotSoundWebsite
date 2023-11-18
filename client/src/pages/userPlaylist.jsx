// import AlertError from "../../components/shared/AlertError";
// import AlertSuccess from "../../components/shared/AlertSuccess";
import React, { useState, useEffect } from "react";
// import Loading from "../../components/users/Loading";
// import User_ChangePass from "../../components/users/User_ChangePass";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import {
  FilterButtonsCategory,
  FilterButtons,
  ImageLoader,
  ImageUploader,
  DisabledButton,
  FilterButtonsArtist,
  FilterButtonsAlbum,
} from "../components";

import SideBar from "../layouts/UserLayout/SideBar";
const moment = require("moment");

function splitFullName(fullName) {
  const parts = fullName.split(" ");
  const firstName = parts[parts.length - 1]; // Phần tên

  // Nếu có phần còn lại, nó sẽ là các phần trước phần cuối cùng
  const restOfName = parts.slice(0, parts.length - 1).join(" ");

  return {
    firstName,
    restOfName,
  };
}

const UserPlaylist = () => {
  const baseURL = "http://localhost:4000/";
  const userData = JSON.parse(window.localStorage.getItem("userData"));
  const userDataID = userData.user._id;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phoneRegex = /^\d{10,}$/;

  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [loadedDetails, setLoadedDetails] = useState();
  const [updated, setUpdated] = useState(0);
  const [userFullName, setUserFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhoneNum, setUserPhoneNum] = useState();
  const [userDOB, setUserDOB] = useState("");
  const [userSex, setUserSex] = useState(null);
  const [isUpdatedPopup, setIsUpdatedPopup] = useState(false);
  const [isChangePasswordPopup, setIsChangePasswordPopup] = useState(false);

  const [handleError, setHandleError] = useState({
    errFullName: null,
    errEmail: null,
    errPhoneNum: null,
    errDOB: null,
    errSex: null,
  });
  const handleClose = () => {
    setShowChangePassword(false);
  };
  const toggleChangePasswordSuccessPopup = () => {
    setIsChangePasswordPopup(!isChangePasswordPopup);
  };
  const handleSexChange = (e) => {
    setUserSex(e.target.value);
    setHandleError({
      errSex: "",
    });
  };
  const handleDOBChange = (e) => {
    setUserDOB(e.target.value);
    setHandleError({
      errDOB: "",
    });
  };
  const handlePhoneNumChange = (e) => {
    setUserPhoneNum(e.target.value);
    setHandleError({
      errPhoneNum: "",
    });
  };
  const handleFullNameChange = (e) => {
    setUserFullName(e.target.value);
    setHandleError({
      errFullName: "",
    });
  };
  const handleEmailChange = (e) => {
    setUserEmail(e.target.value);
    setHandleError({
      errEmail: "",
    });
  };
  const clearError = () => {
    setHandleError({
      errFullName: null,
      errEmail: null,
      errPhoneNum: null,
      errDOB: null,
      errSex: null,
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}api/users/GetUserDetails/${userDataID}`
        );
        console.log("fetchData: ", response.data.user);
        setLoadedDetails(response.data.user);
        setUserFullName(
          `${response.data.user.CusLastName} ${response.data.user.CusFirstName}`
        );
        setUserEmail(response.data.user.CusEmail);
        setUserPhoneNum(response.data.user.CusPhoneNum);
        setUserDOB(response.data.user.CusBirthday);
        setUserSex(response.data.user.CusSex);
      } catch (error) {
        console.error("Error searching:", error);
      }
    };

    fetchData();
  }, []);

  const handleUpdateUserProfile = async (event) => {
    event.preventDefault();
    if (!userFullName) {
      setHandleError({
        errFullName: "Họ tên không được để trống",
      });
      return;
    } else if (!userEmail) {
      setHandleError({
        errEmail: "Email không được để trống",
      });
      return;
    } else if (!emailRegex.test(userEmail)) {
      setHandleError({ errEmail: "Email không hợp lệ. Vui lòng kiểm tra lại" });
      return;
    } else if (
      userPhoneNum &&
      (userPhoneNum.length !== 10 || !phoneRegex.test(userPhoneNum))
    ) {
      setHandleError({
        errPhoneNum: "Số điện thoại không hợp lệ. Vui lòng kiểm tra lại",
      });
      return;
    }

    const apiUrl = `${baseURL}api/users/UpdateUserProfile`;
    const splitName = splitFullName(userFullName);
    const jsonDate = moment(userDOB, "YYYY-MM-DD").toISOString();
    const data = {
      CusFirstName: splitName.firstName,
      CusLastName: splitName.restOfName,
      CusEmail: userEmail,
      CusPhoneNum: userPhoneNum,
      CusBirthday: jsonDate,
      CusSex: userSex,
      userID: userDataID,
    };

    try {
      const response = await axios.put(apiUrl, data, {
        headers: {
          "Content-Type": "application/json",
          // Include any authentication headers if required
        },
      });
      if (response.status === 200) {
        //setUserName(name);
        setUpdated((p) => p + 1);
        setIsUpdatedPopup(!isUpdatedPopup);
        clearError();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsUpdatedPopup(false);
    }, 1500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isUpdatedPopup]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsChangePasswordPopup(false);
    }, 1500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isChangePasswordPopup]);
  const samplePlaylists = [
    { id: 1, name: "Danh sách phát 1" },
    { id: 2, name: "Danh sách phát 2" },
  ];
  return (
    <div className="h-auto mt-[120px] mb-16 w-full flex justify-center items-center">
      <div className="w-10/12 flex justify-center">
        <SideBar updated={updated} />
        <div className="md:w-4/6 md:pl-[50px]">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold mb-4">Danh sách phát cá nhân</h1>
            <AddNewPlaylistForm />
          </div>

          {samplePlaylists.map((playlist) => (
            <PlaylistItem key={playlist.id} name={playlist.name} />
          ))}
        </div>
      </div>
    </div>
  );
};
const AddNewPlaylistForm = () => {
  return (
    <form className="mb-4">
      <div className="flex justify-between">
        <input
          type="text"
          className="border border-gray-300 p-2 w-full mx-5"
          placeholder="Nhập tên danh sách phát mới"
        />
        <button className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 w-full">
          Thêm mới
        </button>{" "}
      </div>
    </form>
  );
};
const PlaylistItem = ({ name }) => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  return (
    <div className="border border-gray-300 p-2 rounded mb-2">
      <div> {name}</div>
    </div>
  );
};
export default UserPlaylist;
