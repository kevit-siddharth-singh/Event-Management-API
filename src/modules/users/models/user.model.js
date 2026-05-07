import mongoose from 'mongoose'
import { ROLES } from '../../../common/config/constants.js'

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
        role: {
            type: String,
            default: ROLES.USER,
            enum: Object.values(ROLES),
            required: true,
        },
    },
    { timestamps: true }
)

// Exporting the User model
export default mongoose.model('User', userSchema)
