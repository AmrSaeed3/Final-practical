const { body } = require("express-validator");

const validationSchema = () => {
  return [
    body("signup_email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email is not avalid"),
    body("signup_password")
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 4 })
      .withMessage("password at least is 4 digits"),
    body("confirm_password")
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 4 })
      .withMessage("password at least is 4 digits"),  
  ];
};
const validationSchema2 = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email is not avalid"),
    body("password")
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 4 })
      .withMessage(" password at least is 4 digits"),
  ];
};
const validationSchema3 = () => {
  return [
    body("newPassword")
      .notEmpty()
      .withMessage("newPassword is required")
      .isLength({ min: 4 })
      .withMessage("newPassword at least is 4 digits"),
    body("newPassword2")
      .notEmpty()
      .withMessage("newPassword is required")
      .isLength({ min: 4 })
      .withMessage("newPassword at least is 4 digits"),
  ];
};

const validationSchema4 = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email is not avalid"),
  ];
};
module.exports = {
  validationSchema,
  validationSchema2,
  validationSchema3,
  validationSchema4,
};
