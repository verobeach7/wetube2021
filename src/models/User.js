import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: String,
  socialOnly: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  location: String,
});

// 스키마를 사용하는 모델에서 함수로 사용 가능, 미들웨어처럼 작동함, model.save() 사용하면 pre hook으로 작동
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);
export default User;
