import AlertError from "../components/AlertError";
// import AlertSuccess from "../../components/shared/AlertSuccess";
import React, { useState, useEffect } from "react";
// import Loading from "../../components/users/Loading";
import User_ChangePass from "../components/User_ChangePass";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import SideBar from "../layouts/UserLayout/SideBar";
import AlertErrorBottom from "../components/AlertErrorBottom";
import AlertSuccessBottom from "../components/AlertSuccessBottom";
import { getUserDetails, updateUserProfileWithOutPassword } from "../api";
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

const Home = () => {
  const userData = JSON.parse(window.localStorage.getItem("userData"));
  const userDataID = userData.user._id;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phoneRegex = /^\d{9,10}$/;

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
  const [isAlert, setIsAlert] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

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
    getUserDetails(userDataID).then((res) => {
      console.log("getUserDetails res: ", res);
      setLoadedDetails(res.user);
      console.log(res.user);
      setUserFullName(`${res.user.cusLastName} ${res.user.cusFirstName}`);
      setUserEmail(res.user.cusEmail);
      setUserPhoneNum(res.user.cusPhoneNum);
    });
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
    } else if (userPhoneNum && !phoneRegex.test(userPhoneNum)) {
      setHandleError({
        errPhoneNum: "Số điện thoại không hợp lệ. Vui lòng kiểm tra lại",
      });
      return;
    }

    const splitName = splitFullName(userFullName);

    const dataReq = {
      CusFirstName: splitName.firstName,
      CusLastName: splitName.restOfName,
      CusEmail: userEmail,
      CusPhoneNum: userPhoneNum,
      userID: userDataID,
    };

    updateUserProfileWithOutPassword(dataReq).then((res) => {
      if (res.data.success) {
        setIsAlert("success");
        setAlertMessage(res.data.message);
        setTimeout(() => {
          setIsAlert(null);
          getUserDetails(userDataID).then((res) => {
            console.log("getUserDetails res: ", res);
            setLoadedDetails(res.user);
            console.log(res.user);
            setUserFullName(`${res.user.cusLastName} ${res.user.cusFirstName}`);
            setUserEmail(res.user.cusEmail);
            setUserPhoneNum(res.user.cusPhoneNum);
          });
          setUpdated((p) => p + 1);
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

  return (
    <div className="h-auto mt-[120px] mb-16 w-full flex justify-center items-center">
      <div className="w-10/12 flex justify-center">
        <SideBar updated={updated} />
        <div className="md:w-4/6 md:pl-[50px] ">
          <div className="text-2xl pb-[16px] border-b-[1px] border-b-black border-b-solid">
            THÔNG TIN CÁ NHÂN
          </div>
          <div className="mt-[35px]">
            <div>
              <label for="fullName">Họ và tên : </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                className="border-b-[1px] border-b-black border-b-solid w-full pb-[5px] mt-[20px] bg-transparent"
                value={userFullName}
                onChange={handleFullNameChange}
              />
            </div>
            <div className="mt-[50px]">
              <label for="email">Email : </label>
              <input
                type="text"
                name="email"
                id="email"
                className="border-b-[1px] border-b-black border-b-solid w-full pb-[5px] mt-[20px] bg-transparent"
                value={userEmail}
                onChange={handleEmailChange}
              />
            </div>
            <div className="mt-[50px]">
              <label for="phongNumber">Số điện thoại : </label>
              <input
                type="tel"
                name="phongNumber"
                id="phongNumber"
                className="border-b-[1px] border-b-black border-b-solid w-full pb-[5px] mt-[20px] bg-transparent"
                value={userPhoneNum ? userPhoneNum : ""}
                onChange={handlePhoneNumChange}
              />
            </div>

            <div className="flex flex-row justify-end mt-[75px]">
              <div className="flex flex-row gap-[62px]">
                <div>
                  <button
                    className="py-[13px] px-[30px] bg_website rounded text-white text-lg font-bold"
                    onClick={handleUpdateUserProfile}
                  >
                    Cập nhật
                  </button>
                </div>
                {!userData.user.GoogleID && (
                  <div>
                    <button
                      onClick={() => setShowChangePassword(true)}
                      className="py-[13px] px-[30px] bg_website rounded text-white text-lg font-bold"
                    >
                      Đổi mật khẩu
                    </button>
                    {showChangePassword && (
                      <User_ChangePass
                        setShowChangePassword={setShowChangePassword}
                        showChangePassword={showChangePassword}
                        onClose={handleClose}
                        userDataID={userDataID}
                        toggleChangePasswordSuccessPopup={
                          toggleChangePasswordSuccessPopup
                        }
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
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

export default Home;
