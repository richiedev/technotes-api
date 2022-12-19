import { Document } from "mongoose";

export interface INote extends Document {
    user: string;
    title: string;
    text: string;
    completed: boolean;
}