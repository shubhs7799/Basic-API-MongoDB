const { Schema } = require("mongoose");
const validator = require("validator");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      default: "First Name",
      trim: true,
      maxLength: 10,
      minLength: 4,
    },
    lastName: {
      type: String,
      default: "Last Name",
      maxLength: 10,
      minLength: 4,
      trim: true,
    },
    age: {
      type: Number,
      min: 18,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      validate(value) {
        if (!["male", "feamle", "other"].includes(value)) {
          throw new Error("Invalid Gender" + value);
        }
      },
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email ID" + value);
        }
      },
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      minLength: 8,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is weak" + value);
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://emojiisland.com/cdn/shop/products/Unknown_Man_Emoji_large.png?v=1571606038",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo Url" + value);
        }
      },
    },
    about: {
      type: String,
      default: "About me !!",
      maxLength: 100,
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  token = await jwt.sign({_id : user._id},"SECREAT_KEY_2025", { expiresIn: '1h' });
  return token ;
};

userSchema.methods.verifyPassword = async function (InputPassword){
  const user = this;
  const IsPasswordValid = await bcrypt.compare(InputPassword, user.password);
  return IsPasswordValid ;
};

module.exports = mongoose.model("User", userSchema);
