const { user1 } = require("../Models/user.models");
const appError = require("../utils/appError");
const httpStatus = require("../utils/httpStatus");
const asyncWrapper = require("../Middlewires/asyncWrapper");
const generateJwt = require("../utils/generate.jwt");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");
const UserAll = user1;
// const

//register
const register = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array()[0], 400, httpStatus.FAIL);
    return next(error);
  }
  const { username, email, numPhone, password } = req.body;
  const olduser = await UserAll.findOne({ email: email });
  if (olduser) {
    const error = appError.create("user already exists", 400, httpStatus.FAIL);
    return next(error);
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const currentDate = moment().tz("Africa/Cairo");
  const newUser = new UserAll({
    username: username,
    email: email,
    password: hashPassword,
    numPhone: numPhone,
    date: currentDate.format("DD-MMM-YYYY hh:mm:ss a"),
  });
  await newUser.save();
  return res.status(200).json({
    status: httpStatus.SUCCESS,
  });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatus.FAIL);
    return next(error);
  }

  const user = await UserAll.findOne({ email: email });
  if (!user) {
    const error = appError.create("user not found", 400, httpStatus.FAIL);
    return next(error);
  }
  const matchedPassword = await bcrypt.compare(password, user.password);
  if (user && matchedPassword) {
    const token = await generateJwt.generate({
      email: user.email,
      id: user._id,
      role: user.role,
    });
    user.token = token;
    await user.save();
    res.json({
      status: httpStatus.SUCCESS,
      data: { token: token },
    });
  } else if (user.password !== password) {
    const error = appError.create(
      "password is incorrect",
      400,
      httpStatus.FAIL
    );
    return next(error);
  } else {
    const error = appError.create("somthing wrong", 500, httpStatus.ERROR);
    return next(error);
  }
});
// مسار لإعادة تعيين كلمة المرور (نسيان الباسورد)

// const forgotPassword = asyncWrapper(async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = appError.create(errors.array()[0], 400, httpStatus.FAIL);
//     return next(error);
//   }
//   const email = req.body.email;
//   const user = await UserAll.findOne({ email: email });
//   if (!user) {
//     const error = appError.create(
//       "not found this email !",
//       400,
//       httpStatus.FAIL
//     );
//     return next(error);
//   }
//   const verifyCode = await emailVerfy.sendEmail(email);
//   const hashVerifyCode = await bcrypt.hash(JSON.stringify(verifyCode), 10);
//   const token = await generateJwt.generate({
//     email: email,
//     id: user._id,
//     role: user.role,
//     verifyCode: hashVerifyCode,
//     // id: uuid.v4(),
//   });
//   return res.status(200).json({
//     status: httpStatus.SUCCESS,
//     // data: newUser,
//     token: token.token,
//     expireData: token.expireIn,
//   });
//   // res.redirect(`/reset-password`)
// });

// const resetPasswordSend = asyncWrapper(async (req, res, next) => {
//   const { email, verifyCode, role, id } = req.currentUser;
//   const currentCode = verifyCode;
//   const code = req.body.code;
//   const matchedCode = await bcrypt.compare(code, currentCode);
//   if (!matchedCode) {
//     const error = appError.create(
//       "the code verification not correct try again",
//       400,
//       httpStatus.FAIL
//     );
//     return next(error);
//   }
//   const token = await generateJwt.generate({
//     email: email,
//     role: role,
//     id: id,
//     // id: uuid.v4(),
//   });
//   return res.status(200).json({
//     status: httpStatus.SUCCESS,
//     token: token.token,
//     expireData: token.expireIn,
//   });
// });
// //
// const resetPasswordOk = asyncWrapper(async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = appError.create(errors.array()[0], 400, httpStatus.FAIL);
//     return next(error);
//   }
//   const { email, role, id } = req.currentUser;
//   const newPassword = req.body.newPassword;
//   const newPassword2 = req.body.newPassword2;
//   if (newPassword !== newPassword2) {
//     const error = appError.create(
//       "the password is not the same",
//       400,
//       httpStatus.FAIL
//     );
//     return next(error);
//   }
//   const hashPassword = await bcrypt.hash(newPassword, 10);
//   const newUser = await UserAll.findOne({ email: email });
//   newUser.password = hashPassword;
//   await newUser.save();
//   const error = appError.create(
//     "the password has been reset successfully",
//     200,
//     httpStatus.SUCCESS
//   );
//   return next(error);
// });

const logout2 = (req, res) => {
  // req.logout((err) => {
  //   if (err) {
  //     return res
  //       .status(500)
  //       .json("Logout failed! " + req.flash("error"))
  //       .redirect("/"); // أو يمكنك التعامل مع الخطأ بطريقة أخرى
  //   }
  //   res.redirect("/");
  // });
  (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Error during logout:", err);
        return res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }
      res.redirect("/login");
    });
  };
};
const success = (req, res, next) => {
  const error = appError.create("Login successful!", 200, httpStatus.SUCCESS);
  return next(error);
};
const failure = (req, res, next) => {
  const result = req.flash("error");
  // res.status(401).json("Login failed! " + req.flash("error"));
  const error = appError.create(result[0], 401, httpStatus.FAIL);
  return next(error);
};

// const logout = async (req, res) => {
//   if (req.isAuthenticated()) {
//     const { email } = req.user;

//     // توفير وظيفة callback
//     req.logout(() => {
//       // حذف البريد الإلكتروني من قاعدة البيانات
//       UserGoogle
//         .findOneAndDelete({ email })
//         .then(() => {
//           // حذف الكوكيز معرف المستخدم
//           res.clearCookie("userId");
//           res.clearCookie("sessionToken");
//           res.redirect("/");
//         })
//         .catch((err) => {
//           console.error("Error deleting user:", err);
//           res.redirect("/");
//         });
//     });

//     return;
//   }

//   // إذا لم يكن المستخدم قد قام بتسجيل الدخول، قم بتوجيهه إلى الصفحة الرئيسية أو أي مكان آخر
//   res.redirect("/");
// };

const deleteUser = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array()[0], 400, httpStatus.FAIL);
    return next(error);
  }
  const email = req.body.email;
  const user = await UserAll.findOne({ email: email });
  if (!user) {
    const error = appError.create(
      "not found this email !",
      400,
      httpStatus.FAIL
    );
    return next(error);
  }
  await UserAll.deleteOne({ email: email });
  const error = appError.create(
    "this email has been deleted",
    200,
    httpStatus.SUCCESS
  );
  return next(error);
});

//
module.exports = {
  deleteUser,
  historyUser,
  // forgotPassword,
  // resetPasswordSend,
  // resetPasswordOk,
  register,
  login,
  // logout,
  logout2,
  success,
  failure,
};
