const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const HttpError = require("../models/http-error");
const User = require("../models/account");

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
const LoginGoogle = async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(500).send({ message: "Mã token không hợp lệ" });
  }
  const token = req.headers.authorization.split(" ")[1];

  try {
    const decodeValue = await admin.auth().verifyIdToken(token);
    if (!decodeValue) {
      return res.status(505).json({ message: "Un Authorized" });
    } else {
      // return res.status(200).json(decodeValue)
      //Checking user exists
      const userExists = await User.findOne({ GoogleID: decodeValue.user_id });
      if (!userExists) {
        newUserData(decodeValue, req, res);
      } else {
        updateNewUserData(decodeValue, req, res);
      }
    }
  } catch (error) {
    return res.status(505).json({ message: error });
  }
};
const newUserData = async (decodeValue, req, res) => {
  console.log("newUserData");
  console.log(decodeValue);
  const nameParts = splitFullName(decodeValue.name);
  const newUser = new User({
    cusFirstName: nameParts.firstName,
    cusLastName: nameParts.restOfName,
    cusEmail: decodeValue.email,
    cusAvatar: decodeValue.picture,
    googleID: decodeValue.user_id,
    emailVerified: decodeValue.email_verified,
    cusRole: "member",
    authTime: decodeValue.auth_time,
    cusPhoneNum: null,
    cusBirthday: null,
    cusSex: null,
    cusPassword: null,
  });

  try {
    const savedUser = await newUser.save();
    res.status(200).send({ user: savedUser, success: true });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
};
const updateNewUserData = async (decodeValue, req, res) => {
  const filter = { GoogleID: decodeValue.user_id };
  const option = {
    upsert: true,
    new: true,
  };
  try {
    const result = await User.findOneAndUpdate(
      filter,
      { AuthTime: decodeValue.auth_time },
      option
    );
    res.status(200).send({ user: result });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
};
// Register
const Register = async (req, res) => {
  console.log("Register");
  const { lastName, firstName, phone, email, password } = req.body;

  // Tìm tài khoản trong cơ sở dữ liệu bằng email
  const userEmail = await User.findOne({ CusEmail: email });

  if (userEmail) {
    // Đã tồn tại email
    return res.status(200).json({ message: "Email exist" });
  }

  // Tìm tài khoản trong cơ sở dữ liệu bằng email
  const userPhone = await User.findOne({ CusPhoneNum: phone });

  if (userPhone) {
    // Đã tồn tại email
    return res.status(200).json({ message: "PhoneNum exist" });
  }

  // Định nghĩa biểu thức chính quy cho kiểm tra định dạng email
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (!emailRegex.test(email)) {
    // Nếu địa chỉ email không khớp với biểu thức chính quy
    return res
      .status(200)
      .json({ message: "Email không hợp lệ. Vui lòng kiểm tra lại." });
  }

  try {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    // Tạo một đối tượng tài khoản người dùng từ dữ liệu POST, lưu vào mongodb

    const newAccount = new User({
      cusFirstName: firstName,
      cusLastName: lastName,
      cusEmail: email,
      cusAvatar: null,
      googleID: null,
      emailVerified: null,
      cusRole: "member",
      authTime: null,
      cusPhoneNum: phone,
      cusBirthday: null,
      cusSex: null,
      cusPassword: hashedPassword,
    });
    const user_account = await newAccount.save();
    if (user_account) {
      res
        .status(201)
        .json({ message: "Đăng ký thành công", user: user_account });
    }
  } catch (error) {
    // console.error("Lỗi khi lưu tài khoản: " + error);
    res.status(500).json({ message: "Không được để trống" });
  }
};

// Login
const Login = async (req, res) => {
  const { email, password } = req.body;
  // Kiểm tra xem email và mật khẩu có bị để trống
  if (!email || !password) {
    return res.status(200).json({ message: "Không được để trống" });
  }

  // Tìm tài khoản trong cơ sở dữ liệu bằng email

  const user = await User.findOne({ CusEmail: email, GoogleID: null });

  if (!user) {
    // Nếu không tìm thấy tài khoản với email
    return res.status(200).json({ message: "Invalid account" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.CusPassword);

  if (!isPasswordValid) {
    // Nếu mật khẩu không khớp
    return res.status(200).json({ message: "Invalid account" });
  }

  // Nếu email và mật khẩu đúng
  res.status(200).json({ message: "Account exist", user: user });
};

const updateAvatar = async (req, res) => {
  console.log("Start updateAvatar");
  const userID = req.body.userID;
  const imgURL = req.body.imgURL;
  console.log("imgURL: ", imgURL);
  console.log("userID: ", userID);
  let userData;
  try {
    userData = await User.findById(userID);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Cập nhật ảnh đại diện thất bại", success: false });
  }
  if (!userData) {
    res
      .status(404)
      .json({ message: "Không tìm thấy thông tin người dùng", success: false });
  }

  try {
    userData.CusAvatar = imgURL;
    await userData.save();
    res
      .status(200)
      .json({ message: "Cập nhật ảnh đại diện thành công", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Cập nhật ảnh đại diện thất bại", success: false });
  }
};

const getUserDetails = async (req, res) => {
  console.log("\nStart getUserDetails");
  let users;

  const userID = req.params.userID;
  console.log("userID: ", userID);

  try {
    users = await User.findById(userID);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Lấy thông tin người dùng thất bại", success: false });
  }

  if (!users) {
    return res
      .status(404)
      .json({ message: "Không tìm thấy thông tin người dùng", success: false });
  }
  const obj = users.toObject({ getters: true });
  return res.status(200).json({ user: obj });
};

const checkAccountForgotPassword = async (req, res) => {
  console.log("Start checkAccountForgotPassword");
  const email = req.body.email;
  const phoneNum = req.body.phoneNum;
  console.log("email: ", email);
  console.log("phoneNum: ", phoneNum);

  let userData;
  try {
    userData = await User.findOne({ CusEmail: email, CusPhoneNum: phoneNum });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Quên mật khẩu thất bại", success: false });
  }
  if (!userData) {
    return res.json({
      message: "Không tìm thấy thông tin người dùng",
      success: false,
    });
  }
  return res.status(200).json({
    message: "Thông tin người dùng có tồn tại",
    success: true,
    user: userData,
  });
};

const resetPassword = async (req, res) => {
  console.log("Start changePassword");
  const email = req.body.userEmail;
  const password = req.body.userPassword;
  console.log("email: ", email);

  let userData;
  try {
    userData = await User.findOne({ CusEmail: email });
  } catch (err) {
    console.log("Error: ", err);
    return res
      .status(500)
      .json({ message: "Đổi mật khẩu thất bại", success: false });
  }

  if (!userData) {
    return res
      .status(404)
      .json({ message: "Không tìm thấy thông tin người dùng", success: false });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    userData.CusPassword = hashedPassword;
    await userData.save();
    return res
      .status(200)
      .json({ message: "Đổi mật khẩu thành công công", success: true });
  } catch (error) {
    console.log("Error: ", err);
    return res
      .status(500)
      .json({ message: "Đổi mật khẩu thất bại", success: false });
  }
};

const updateUserProfile = async (req, res) => {
  console.log("\nStart updateUserProfile");
  let users;

  const {
    CusFirstName,
    CusLastName,
    CusEmail,
    CusPhoneNum,
    CusBirthday,
    CusSex,
    userID,
  } = req.body;
  console.log("userID: ", userID);
  console.log("CusFirstName: ", CusFirstName);

  try {
    //Lấy ra danh sách sản phẩm có catKey = lstCatgoryIDs
    users = await User.findById(userID);

    users.CusFirstName = CusFirstName;
    users.CusLastName = CusLastName;
    users.CusEmail = CusEmail;
    users.CusPhoneNum = CusPhoneNum;
    users.CusBirthday = CusBirthday;
    users.CusSex = CusSex;

    await users.save();
    return res.status(200).json({
      message: "Cập nhật thông tin người dùng thành công",
      success: true,
      user: users,
    });
  } catch (err) {
    console.log("Error: ", err);
    return res
      .status(500)
      .json({ message: "Lỗi cập nhật thông tin người dùng", success: false });
  }
};

const changePassword = async (req, res) => {
  console.log("Start changePassword");
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const userID = req.body.userID;
  console.log("newPassword: ", newPassword);
  console.log("oldPassword: ", oldPassword);
  let userData;
  try {
    userData = await User.findById(userID);
  } catch (err) {
    console.log("Error: ", err);
    return res
      .status(500)
      .json({ message: "Đổi mật khẩu thất bại", success: false });
  }

  if (!userData) {
    return res
      .status(404)
      .json({ message: "Không tìm thấy thông tin người dùng", success: false });
  }

  const isPasswordValid = await bcrypt.compare(
    oldPassword,
    userData.CusPassword
  );

  if (!isPasswordValid) {
    return res
      .status(200)
      .json({ message: "Mật khẩu không đúng", success: true });
  }
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    userData.CusPassword = hashedPassword;
    await userData.save();
    return res
      .status(200)
      .json({ message: "Đổi mật khẩu thành công", success: true });
  } catch (error) {
    console.log("Error: ", err);
    return res
      .status(500)
      .json({ message: "Đổi mật khẩu thất bại", success: false });
  }
};

exports.LoginGoogle = LoginGoogle;
exports.Register = Register;
exports.Login = Login;
exports.updateAvatar = updateAvatar;
exports.getUserDetails = getUserDetails;
exports.checkAccountForgotPassword = checkAccountForgotPassword;
exports.resetPassword = resetPassword;
exports.updateUserProfile = updateUserProfile;
exports.changePassword = changePassword;
