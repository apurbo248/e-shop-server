const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      default: '',
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "user",
    },
    avatar: {
      url: {
        type: String,
        required: true,
        default:
          "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.seekpng.com%2Fipng%2Fu2y3q8t4t4o0a9a9_my-profile-icon-blank-profile-image-circle%2F&psig=AOvVaw00W4yGBjOAtjBlxWWW2Cly&ust=1653141986799000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCIi4q_uf7vcCFQAAAAAdAAAAABAD",
      },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },

  { timestamps: true }
);

const User = mongoose.model("AllUser", userSchema);
module.exports = User;
