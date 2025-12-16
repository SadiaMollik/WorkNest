const User = require("../models/userModel");

const getUser = async (req, res) => {
  try {
    const allUsers = await User.find();
    if (!allUsers || allUsers.length === 0) {
      res.json({
        message: "There is no user.",
      });
    }
    res.status(200).json({
      success: true,
      users: allUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

const getSingleUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const singleUser = await User.findOne({ uid });
    res.status(200).json({
      users: singleUser,
    });
  } catch (error) {
    console.log(error);
  }
};

const createUser = async (req, res) => {
  try {
    const { uid, name, email, role, companyName } = req.body;
    const newUsers = new User({ uid, name, email, role, companyName });
    await newUsers.save();
    res.status(200).json({
      users: newUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

const getUserRoleByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      role: user.role,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, companyName } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role, companyName },
      { new: true }
    );
    res.status(200).json({
      users: updatedUser,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      res.json({
        message: "User not found, cannot be deleted!!",
      });
    }

    res.status(200).json({
      message: "User deleted successfully!!",
      users: deletedUser,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getUser,
  getUserRoleByEmail,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
};
