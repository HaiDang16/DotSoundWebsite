import AlertErrorBottom from "../components/AlertErrorBottom";
import AlertSuccessBottom from "../components/AlertSuccessBottom";
import { BsApp, BsCheckSquare } from "react-icons/bs";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LogoDotSounds } from "../assets/img";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// Đăng nhập bằng google
import { app } from "../config/firebase.config";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import React, { useEffect } from "react";
import { validateUser, loginAccount } from "../api";
import { IoSearch, IoCartOutline } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { SET_USER, SET_AUTH } from "../store/actions";
import BackgroundLogin from "../assets/img/background_Login.jpg";
const Login = () => {
  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const [showPassword, setShowPassword] = useState(false);
  const [isAlert, setIsAlert] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [isBsApp, setIsBsApp] = useState(true);

  const handleIconClick = () => {
    setIsBsApp(!isBsApp);
  };

  const handleForgotPass = () => {
    navigate("/ForgotPassword");
  };

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
                console.log("validateUser res login: ", data);
                dispatch({
                  type: SET_USER,
                  user: data.user,
                });
                console.log(data);
                window.localStorage.setItem("userData", JSON.stringify(data));
                if (data.user.cusRole === "admin") {
                  navigate("/Admin/Dashboard");
                } else {
                  navigate("/", { replace: true });
                }
              });
            });
          } else {
            dispatch({
              type: SET_AUTH,
              auth: false,
            });
            dispatch({
              type: SET_USER,
              user: null,
            });
            navigate("/Login");
          }
        });
      }
    });
  };

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsAlert(null);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setIsAlert(null);
  };
  const togglePasswordVisibility = () => {
    setIsShowPassword(!isShowPassword);
  };

  async function submit(e) {
    e.preventDefault();

    if (!email) {
      setIsAlert("error");
      setAlertMessage("Vui lòng nhập email!");
      return;
    } else if (!emailRegex.test(email)) {
      setIsAlert("error");
      setAlertMessage("Email không hợp lệ. Vui lòng kiểm tra lại");
      return;
    } else if (!password) {
      setIsAlert("error");
      setAlertMessage("Vui lòng nhập mật khẩu!");
      return;
    }
    const dataReq = { email, password };
    console.log("Login dataReq: ", dataReq);
    try {
      loginAccount(dataReq).then((res) => {
        console.log("Login res: ", res);
        if (res.data.message === "Account exist") {
          dispatch({
            type: SET_USER,
            user: res.data.user,
          });
          console.log(res.data.user);
          dispatch({
            type: SET_AUTH,
            auth: true,
          });
          window.localStorage.setItem("auth", "true");
          window.localStorage.setItem("userData", JSON.stringify(res.data));
          if (res.data.user.cusRole === "admin") {
            navigate("/Admin/Dashboard");
          } else {
            navigate("/");
          }
        } else if (res.data.message === "Invalid account") {
          setIsAlert("error");
          setAlertMessage("Email hoặc mật khẩu không đúng");
          setTimeout(() => {
            setIsAlert(null);
          }, 2000);
          return;
        }
      });
    } catch (error) {
      console.error("Lỗi xảy ra: ", error);
      alert("Có lỗi xảy ra khi thực hiện đăng nhập. Vui lòng thử lại sau.");
    }
  }
  return (
    <div
      style={{ backgroundImage: `url(${BackgroundLogin})` }}
      className="w-full h-auto flex flex-col justify-center items-center rounded-lg shadow-md md:p-10 bg-center bg-cover bg-size font-sans relative"
    >
      {" "}
      <section className="px-5 lg:px-0 max-w-[570px]">
        <div className="flex justify-center mb-4">
          <img className="h-45 w-40" src={LogoDotSounds} alt="" />
        </div>

        <h1 className=" text-[30px] leading-9 font-bold mb-8 font-sans mx-auto text-white text-center">
          Đăng Nhập
        </h1>

        <form className="py-4 md:py-0  ">
          <div className="my-3">
            <label className="text-lg font-bold text-white">Email:</label>
          </div>
          <div className="mb-5">
            <input
              className="w-full px-4 py-3 border-b border-solid border-[#9BA4B5] focus:outline-none focus:border-blue-900 text[16px] 
                    leading-7 placeholder:text-zinc-600  rounded-md cursor-text bg-slate-200 "
              type="email"
              placeholder="Địa chỉ email"
              name="email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>

          <div className="mt-8">
            <label className="text-lg font-bold text-white">Mật khẩu:</label>
          </div>
          <div className="relative my-3">
            <input
              className="w-full px-4 py-3 border-b border-solid border-[#9BA4B5] focus:outline-none focus:border-blue-900 text[16px] 
                    leading-7 placeholder:text-zinc-600 rounded-md cursor-text  bg-slate-200"
              type={isShowPassword ? "text" : "password"}
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

          <div className="text-white mt-5 ml-4 flex items-center">
            {isBsApp ? (
              <BsApp onClick={handleIconClick} />
            ) : (
              <BsCheckSquare
                onClick={handleIconClick}
                style={{ color: "white" }}
              />
            )}
            <p className="ml-2">Nhớ mật khẩu</p>
            <button
              className="border-b-2 border-b-red-600 ml-[270px]"
              onClick={handleForgotPass}
            >
              Quên mật khẩu ?
            </button>
          </div>
          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-white text-black text-[18px] leading-[30px] rounded-lg px-4 py-3 font-bold hover:bg-cardOverlay/80"
              onClick={submit}
            >
              Đăng Nhập
            </button>

            <div class="flex items-center justify-between mt-5">
              <div class="border-t-2 border-white flex-1 mt-2"></div>
              <div class="text-lg text-white mx-5">Hoặc</div>
              <div class="border-t-2 border-white flex-1 mt-2"></div>
            </div>
            <div className="mt-8 flex items-center relative">
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
              <p className="mt-11 text-white text-[15px]">Bạn chưa đăng ký ?</p>
              <Link
                to={"/Register"}
                className="mt-11 text-white text-[15px] border-b-2 border-b-red-600 ml-2"
              >
                Tạo tài khoản
              </Link>
            </div>
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
export default Login;
