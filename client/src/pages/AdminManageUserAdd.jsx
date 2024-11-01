import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ref, deleteObject } from "firebase/storage";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { storage } from "../config/firebase.config";
import { getAllArtist, register } from "../api";
import { SET_ALL_USERS } from "../store/actions";
import {
  ImageLoader,
  ImageUploaderUserAvatar,
  DisabledButton,
  AlertErrorBottom,
  AlertSuccessBottom,
} from "../components";
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
const AddNewArtist = () => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phoneRegex = /^\d{9,10}$/;

  const [isArtist, setIsArtist] = useState(false);
  const [artistProgress, setArtistProgress] = useState(0);
  const [artistCoverImage, setArtistCoverImage] = useState(null); 
  const dispatch = useDispatch(); 

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAlert, setIsAlert] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
    setIsAlert(null);
  };
  const handlePhoneNumChange = (e) => {
    setPhone(e.target.value);
    setIsAlert(null);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsAlert(null);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setIsAlert(null);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setIsAlert(null);
  };

  const togglePasswordVisibility = () => {
    setIsShowPassword(!isShowPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setIsShowConfirmPassword(!isShowConfirmPassword);
  };

  const deleteImageObject = (songURL) => {
    setIsArtist(true);
    setArtistCoverImage(null);
    const deleteRef = ref(storage, songURL);
    deleteObject(deleteRef).then(() => {
      setIsAlert("success");
      setAlertMessage("File removed successfully");
      setTimeout(() => {
        setIsAlert(null);
      }, 4000);
      setIsArtist(false);
    });
  };
  async function submit(e) {
    e.preventDefault();
    const splitName = splitFullName(name);
    const lastName = splitName.restOfName;
    const firstName = splitName.firstName;
    if (!name || !lastName || !firstName) {
      setIsAlert("error");
      setAlertMessage("Họ và tên không hợp lệ");
      return;
    } else if (!phone) {
      setIsAlert("error");
      setAlertMessage("Số điện thoại không được để trống");
      return;
    } else if (!phoneRegex.test(phone)) {
      setIsAlert("error");
      setAlertMessage("Số điện thoại không hợp lệ. Vui lòng kiểm tra lại");
      return;
    } else if (!email) {
      setIsAlert("error");
      setAlertMessage("Email không được để trống");
      return;
    } else if (!emailRegex.test(email)) {
      setIsAlert("error");
      setAlertMessage("Email không hợp lệ. Vui lòng kiểm tra lại");
      return;
    } else if (!password) {
      setIsAlert("error");
      setAlertMessage("Mật khẩu không được để trống");
      return;
    } else if (!confirmPassword) {
      setIsAlert("error");
      setAlertMessage("Vui lòng nhập xác nhận lại mật khẩu");
      return;
    } else if (password !== confirmPassword) {
      setIsAlert("error");
      setAlertMessage("Mật khẩu và xác nhận mật khẩu không khớp");
      return;
    }

    const dataReq = {
      lastName,
      firstName,
      phone,
      email,
      password,
      avatarURL: artistCoverImage,
    };

    try {
      register(dataReq).then((res) => {
        console.log("res: ", res);
        console.log("res.data.message: ", res.data.message);
        if (res.data.message === "Đăng ký thành công") {
          setIsArtist(false);
          setArtistCoverImage(null);
          setName("");
          setPhone("");
          setPassword("");
          setConfirmPassword("");
          setEmail("");
          setIsAlert("success");
          setAlertMessage("Tạo tài khoản người dùng thành công");
          setTimeout(() => {
            setIsAlert(null);
            getAllArtist().then((artistData) => {
              dispatch({
                type: SET_ALL_USERS,
                allUsers: artistData.users,
              });
            });
          }, 4000);
        } else if (res.data.message === "Email đã tồn tại") {
          setIsAlert("error");
          setAlertMessage(
            "Email đã được dùng để đăng ký. Vui lòng kiểm tra lại"
          );
          return;
        } else if (res.data.message === "Số điện thoại đã tồn tại") {
          setIsAlert("error");
          setAlertMessage(
            "Số điện thoại đã được dùng để đăng ký. Vui lòng kiểm tra lại"
          );
          return;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex items-center justify-evenly w-full flex-wrap">
      <div className="bg-card  backdrop-blur-md w-full lg:w-225 h-225 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
        {isArtist && <ImageLoader progress={artistProgress} />}
        {!isArtist && (
          <>
            {!artistCoverImage ? (
              <ImageUploaderUserAvatar
                setImageURL={setArtistCoverImage}
                setAlert={setIsAlert}
                alertMsg={setAlertMessage}
                isLoading={setIsArtist}
                setProgress={setArtistProgress}
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
          placeholder="Họ và tên"
          className="w-full lg:w-300 p-3 rounded-md text-base font-semibold text-white outline-none shadow-sm border border-gray-300 bg-transparent"
          value={name}
          onChange={handleNameChange}
        />

        <div className="w-full lg:w-300 p-3 flex items-center rounded-md  shadow-sm border border-gray-300">
          <input
            type="text"
            placeholder="Số điện thoại"
            className="w-full text-base font-semibold text-white outline-none bg-transparent"
            value={phone}
            onChange={handlePhoneNumChange}
          />
        </div>

        <div className="w-full lg:w-300 p-3 flex items-center rounded-md  shadow-sm border border-gray-300">
          <input
            type="text"
            placeholder="Email"
            className="w-full text-base font-semibold text-white outline-none bg-transparent"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="relative w-full lg:w-300 p-3 flex items-center rounded-md  shadow-sm border border-gray-300">
          <input
            type={`${isShowPassword ? "text" : "password"}`}
            placeholder="Mật khẩu"
            className="w-full text-base font-semibold text-white outline-none bg-transparent"
            value={password}
            onChange={handlePasswordChange}
          />
          <button
            type="button"
            className="absolute top-1/2 transform -translate-y-1/2 right-4"
            onClick={togglePasswordVisibility}
          >
            {isShowPassword ? (
              <FaEye color="white" />
            ) : (
              <FaEyeSlash color="white" />
            )}
          </button>
        </div>
        <div className="relative w-full lg:w-300 p-3 flex items-center rounded-md  shadow-sm border border-gray-300">
          <input
            type={`${isShowConfirmPassword ? "text" : "password"}`}
            placeholder="Nhập lại mật khẩu"
            className="w-full text-base font-semibold text-white outline-none bg-transparent"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          <button
            type="button"
            className="absolute top-1/2 transform -translate-y-1/2 right-4"
            onClick={togglePasswordVisibility}
          >
            {isShowConfirmPassword ? (
              <FaEye color="white" />
            ) : (
              <FaEyeSlash color="white" />
            )}
          </button>
        </div>

        <div className="w-full lg:w-300 flex items-center justify-center lg:justify-end">
          {isArtist ? (
            <DisabledButton />
          ) : (
            <motion.button
              whileTap={{ scale: 0.75 }}
              className="px-8 py-2 rounded-md text-white bg-blue-700 hover:shadow-lg"
              onClick={submit}
            >
              Tải lên
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
