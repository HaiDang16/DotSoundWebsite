import AlertErrorBottom from "../components/AlertErrorBottom";
import AlertSuccessBottom from "../components/AlertSuccessBottom";
import React, { useEffect, useSyncExternalStore } from "react";
import { useState } from "react";
import { BsApp, BsCheckSquare } from "react-icons/bs";
import { LogoDotSounds } from "../assets/img";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SET_USER, SET_AUTH } from "../store/actions";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../config/firebase.config";
import { FcGoogle } from "react-icons/fc";
import { validateUser, register } from "../api";
import BackgroundLogin from "../assets/img/background_Login.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginWithGoogle = async () => {
    await signInWithPopup(firebaseAuth, provider).then((userCred) => {
      if (userCred) {
        dispatch({
          type: SET_AUTH,
          auth: true,
        });
        window.localStorage.setItem("auth", "true");
        firebaseAuth.onAuthStateChanged((userCred) => {
          if (userCred) {
            userCred.getIdToken().then((token) => {
              window.localStorage.setItem("auth", "true");
              validateUser(token).then((data) => {
                dispatch({
                  type: SET_USER,
                  user: data,
                });
              });
            });
            navigate("/", { replace: true });
          } else {
            dispatch({
              type: SET_AUTH,
              auth: false,
            });
            dispatch({
              type: SET_USER,
              user: null,
            });
            navigate("/Register");
          }
        });
      }
    });
  };

  // Email regular expression for validation
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phoneRegex = /^\d{9,10}$/;
  // Khúc này của đăng ký chay
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isThoaThuan, setIsThoaThuan] = useState(false);
  const [isChinhSach, setIsChinhSach] = useState(false);
  const [isAlert, setIsAlert] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const handleThoaThuanChange = () => {
    setIsThoaThuan(!isThoaThuan);
    setIsAlert(null);
  };
  const handleChinhSachChange = () => {
    setIsChinhSach(!isChinhSach);
    setIsAlert(null);
  };
  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
    setIsAlert(null);
  };
  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
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
  async function submit(e) {
    e.preventDefault();
    if (!lastName) {
      setIsAlert("error");
      setAlertMessage("Họ và tên đệm không được để trống");
      return;
    } else if (!firstName) {
      setIsAlert("error");
      setAlertMessage("Tên không được để trống");
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
    } else if (!isThoaThuan) {
      setIsAlert("error");
      setAlertMessage(
        "Vui lòng đồng ý với Thỏa thuận về điều khoản và điều kiện sử dụng để tiếp tục "
      );
      return;
    } else if (!isChinhSach) {
      setIsAlert("error");
      setAlertMessage("Vui lòng đồng ý với chính sách bảo mật để tiếp tục ");
      return;
    }

    const dataReq = {
      lastName,
      firstName,
      phone,
      email,
      password,
      avatarURL: null,
    };

    try {
      register(dataReq).then((res) => {
        console.log("res: ", res);
        console.log("res.data.message: ", res.data.message);
        if (res.data.message === "Đăng ký thành công") {
          navigate("/Login");
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

  const inputStyle =
    "w-full px-4 py-3 border-b border-solid border-[#9BA4B5] focus:outline-none focus:border-blue-900 text[16px] leading-7 placeholder:text-zinc-600 rounded-md cursor-text bg-slate-200";
  return (
    <div
      style={{ backgroundImage: `url(${BackgroundLogin})` }}
      className="w-full h-auto flex flex-col justify-center items-center rounded-lg shadow-md md:p-10 bg-center bg-cover bg-size font-sans relative"
    >
      {" "}
      <section className="px-5 lg:px-0 max-w-[570px]">
        <div className="flex justify-center mb-8 h-auto">
          <img className="h-40 w-50" src={LogoDotSounds} alt="" />
        </div>

        <h1 className=" text-[30px] leading-9 font-bold mb-8 font-sans mx-auto text-white text-center">
          Đăng Ký
        </h1>
        <form action="POST">
          <div className="flex mb-8 justify-between">
            <div>
              <input
                className={inputStyle}
                type="text"
                placeholder="Họ và Tên Đệm"
                name="lastName"
                // value={formData.lastName}
                onChange={handleLastNameChange}
              />
            </div>

            <div>
              <input
                className={inputStyle}
                type="text"
                placeholder="Tên"
                name="firstName"
                // value={formData.firstName}
                onChange={handleFirstNameChange}
              />
            </div>
          </div>
          <div className="mb-8">
            <div
              className="flex space-x-0 rounded-md"
              style={{ overflow: "hidden" }}
            >
              <div className="bg-slate-200  border-l-10  border-b border-solid border-[#9BA4B5]  w-[90px] h-[60px] flex items-center justify-center relative">
                <p className="font-semibold mr-2 text-center flex items-center ">
                  (+84)
                </p>
              </div>

              <input
                className="w-[510px]  py-3 border-b border-solid border-[#9BA4B5] focus:outline-none focus:border-blue-800 text[16px] 
                leading-7 placeholder:text-zinc-600  cursor-text bg-slate-200 ml-[57px]"
                type="phone"
                placeholder="Số điện thoại"
                name="phone"
                //   value={formData.phone}
                onChange={handlePhoneNumChange}
              />
            </div>
          </div>

          <div className="mb-8">
            <input
              className={inputStyle}
              type="email"
              placeholder="Email"
              name="email"
              //   value={formData.email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="relative mt-8">
            <input
              className={inputStyle}
              type={`${isShowPassword ? "text" : "password"}`}
              placeholder="Mật khẩu"
              name="password"
              value={password}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              className="absolute top-1/2 transform -translate-y-1/2 right-4"
              onClick={togglePasswordVisibility}
            >
              {isShowPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <div className="relative mt-8">
            <input
              className={inputStyle}
              type={`${isShowConfirmPassword ? "text" : "password"}`}
              placeholder="Nhập lại mật khẩu"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <button
              type="button"
              className="absolute top-1/2 transform -translate-y-1/2 right-4"
              onClick={toggleConfirmPasswordVisibility}
            >
              {isShowConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <div className="text-white mt-8 ml-4 flex items-center">
            {!isThoaThuan ? (
              <BsApp
                onClick={handleThoaThuanChange}
                className="cursor-pointer"
              />
            ) : (
              <BsCheckSquare
                className="cursor-pointer"
                onClick={handleThoaThuanChange}
                style={{ color: "white" }}
              />
            )}
            <p className="ml-2">
              Tôi đồng ý với Thỏa thuận về điều khoản và điều kiện sử dụng
            </p>
          </div>
          <div className="text-white mt-8 ml-4 flex items-center">
            {!isChinhSach ? (
              <BsApp
                onClick={handleChinhSachChange}
                className="cursor-pointer"
              />
            ) : (
              <BsCheckSquare
                className="cursor-pointer"
                onClick={handleChinhSachChange}
                style={{ color: "white" }}
              />
            )}
            <p className="ml-2">Tôi đồng ý với chính sách bảo mật</p>
          </div>

          <p className="mt-8 text-center text-white">
            Bằng việc bấm vào "ĐĂNG KÝ", bạn đồng ý rằng bạn đã đọc, hiểu và
            đồng ý với các điều khoản và điều kiện được quy định tại
          </p>
          <div className="mt-10">
            <button
              type="submit"
              className="w-full bg-white text-black text-[25px] leading-[30px] rounded-lg px-4 py-3 font-semibold hover:bg-cardOverlay/80 "
              name="submit"
              onClick={submit}
            >
              Đăng Ký
            </button>

            <div class="flex items-center justify-between mt-8">
              <div class="border-t-2 border-white flex-1 mt-5"></div>
              <div class="text-[25px] text-white ml-4 mr-4">Hoặc</div>
              <div class="border-t-2 border-white flex-1 mt-5"></div>
            </div>
          </div>
          <div className="mt-10 flex items-center relative">
            <div
              className="flex w-full items-center justify-center gap-2 px-4 py-2 rounded-md bg-cardOverlay 
          cursor-pointer hover:bg-card hover:shadow-md duration-100 ease-in-out transition-all"
              onClick={loginWithGoogle}
            >
              <FcGoogle className="text-xl" />
              Tiếp tục với Google
            </div>
          </div>
          <div className="flex items-center justify-center">
            <p className="mt-11 text-white text-[15px]">Bạn đã có tài khoản?</p>
            <Link
              to={"/login"}
              className="mt-11 text-white text-[15px] border-b-2 border-b-red-600 ml-3"
            >
              Đăng nhập
            </Link>
          </div>
        </form>
      </section>
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

export default Register;
