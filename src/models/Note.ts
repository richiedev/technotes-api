import { INote } from "../types/note";
import mongoose, { model, Schema } from "mongoose";
const AutoIncrement = require('mongoose-sequence')(mongoose);

const noteSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

noteSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 500
})

export default model<INote>('Note', noteSchema);