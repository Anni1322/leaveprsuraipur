const User = require("../models/userModel");
const islogin = async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const userdata = await User.findById({ _id: user_id });

    if (userdata.Department_Admin === 1) {
      if (req.session.user_id) {
      } else {
        res.send("/home");
      }
      next();
    } else {
      res.send("/home");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const islogout = async (req, res, next) => {
  try {
    if (req.session.user_id) {
      res.redirect("/Department_Admin/home");
    }
    next();
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  islogin,
  islogout,
};
