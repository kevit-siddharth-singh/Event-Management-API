import mongoose from 'mongoose'

// Defining the User schema
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

// Exporting the User model
export default mongoose.model('User', userSchema)
