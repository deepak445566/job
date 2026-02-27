import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    mode: {
    type: String,
    enum: ['chill', 'study'],
    default: 'chill'
  },

    fullName: { type: String, default: '' },
    bio: { type: String, default: '' },
    profilePic: { type: String, default: 'https://via.placeholder.com/150' },

  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

  },



  
  {
  timestamps: true
}
 
);

const User = mongoose.models.user || mongoose.model("User", userSchema);
export default User;
