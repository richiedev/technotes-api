import mongoose, { model, Schema } from "mongoose";
import { IUser } from "../types/user";

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        default: ["Employee"]
    },
    active: {
        type: Boolean,
        default: true
    }
});

export default model<IUser>('User', userSchema);