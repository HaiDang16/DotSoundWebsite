const express = require("express");

const usersControllers = require("../controllers/users-controllers");

const router = express.Router();

router.get("/Login", usersControllers.LoginGoogle);

router.get("/GetUserDetails/:userID", usersControllers.getUserDetails);

router.post("/Register", usersControllers.Register);

router.post("/Login", usersControllers.Login);

router.post(
  "/CheckAccountForgotPassword",
  usersControllers.checkAccountForgotPassword
);

router.post("/ResetPassword", usersControllers.resetPassword);

router.put("/UpdateAvatar", usersControllers.updateAvatar);

router.put("/UpdateUserProfile", usersControllers.updateUserProfile);

router.put("/ChangePassword", usersControllers.changePassword);

module.exports = router;
