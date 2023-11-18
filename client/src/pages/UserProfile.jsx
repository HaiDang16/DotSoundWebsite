import AlertError from "../components/AlertError";
// import AlertSuccess from "../../components/shared/AlertSuccess";
import React, { useState, useEffect } from "react";
// import Loading from "../../components/users/Loading";
// import User_ChangePass from "../../components/users/User_ChangePass";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";
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

const Home = () => {
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

  return (
    <div className="h-auto mt-[120px] mb-16 w-full flex justify-center items-center">
      <div className="w-10/12 flex justify-center">
        <SideBar updated={updated} />
        <div className="md:w-4/6 md:pl-[50px] ">
          <div className="text-2xl pb-[16px] border-b-[1px] border-b-black border-b-solid">
            THÔNG TIN CÁ NHÂN
          </div>
          <div className="mt-[59px]">
            <div>
              <label for="fullName">Họ và tên : </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                className="border-b-[1px] border-b-black border-b-solid w-full pb-[16px] mt-[10px]"
                value={userFullName}
                onChange={handleFullNameChange}
              />
              {handleError.errFullName && (
                <AlertError msg={handleError.errFullName} />
              )}
              {/* {handleError && (
                <p className="text-red-500 mt-2 font-medium ml-1 italic">
                  {handleError.errFullName}
                </p>
              )} */}
            </div>
            <div className="mt-[50px]">
              <label for="email">Email : </label>
              <input
                type="text"
                name="email"
                id="email"
                className="border-b-[1px] border-b-black border-b-solid w-full pb-[16px] mt-[10px]"
                value={userEmail}
                onChange={handleEmailChange}
              />
              {handleError.errEmail && (
                <AlertError msg={handleError.errEmail} />
              )}
              {/* {handleError && (
                <p className="text-red-500 mt-2 font-medium ml-1 italic">
                  {handleError.errEmail}
                </p>
              )} */}
            </div>
            <div className="mt-[50px]">
              <label for="phongNumber">Số điện thoại : </label>
              <input
                type="tel"
                name="phongNumber"
                id="phongNumber"
                className="border-b-[1px] border-b-black border-b-solid w-full pb-[16px] mt-[10px]"
                value={userPhoneNum ? userPhoneNum : ""}
                onChange={handlePhoneNumChange}
              />
              {handleError.errPhoneNum && (
                <AlertError msg={handleError.errPhoneNum} />
              )}
              {/* {handleError && (
                <p className="text-red-500 mt-2 font-medium ml-1 italic">
                  {handleError.errPhoneNum}
                </p>
              )} */}
            </div>
            <div className="mt-[50px]">
              <label for="birthDate">Ngày sinh : </label>
              <input
                type="date"
                name="birthDate"
                id="birthDate"
                className="border-b-[1px] border-b-black border-b-solid w-full pb-[16px] mt-[10px]"
                value={
                  userDOB
                    ? moment(userDOB).format("YYYY-MM-DD")
                    : moment("").format("YYYY-MM-DD")
                }
                onChange={handleDOBChange}
              />
            </div>
            <div className="mt-[50px]">
              <div>Giới tính : </div>
              <div className="flex flex-row gap-x-[60px] border-b-[1px] border-b-black border-b-solid w-full pb-[16px] mt-[10px]">
                <div>
                  <label for="gender_male" className="mr-[16px]">
                    Nam
                  </label>
                  <input
                    type="radio"
                    id="gender_male"
                    name="gender"
                    value="1"
                    checked={userSex === 1}
                    onChange={handleSexChange}
                  />
                </div>
                <div>
                  <label for="gender_female" className="mr-[16px]">
                    Nữ
                  </label>
                  <input
                    type="radio"
                    id="gender_female"
                    name="gender"
                    value="0"
                    checked={userSex === 0}
                    onChange={handleSexChange}
                  />
                </div>
              </div>
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
      {/* {isUpdatedPopup && <AlertSuccess msg={isUpdatedPopup} />} */}
      {isUpdatedPopup && (
        <div
          class="fixed inset-0 flex items-center justify-center"
          id="overlay"
        >
          <div class="bg-black bg-opacity-75 p-10 rounded-2xl shadow-md text-white text-center w-3/12">
            <div class="flex items-center justify-center mb-8">
              <FaCheckCircle size={60} color="green" className="mr-2" />
            </div>
            <p className="text-xl">Cập nhật thông tin thành công</p>
          </div>
        </div>
      )}
      {isChangePasswordPopup && (
        <div
          class="fixed inset-0 flex items-center justify-center"
          id="overlay"
        >
          <div class="bg-black bg-opacity-75 p-10 rounded-2xl shadow-md text-white text-center w-3/12">
            <div class="flex items-center justify-center mb-8">
              <FaCheckCircle size={60} color="green" className="mr-2" />
            </div>
            <p className="text-xl">Đổi mật khẩu thành công</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
