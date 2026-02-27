import User from "../models/auth/UserModels.js";

export const getMode = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("mode");

    res.json({
      success: true,
      mode: user.mode,
    });
  } catch (error) {
    console.log("Get Mode Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const switchMode = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Toggle mode
    user.mode = user.mode === "chill" ? "study" : "chill";
    await user.save();

    res.json({
      success: true,
      mode: user.mode,
      message: `Switched to ${user.mode} mode`,
    });
  } catch (error) {
    console.log("Switch Mode Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
