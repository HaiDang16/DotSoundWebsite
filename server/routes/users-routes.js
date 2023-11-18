const express = require("express");

const usersControllers = require("../controllers/users-controllers");

const router = express.Router();

router.get("/Login", usersControllers.LoginGoogle);

router.get("/GetUserDetails/:userID", usersControllers.getUserDetails);

router.get("/GetAllUsers", usersControllers.getAllUsers);

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

router.put("/updateRole/:userId", usersControllers.updateRole);

router.put(
  "/UpdateUserProfileWithOutPassword",
  usersControllers.updateUserProfileWithOutPassword
);

router.delete("/DeleteUser/:userId", usersControllers.deleteUser);

module.exports = router;
