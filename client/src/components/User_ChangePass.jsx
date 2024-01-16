import React, { useState } from "react";
import AlertErrorBottom from "../components/AlertErrorBottom";
import AlertSuccessBottom from "../components/AlertSuccessBottom";
import { changePassword } from "../api";
const User_ChangePass = ({
  onClose,
  userDataID,
  toggleChangePasswordSuccessPopup,
}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isAlert, setIsAlert] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [handleError, setHandleError] = useState({
    errOldPassword: null,
    errNewPassword: null,
    errCofirmNewPassword: null,
  });

  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
    setHandleError({
      errCofirmNewPassword: "",
    });
  };
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    setHandleError({
      errNewPassword: "",
    });
  };
  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
    setHandleError({
      errOldPassword: "",
    });
  };
  const handleChangePassword = async (event) => {
    event.preventDefault();
    if (!oldPassword) {
      setHandleError({
        errOldPassword: "Vui lòng nhập mật khẩu cũ",
      });
      return;
    } else if (!newPassword) {
      setHandleError({
        errNewPassword: "Vui lòng nhập mật khẩu mới",
      });
      return;
    } else if (!confirmNewPassword) {
      setHandleError({
        errCofirmNewPassword: "Vui lòng nhập lại mật khẩu",
      });
      return;
    } else if (newPassword !== confirmNewPassword) {
      setHandleError({
        errCofirmNewPassword: "Mật khẩu không khớp",
      });
      return;
    }

    const dataReq = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      userID: userDataID,
    };
    changePassword(dataReq).then((res) => {
      if (res.data.success) {
        setIsAlert("success");
        setAlertMessage(res.data.message);
        setTimeout(() => {
          setIsAlert(null);
          onClose();
          toggleChangePasswordSuccessPopup();
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
  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Nền đen phía sau */}
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-800 opacity-75"></div>
        </div>

        {/* Popup */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Nút đóng */}
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button onClick={onClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-col p-10 bg_website_02 text-white">
            <h3 className="text-2xl font-bold mb-4 text-center">
              Đổi mật khẩu
            </h3>

            <label className="text-lg mb-2">Mật khẩu cũ</label>
            <input
              type="password"
              className="border p-2 mb-4 focus:outline-none text-black"
              placeholder="Nhập mật khẩu cũ"
              value={oldPassword}
              onChange={handleOldPasswordChange}
            />
            {handleError && (
              <p className="text-red-500 font-medium mb-3 italic">
                {handleError.errOldPassword}
              </p>
            )}
            <label className="text-lg mb-2">Mật khẩu mới</label>
            <input
              type="password"
              className="border p-2 mb-4 focus:outline-none  text-black"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
            {handleError && (
              <p className="text-red-500 font-medium mb-3 italic">
                {handleError.errNewPassword}
              </p>
            )}
            <label className="text-lg mb-2">Nhập lại mật khẩu mới</label>
            <input
              type="password"
              className="border p-2 mb-4 focus:outline-none  text-black"
              placeholder="Xác nhận mật khẩu mới"
              value={confirmNewPassword}
              onChange={handleConfirmNewPasswordChange}
            />
            {handleError && (
              <p className="text-red-500 font-medium mb-3 italic">
                {handleError.errCofirmNewPassword}
              </p>
            )}
            <button
              className="bg_website hover:bg-blue-800 text-white px-4 py-2 rounded self-end w-full my-2"
              onClick={handleChangePassword}
            >
              Lưu
            </button>
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

export default User_ChangePass;
