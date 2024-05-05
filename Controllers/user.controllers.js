const { user1 } = require("../Models/user.models");
const appError = require("../utils/appError");
const httpStatus = require("../utils/httpStatus");
const asyncWrapper = require("../Middlewires/asyncWrapper");
const generateJwt = require("../utils/generate.jwt");
const { validationResult } = require("express-validator");
const emailVerfy = require("../Middlewires/sendEmail");
const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");
const UserAll = user1;
const folderphoto = "Avatar";

//register
const register = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array()[0], 400, httpStatus.FAIL);
    return next(error);
  }
  const { userName, email, numPhone, password, role } = req.body;
  const olduser = await UserAll.findOne({ email: email });
  if (olduser) {
    const error = appError.create("user already exists", 400, httpStatus.FAIL);
    return next(error);
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const verifyCode = await emailVerfy.sendEmail(email);
  const hashVerifyCode = await bcrypt.hash(JSON.stringify(verifyCode), 10);
  const token = await generateJwt.generateVerify({
    email: email,
    userName: userName,
    role: role,
    verifyCode: hashVerifyCode,
    numPhone: numPhone,
    password: hashPassword,
  });
  return res.status(200).json({
    status: httpStatus.SUCCESS,
    token: token.token,
    expireData: token.expireIn,
  });
});
const verify = asyncWrapper(async (req, res, next) => {
  // الحصول على التاريخ والوقت الحالي
  const currentDate = moment().tz("Africa/Cairo");
  const { email, verifyCode, password, numPhone, userName, role } =
    req.currentUser;
  //  console.log("req.file", req.file);
  const currentCode = verifyCode;
  const code = req.body.code;
  const matchedCode = await bcrypt.compare(code, currentCode);
  if (!matchedCode) {
    const error = appError.create(
      "the code verification not correct",
      400,
      httpStatus.FAIL
    );
    return next(error);
  }
  const oldEmail = await UserAll.findOne({ email: email });
  if (oldEmail) {
    const error = appError.create(
      "the email has been already registrated",
      400,
      httpStatus.FAIL
    );
    return next(error);
  }
  const newUser = new UserAll({
    userName,
    email,
    numPhone,
    password,
    role,
    date: currentDate.format("DD-MMM-YYYY hh:mm:ss a"),
  });
  await newUser.save();
  res.status(200).json({ status: httpStatus.SUCCESS });
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
    res.status(200).json({
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

//register
// const register2 = asyncWrapper(async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = appError.create(errors.array()[0], 400, httpStatus.FAIL);
//     return next(error);
//   }
//   const { userName, email, numPhone, password } = req.body;
//   const Avatar = email.split("@")[0];
//   const olduser = await UserAll.findOne({ email: email });
//   if (olduser) {
//     const error = appError.create("user already exists", 400, httpStatus.FAIL);
//     return next(error);
//   }
//   const hashPassword = await bcrypt.hash(password, 10);
//   const currentDate = moment().tz("Africa/Cairo");
//   const newUser = new UserAll({
//     userName: userName,
//     email: email,
//     avatar: `${Avatar}.png`,
//     password: hashPassword,
//     phone: numPhone,
//     date: currentDate.format("DD-MMM-YYYY hh:mm:ss a"),
//   });
//   await newUser.save();
//   return res.status(200).json({
//     status: httpStatus.SUCCESS,
//   });
// });

const allUser = async (req, res, next) => {
  const currentPhoto = `${req.protocol}://${req.get(
    "host"
  )}/${folderphoto}`;
  const User = await UserAll.find(
    {},
    { __v: false, role: false, date: false, password: false }
  );
  User.map((photo) => {
    photo.avatar = `${currentPhoto}/${photo.avatar}`;
  });
  if (!User) {
    const error = appError.create(
      "there not found Users!",
      401,
      statusText.FAIL
    );
    return next(error);
  }
  res.status(200).json(User);
};
//

const oneUser = async (req, res, next) => {
  const name = req.params.name;
  const currentPhoto = `${req.protocol}://${req.get(
    "host"
  )}/${folderphoto}`;
  const User = await UserAll.find(
    {_id : name},
    { __v: false, role: false, date: false, password: false}
  );
  User.map((photo) => {
    photo.avatar = `${currentPhoto}/${photo.avatar}`;
  });
  if (!User) {
    const error = appError.create(
      "this User not found try again !",
      401,
      statusText.FAIL
    );
    return next(error);
  }
  res.status(200).json(User);
};
module.exports = {
  deleteUser,
  // register2,
  allUser,
  oneUser,
  // forgotPassword,
  // resetPasswordSend,
  // resetPasswordOk,
  register,
  verify,
  login,
};
