import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackgroundLogin from "../../assets/img/background_Login.jpg";
const CryptoJS = require("crypto-js");

const ForgotPass = () => {
  const navigate = useNavigate();
  const baseURL = "http://localhost:4000/";
  const [userEmail, setUserEmail] = useState("");
  const [userPhoneNum, setUserPhoneNum] = useState("");
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phoneRegex = /^\d{10,}$/;
  const [handleError, setHandleError] = useState({
    errEmail: "",
    errPhoneNum: "",
  });
  const handleEmailChange = (e) => {
    setUserEmail(e.target.value);
    setHandleError({ errEmail: "" });
  };

  const handlePhoneNumChange = (e) => {
    setUserPhoneNum(e.target.value);
    setHandleError({ errPhoneNum: "" });
  };

  const handleForgotPassword = async () => {
    if (!userEmail) {
      setHandleError({ errEmail: "Email không được để trống" });
      return;
    } else if (!emailRegex.test(userEmail)) {
      setHandleError({ errEmail: "Email không hợp lệ. Vui lòng kiểm tra lại" });
      return;
    } else if (!userPhoneNum) {
      setHandleError({ errPhoneNum: "Số điện thoại không được để trống" });
      return;
    } else if (userPhoneNum.length !== 10) {
      setHandleError({
        errPhoneNum: "Số điện thoại không hợp lệ. Vui lòng kiểm tra lại",
      });
      return;
    } else if (!phoneRegex.test(userPhoneNum)) {
      setHandleError({
        errPhoneNum: "Số điện thoại không hợp lệ. Vui lòng kiểm tra lại",
      });
      return;
    }

    const apiUrl = `${baseURL}api/users/CheckAccountForgotPassword`;

    const data = {
      email: userEmail,
      phoneNum: userPhoneNum,
    };
    try {
      const response = await axios.post(apiUrl, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("response: ", response);

      if (response.data.message === "Thông tin người dùng có tồn tại") {
        const encryptedString = CryptoJS.AES.encrypt(
          userEmail,
          "secret key 123"
        ).toString();
        navigate(`/ResetPassword?rs=${encryptedString}`);
      } else if (
        response.data.message === "Không tìm thấy thông tin người dùng"
      ) {
        //Thêm popup

        alert("Thông tin tài khoản không hợp lệ");
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
          Quên mật khẩu
        </h1>
        <div class="my-10">
          <label class="block text-white font-medium mb-2 " for="email">
            Nhập email:
          </label>
          <input
            class="border p-3 w-full rounded px-3 focus:outline-none"
            id="email"
            type="email"
            value={userEmail}
            onChange={handleEmailChange}
            placeholder="Nhập email..."
          />
          {handleError && (
            <p className="text-red-500 mt-2 font-medium ml-1">
              {handleError.errEmail}
            </p>
          )}
        </div>
        <div className="my-10">
          <label class="block text-white font-medium mb-2" for="email">
            Nhập số điện thoại:
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            class="border p-3 w-full rounded px-3 focus:outline-none"
            value={userPhoneNum}
            onChange={handlePhoneNumChange}
            placeholder=" Nhập số điện thoại..."
          />
          {handleError && (
            <p className="text-red-500 mt-2 font-medium ml-1">
              {handleError.errPhoneNum}
            </p>
          )}
        </div>
        <button
          class="bg-white hover:bg-card text-gray-700 py-2  font-medium rounded hover:bg-blue-600 items-center w-full"
          onClick={handleForgotPassword}
        >
          Quên mật khẩu
        </button>
      </div>
    </div>
  );
};

export default ForgotPass;
