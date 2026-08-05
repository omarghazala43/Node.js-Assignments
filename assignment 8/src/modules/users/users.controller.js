import { Router } from "express";
import user from "../../DB/models/users.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { auth } from "../../utils/middleware/auth.middleware.js";
import { myEncryption, myHash } from "../../utils/security/security.js";

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const existUser = await user.findOne({ email: req.body.email });
    if (existUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await myHash(req.body.password);

    const encryptedPhone = myEncryption(req.body.phone);

    const newUser = await user.create({
      ...req.body,
      password: hashedPassword,
      phone: encryptedPhone,
    });

    res.status(201).json({ message: "User added successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const loginUser = await user.findOne({ email });

    if (!loginUser)
      return res.status(404).json({ message: "Invalid email or password" });

    const checkPassword = await bcrypt.compare(password, loginUser.password);

    if (!checkPassword)
      return res.status(404).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: loginUser._id }, "omar", {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "login successfully", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

userRouter.patch("/update", auth, async (req, res) => {
  try {
    const userId = req.userId;

    const checkUser = await user.findOne({ _id: userId });
    if (!checkUser) return res.status(404).json({ message: "User not found" });

    let { name, email, phone, age, password } = req.body;

    const userExist = await user.findOne({ email, _id: { $ne: userId } });

    if (password) {
      return res.status(400).json({
        message: "Password cannot be updated",
      });
    }

    if (userExist)
      return res.status(409).json({ message: "Email already exists" });

    if (phone) {
      const encryptedPhone = myEncryption(phone);
      phone = encryptedPhone;
    }

    const updatedUser = await user.findByIdAndUpdate(
      userId,
      { name, email, phone, age },
      { returnDocument: "after", runValidators: true },
    );

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

userRouter.delete("/delete", auth, async (req, res) => {
  try {
    const userId = req.userId;

    const myUser = await user.findOne({ _id: userId });

    if (!myUser) return res.status(404).json({ message: "User not found" });

    await user.deleteOne({ _id: userId });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

userRouter.get("/profile", auth, async (req, res) => {
  try {
    const userId = req.userId;

    const myUser = await user.findOne({ _id: userId });

    if (!myUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ Profile: myUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default userRouter;
