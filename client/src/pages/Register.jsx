import AlertError from "../components/AlertError";
import AlertSuccess from "../components/AlertSuccess";
import AlertErrorBottom from "../components/AlertErrorBottom";
import AlertSuccessBottom from "../components/AlertSuccessBottom";
import React, { useEffect, useSyncExternalStore } from "react";
import { useState } from "react";
import { BiSolidChevronDown } from "react-icons/bi";
import { BsApp, BsCheckSquare } from "react-icons/bs";
import { LogoDotSounds } from "../assets/img";
import { Link, redirect, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { SET_USER, SET_AUTH } from "../store/actions";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../config/firebase.config";
import { FcGoogle } from "react-icons/fc";
import { validateUser, register } from "../api";
import BackgroundLogin from "../assets/img/background_Login.jpg";

const Register = () => {
  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const setAlertOut = () => {
    setTimeout(() => {
      setIsAlert(null);
    }, 2000);
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

  // Khúc này của đăng ký chay
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(""); // Thông báo lỗi email
  const [phoneError, setPhoneError] = useState(""); // Thông báo lỗi email
  const [isBsApp, setIsBsApp] = useState(true);
  const [isAlert, setIsAlert] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [handleError, setHandleError] = useState({
    errFirstNamw: null,
    errLastName: null,
    errPhoneNum: null,
    errEmail: null,
    errPassword: null,
    errConfirmPassword: null,
    errThoaThuan: null,
    errChinhSach: null,
  });

  const handleIconClick = () => {
    setIsBsApp(!isBsApp); // Khi biểu tượng được nhấp, thay đổi trạng thái để chuyển đổi giữa BsApp và BsCheckSquare.
    setIsChecked(!isChecked); // Đảo ngược trạng thái của isChecked khi người dùng tích vào checkbox
    setError({ ...error, isChecked: "" }); // Xóa thông báo lỗi khi người dùng tích vào checkbox
  };
  const handleLastNameChane = (e) => {
    setLastName(e.target.value);
    setHandleError({ errLastName: null });
    setIsAlert(null);
  };

  const [error, setError] = useState({
    lastName: "",
    firstName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    isChecked: "",
  });

  async function submit(e) {
    e.preventDefault();
    const newError = { ...error }; // Tạo một bản sao mới của error để cập nhật thông báo lỗi
    if (!lastName) {
      setHandleError({ errLastName: "Họ và tên đệm không được để trống" });
      setIsAlert("error");
      setAlertMessage("Họ và tên đệm không được để trống");
      return;
    } else if (!firstName) {
      setHandleError({ errLastName: "Tên không được để trống" });
    }
    // Kiểm tra xem người dùng đã tích vào điều khoản chưa
    else if (!isChecked) {
      newError.isChecked =
        "Vui lòng đồng ý với điều khoản và chính sách bảo mật để tiếp tục.";
    } else if (!phone) {
      newError.phone = "Số điện thoại không được để trống";
    } else if (phone.length !== 10) {
      newError.phone = "Số điện thoại phải có đúng 10 số";
    } else if (!email) {
      newError.email = "Email không được để trống";
    } else if (!emailRegex.test(email)) {
      newError.email = "Email không hợp lệ. Vui lòng kiểm tra lại.";
    } else if (!password) {
      newError.password = "Mật khẩu không được để trống";
    } else if (password !== confirmPassword) {
      newError.confirmPassword = "Mật khẩu và xác nhận mật khẩu không khớp";
    }

    // Kiểm tra nếu có bất kỳ thông báo lỗi nào tồn tại
    for (const key in newError) {
      if (newError[key]) {
        setError(newError);
        return;
      }
    }
    const dataReq = {
      lastName,
      firstName,
      phone,
      email,
      password,
    };

    try {
      register(dataReq).then((res) => {
        console.log("res: ", res);
        console.log("res.data.message: ", res.data.message);
        if (res.data.message === "Đăng ký thành công") {
          navigate("/Login");
        } else if (res.data.message === "Email exist") {
          console.log("Email exist");
          setEmailError("Email đã được dùng để đăng ký. Vui lòng kiểm tra lại");
        } else if (res.data.message === "PhoneNum exist") {
          setPhoneError(
            "Số điện thoại đã được dùng để đăng ký. Vui lòng kiểm tra lại"
          );
        }
      });
    } catch (error) {
      setError({ ...error, registration: error.response.data.message });
    }
  }

  const [showPassword, setShowPassword] = useState(false);
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

        {/* Nhet backend vao day */}
        <form action="POST">
          <div className="flex mb-8 justify-between">
            <div>
              <input
                className={inputStyle}
                type="text"
                placeholder="Họ và Tên Đệm"
                name="lastName"
                // value={formData.lastName}
                onChange={handleLastNameChane}
              />
              {/* {handleError.errLastName && (
                <AlertError msg={handleError.errLastName} />
              )} */}
            </div>

            <div>
              <input
                className={inputStyle}
                type="text"
                placeholder="Tên"
                name="firstName"
                // value={formData.firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setError({ ...error, firstName: "" });
                }}
              />
              {error.firstName && <AlertError msg={error.firstName} />}
              {/* {error.firstName && (
                <div className="mt-2 text-red-500 italic text-sm font-semibold">
                  {error.firstName}
                </div>
              )} */}
            </div>
          </div>
          <div className="mb-8">
            <div
              className="flex space-x-0  rounded-md"
              style={{ overflow: "hidden" }}
            >
              <div className="bg-slate-200  border-l-10  border-b border-solid border-[#9BA4B5]  w-[140px] h-[60px] flex items-center justify-center relative">
                {/* <img
                  src={vietnam}
                  alt="IconVN"
                  className="w-[40px] h-[45px] inset-0"
                /> */}
                <p className="font-semibold ml-3 mr-2 text-center flex gap-1 items-center ">
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
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError({ ...error, phone: "" });
                  setPhoneError("");
                }}
              />
            </div>
            {error.phone && <AlertError msg={error.phone} />}
            {phoneError && <AlertError msg={phoneError} />}
            {/* {error.phone && (
              <div className="mt-2 text-red-500 italic text-sm font-semibold">
                {error.phone}
              </div>
            )} */}
            {/* {phoneError && (
              <div className="mt-2 text-red-500 italic text-sm font-semibold">
                {phoneError}
              </div>
            )} */}
          </div>

          <div className="mb-8">
            <input
              className={inputStyle}
              type="email"
              placeholder="Email"
              name="email"
              //   value={formData.email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError({ ...error, email: "" });
                setEmailError("");
              }}
            />
            {error.email && <AlertError msg={error.email} />}
            {emailError && <AlertError msg={emailError} />}
            {/* {error.email && (
              <div className="mt-2 text-red-500 italic text-sm font-semibold block">
                {error.email}
              </div>
            )}

            {emailError && (
              <div className="mt-2 text-red-500 italic text-sm font-semibold">
                {emailError}
              </div>
            )} */}
          </div>
          <div className="mt-8">
            <input
              className={inputStyle}
              type="password"
              placeholder="Mật khẩu"
              name="password"
              //   value={formData.password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError({ ...error, password: "" });
              }}
            />
            {error.password && <AlertError msg={error.password} />}

            {/* {error.password && (
              <div className="mt-2 text-red-500 italic text-sm font-semibold">
                {error.password}
              </div>
            )} */}
          </div>
          <div className="mt-8">
            <input
              className={inputStyle}
              type="password"
              placeholder="Nhập lại mật khẩu"
              name="confirmPassword"
              //   value={formData.confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError({ ...error, confirmPassword: "" });
              }}
            />
            {error.confirmPassword && (
              <AlertError msg={error.confirmPassword} />
            )}
            {/* {error.confirmPassword && (
              <div className="mt-2 text-red-500 italic text-sm font-semibold">
                {error.confirmPassword}
              </div>
            )} */}
          </div>
          <div className="text-white mt-8 ml-4 flex items-center">
            {isBsApp ? (
              <BsApp onClick={handleIconClick} className="cursor-pointer" />
            ) : (
              <BsCheckSquare
                className="cursor-pointer"
                onClick={handleIconClick}
                style={{ color: "white" }}
              />
            )}
            <p className="ml-2">
              Tôi đồng ý với Thỏa thuận về điều khoản và điều kiện sử dụng
            </p>
          </div>
          <div className="text-white mt-8 ml-4 flex items-center">
            {isBsApp ? (
              <BsApp onClick={handleIconClick} className="cursor-pointer" />
            ) : (
              <BsCheckSquare
                className="cursor-pointer"
                onClick={handleIconClick}
                style={{ color: "white" }}
              />
            )}
            <p className="ml-2">Tôi đồng ý với chính sách bảo mật</p>
          </div>
          {error.isChecked && <AlertError msg={error.isChecked} />}
          {/* {error.isChecked && (
            <div className="mt-2 text-red-500 italic text-sm font-semibold w-full text-center">
              {error.isChecked}
            </div>
          )} */}
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
