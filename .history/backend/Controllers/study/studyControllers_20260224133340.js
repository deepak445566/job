



export const uploadNote = async (req, res) => {
  try {
    // 1️⃣ Mode Check
    const user = await User.findById(req.user.id);

    if (user.mode === "chill") {
      return res.status(403).json({
        success: false,
        message:
          "Cannot upload notes in chill mode. Switch to study mode first!",
        currentMode: user.mode,
      });
    }

    // 2️⃣ Get Data
    const { title, description, subject, tags } = req.body;
    const file = req.file;

    // 3️⃣ Validation
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    if (!title || !subject) {
      return res.status(400).json({
        success: false,
        message: "Title and subject are required",
      });
    }

    // 4️⃣ Upload to Cloudinary (using file.path)
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "study-notes",
      resource_type: "auto",
    });

    // 5️⃣ Save in DB
    const note = await Note.create({
      user: req.user.id,
      title,
      description,
      subject,
      fileUrl: result.secure_url,
      fileType: result.resource_type,
      tags: tags ? tags.split(",") : [],
    });

    // 6️⃣ Update User Stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalNotes: 1, reputation: 5 },
    });

    res.status(201).json({
      success: true,
      note,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get All Notes
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find()
      .populate("user", "username profilePic")
      .sort("-createdAt");

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Single Note (increase download)
export const getSingleNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    ).populate("user", "username profilePic");

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete Note
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // delete from cloudinary
    const publicId = note.fileUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`study-notes/${publicId}`);

    await note.deleteOne();

    res.json({ message: "Note deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Bookmark Note
export const bookmarkNote = async (req, res) => {
  try {
    const noteId = req.params.id;

    await Note.findByIdAndUpdate(noteId, {
      $addToSet: { bookmarks: req.user._id },
    });

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { savedNotes: noteId },
    });

    res.json({ message: "Note bookmarked" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const askDoubt = async (req, res) => {
  try {
    const { title, description, subject, image, tags } = req.body;

    const doubt = await Doubt.create({
      user: req.user._id,
      title,
      description,
      subject,
      image,
      tags: tags ? tags.split(",") : [],
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalDoubts: 1 },
    });

    res.status(201).json(doubt);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find()
      .populate("user", "username profilePic")
      .sort("-createdAt");

    res.json(doubts);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Single Doubt
export const getSingleDoubt = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id)
      .populate("user", "username profilePic")
      .populate({
        path: "answers",
      });

    res.json(doubt);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const postAnswer = async (req, res) => {
  try {
    const { doubtId, answerText } = req.body;

    const answer = await Answer.create({
      doubt: doubtId,
      user: req.user._id,
      answerText,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalAnswers: 1, reputation: 10 },
    });

    res.status(201).json(answer);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Upvote Answer
export const upvoteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { upvotes: req.user._id } },
      { new: true }
    );

    await User.findByIdAndUpdate(answer.user, {
      $inc: { reputation: 2 },
    });

    res.json(answer);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Accept Answer (Resolve Doubt)
export const acceptAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id).populate("doubt");

    if (answer.doubt.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    answer.isAccepted = true;
    await answer.save();

    await Doubt.findByIdAndUpdate(answer.doubt._id, {
      isResolved: true,
      resolvedBy: answer.user,
    });

    await User.findByIdAndUpdate(answer.user, {
      $inc: { reputation: 20 },
    });

    res.json({ message: "Answer accepted & doubt resolved" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};