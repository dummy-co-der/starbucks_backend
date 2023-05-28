const mongoose = require("mongoose");
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");
dotenv.config();

mongoose.connect(process.env.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const userSchema = new mongoose.Schema({
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
  },
});

userSchema.methods.comparePassword = async function (password) {
  return password === this.Password;
};

const User = mongoose.model("User", userSchema);

const signin = asyncHandler(async (req, res) => {
  const { Email, Password } = req.body;
  try {
    const userExist = await User.findOne({ Email });
    if (userExist) {
      res.status(400);
      throw new Error("User Already Exists");
    }
    const user = new User({
      Email,
      Password,
    });
    await user.save();
    res.status(200).json({
      _id: user._id,
      Email: user.Email,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const signout = asyncHandler(async (req, res) => {
  const { Email, Password } = req.body;
  try {
    const user = await User.findOne({ Email });
    if (user) {
      const isPasswordCorrect = await user.comparePassword(Password);
      if (isPasswordCorrect) {
        res.json({
          _id: user._id,
          Email: user.Email,
        });
      } else {
        res.status(403);
        throw new Error("Invalid Email or Password");
      }
    } else {
      res.status(403);
      throw new Error("Invalid Email or Password");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = { signin, signout };
