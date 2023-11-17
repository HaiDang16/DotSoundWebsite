import AlertError from "../../components/shared/AlertError";
import AlertSuccess from "../../components/shared/AlertSuccess";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import BackgroundLogin from "../../assets/img/background_Login.jpg";
const CryptoJS = require("crypto-js");
const ResetPassword = () => {
  let userEmailDecrypted;
  const navigate = useNavigate();
  const baseURL = "http://localhost:4000/";
  const [searchParams] = useSearchParams();
  const userEmailQuery = searchParams.get("rs");

  const decryptedBytes = CryptoJS.AES.decrypt(userEmailQuery, "secret key 123");
  userEmailDecrypted = decryptedBytes.toString(CryptoJS.enc.Utf8);
  console.log("userEmailDecrypted: ", userEmailDecrypted);

  const [userPassword, setUserPassword] = useState("");
  const [userConfirmPassword, setUserConfirmPassword] = useState("");
  const [handleError, setHandleError] = useState({
    errPass: "",
    errConfirmPass: "",
  });
  const handlePassChange = (e) => {
    setUserPassword(e.target.value);
    setHandleError({ errPass: "" });
  };

  const handleConfirmPassChange = (e) => {
    setUserConfirmPassword(e.target.value);
    setHandleError({ errConfirmPass: "" });
  };
  const handleForgotPassword = async () => {
    if (!userPassword) {
      setHandleError({ errPass: "Vui lòng nhập mật khẩu" });
      return;
    } else if (!userConfirmPassword) {
      setHandleError({ errConfirmPass: "Vui lòng nhập xác nhận mật khẩu" });
      return;
    } else if (userPassword !== userConfirmPassword) {
      setHandleError({
        errConfirmPass: "Mật khẩu không khớp. Vui lòng kiểm tra lại",
      });
      return;
    }

    const apiUrl = `${baseURL}api/users/ResetPassword`;

    const data = { userPassword: userPassword, userEmail: userEmailDecrypted };
    try {
      const response = await axios.post(apiUrl, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("response: ", response);

      if (response.data.message === "Đổi mật khẩu thành công công") {
        navigate("/Login");
      }
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
        <div className="my-10">
          <label class="block text-white font-medium mb-2" for="email">
            Nhập mật khẩu mới:
          </label>

          <input
            class="border p-3 w-full rounded px-3 focus:outline-none"
            id="password"
            type="password"
            placeholder="***"
            value={userPassword}
            onChange={handlePassChange}
          />
          {handleError.errPass && <AlertError msg={handleError.errPass} />}
          {/* {handleError && (
            <p className="text-red-500 mt-2 font-medium ml-1">
              {handleError.errPass}
            </p>
          )} */}
        </div>
        <div className="my-10">
          <label class="block text-white font-medium mb-2" for="email">
            Xác nhận mật khẩu mới:
          </label>
          <input
            class="border p-3 w-full rounded px-3 focus:outline-none"
            id="confirmPassword"
            type="password"
            value={userConfirmPassword}
            onChange={handleConfirmPassChange}
            placeholder="***"
          />
          {handleError.errConfirmPass && <AlertError msg={handleError.errConfirmPass} />}
          {/* {handleError && (
            <p className="text-red-500 mt-2 font-medium ml-1">
              {handleError.errConfirmPass}
            </p>
          )} */}
        </div>
        <button
          class="bg-white  text-gray-700 hover:bg-card  py-2  font-medium rounded hover:bg-blue-600 items-center w-full"
          onClick={handleForgotPassword}
        >
          Đặt lại
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
