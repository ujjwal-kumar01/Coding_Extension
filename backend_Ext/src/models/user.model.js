import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // lowercase: true,
    // trim: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
    console.log("saving")
  if (!this.isModified("password")) return next();
    console.log("saving2")
  try {
    console.log("saving3")
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    console.error("Error hashing password:", err);
    next(err); // Don't swallow the error — pass it to Mongoose
  }
});



// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model("User", userSchema);
