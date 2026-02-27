import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../models/auth/UserModels.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    // 2. Check existing user
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // 5. Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d", // token expiry = 7 days
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // HTTPS mandatory
      sameSite: "none", // cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 7. Response
    return res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        mode: user.mode,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 2. Check user exists
    const user = await User.findOne();
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 4. Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // HTTPS mandatory
      sameSite: "none", // cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 6. Response
    return res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        mode: user.mode,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Loged out success",
  });
};

export const getMe = async (req, res) => {
  try {
    // req.user comes from protect middleware
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        mode: user.mode,
      },
    });
  } catch (error) {
    console.log("Get Me Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const isAuth = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
