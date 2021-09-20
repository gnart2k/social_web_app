const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const { json } = require("express");

//update user
router.put("/:id", async (req, res) => {
  if (req.body._id == req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

//delete user account
router.delete("/:id", async (req, res) => {
  if (req.body._id == req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("account deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("user not found");
  }
});

//get a user
router.get("/:id", async (req, res) => {
  try {
    const data = await User.findById(req.params.id);
    const { password, isAdmin, createdAt, updatedAt, ...other } = data._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
});

//follow User

router.put("/:id/follow", async (req, res) => {
  if (req.body._id != req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body._id);
      if (!user.followers.includes(req.body._id)) {
        await user.updateOne({ $push: { followers: req.body._id } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("followed");
      } else {
        await user.updateOne({ $pull: { followers: req.body._id } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("unfollowed");
      }
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  } else {
    res.status(403).json({ message: "you can't follow yourself" });
  }
});
//get all user
router.get("/all-user/:id", async (req, res) => {
  try {
    const allUser = await User.find({});
    const otherUser = allUser.filter((other) => other._id != req.params.id);
    res.status(200).json(otherUser);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
