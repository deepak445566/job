import User from "../models/UserModels.js";

// @desc    Get Current Mode
// @route   GET /api/mode
export const getMode = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('mode');
    
    res.json({
      success: true,
      mode: user.mode
    });
  } catch (error) {
    console.log("Get Mode Error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

export const switchMode = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Toggle mode
    user.mode = user.mode === 'chill' ? 'study' : 'chill';
    await user.save();
    
    res.json({
      success: true,
      mode: user.mode,
      message: `Switched to ${user.mode} mode`
    });
    
  } catch (error) {
    console.log("Switch Mode Error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

export const setMode = async (req, res) => {
  try {
    const { mode } = req.body;
    
    if (!mode || !['chill', 'study'].includes(mode)) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid mode (chill or study)"
      });
    }
    
    const user = await User.findById(req.user._id);
    user.mode = mode;
    await user.save();
    
    res.json({
      success: true,
      mode: user.mode,
      message: `Mode set to ${mode}`
    });
    
  } catch (error) {
    console.log("Set Mode Error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};