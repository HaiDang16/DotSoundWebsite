import AlertErrorBottom from "../components/AlertErrorBottom";
import AlertSuccessBottom from "../components/AlertSuccessBottom";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import BackgroundLogin from "../assets/img/background_Login.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { resetPassword } from "../api";
const CryptoJS = require("crypto-js");

const ResetPassword = () => {
  const navigate = useNavigate();
  let userEmailDecrypted;
  const [searchParams] = useSearchParams();
  const userEmailQuery = searchParams.get("rs");
  console.log("userEmailQuery: ", userEmailQuery);
  const decryptedBytes = CryptoJS.AES.decrypt(userEmailQuery, "secret key 123");
  userEmailDecrypted = decryptedBytes.toString(CryptoJS.enc.Utf8);
  console.log("userEmailDecrypted: ", userEmailDecrypted);

  const [userPassword, setUserPassword] = useState("");
  const [userConfirmPassword, setUserConfirmPassword] = useState("");
  const [handleError, setHandleError] = useState({
    errPass: "",
    errConfirmPass: "",
  });
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [isAlert, setIsAlert] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const togglePasswordVisibility = () => {
    setIsShowPassword(!isShowPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setIsShowConfirmPassword(!isShowConfirmPassword);
  };
  const handlePassChange = (e) => {
    setUserPassword(e.target.value);
    setHandleError({ errPass: "" });
    setIsAlert(null);
  };

  const handleConfirmPassChange = (e) => {
    setUserConfirmPassword(e.target.value);
    setHandleError({ errConfirmPass: "" });
    setIsAlert(null);
  };
  const handleForgotPassword = async () => {
    if (!userPassword) {
      setIsAlert("error");
      setAlertMessage("Vui lòng nhập mật khẩu mới");
      return;
    } else if (!userConfirmPassword) {
      setIsAlert("error");
      setAlertMessage("Vui lòng nhập xác nhận mật khẩu");
      return;
    } else if (userPassword !== userConfirmPassword) {
      setIsAlert("error");
      setAlertMessage("Mật khẩu không khớp. Vui lòng kiểm tra lại");
      return;
    }
    console.log("userEmailDecrypted: ", userEmailDecrypted);
    const dataReq = {
      userPassword: userPassword,
      userEmail: userEmailDecrypted,
    };
    try {
      resetPassword(dataReq).then((res) => {
        console.log("Reset Password res: ", res);

        if (res.data.message === "Đổi mật khẩu thành công") {
          setIsAlert("success");
          setAlertMessage("Đổi mật khẩu thành công");
          setTimeout(() => {
            setIsAlert(null);
            navigate("/Login");
          }, 2000);
        } else {
          setIsAlert("error");
          setAlertMessage("Đổi mật khẩu thất bại");
          setTimeout(() => {
            setIsAlert(null);
          }, 2000);
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div
      style={{ backgroundImage: `url(${BackgroundLogin})` }}
      className="w-full h-auto flex flex-col justify-center items-center rounded-lg shadow-md md:p-10 bg-center bg-cover bg-size font-sans relative"
    >
      {" "}
      <div className="mt-20  h-screen w-1/2 md:px-16">
        <h1 class="text-3xl font-bold my-10 text-white text-center">
          Đặt lại mật khẩu
        </h1>

        <label class="block text-white font-medium mb-2 mt-10" for="email">
          Nhập mật khẩu mới:
        </label>
        <div className="relative">
          <input
            class="border p-3 w-full rounded px-3 focus:outline-none"
            id="password"
            type={`${isShowPassword ? "text" : "password"}`}
            placeholder="***"
            value={userPassword}
            onChange={handlePassChange}
          />
          <button
            type="button"
            className="absolute top-1/2 transform -translate-y-1/2 right-4"
            onClick={togglePasswordVisibility}
          >
            {isShowPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
        <label class="mt-10 block text-white font-medium mb-2" for="email">
          Xác nhận mật khẩu mới:
        </label>
        <div className="relative">
          <input
            class="border p-3 w-full rounded px-3 focus:outline-none"
            id="confirmPassword"
            type={`${isShowConfirmPassword ? "text" : "password"}`}
            value={userConfirmPassword}
            onChange={handleConfirmPassChange}
            placeholder="***"
          />
          <button
            type="button"
            className="absolute top-1/2 transform -translate-y-1/2 right-4"
            onClick={toggleConfirmPasswordVisibility}
          >
            {isShowConfirmPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
        <button
          class="mt-10 bg-white  text-gray-700 hover:bg-card  py-2  font-medium rounded hover:bg-blue-600 items-center w-full"
          onClick={handleForgotPassword}
        >
          Đặt lại
        </button>
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

export default ResetPassword;
