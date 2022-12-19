"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.createNewNote = exports.getAllNotes = void 0;
const User_1 = __importDefault(require("../models/User"));
const Note_1 = __importDefault(require("../models/Note"));
// @desc Get all notes 
// @route GET /notes
// @access Private
const getAllNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get all notes from MongoDB
    const notes = yield Note_1.default.find().lean();
    // If no notes 
    if (!(notes === null || notes === void 0 ? void 0 : notes.length)) {
        return res.status(400).json({ message: 'No notes found' });
    }
    // Add username to each note before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const notesWithUser = yield Promise.all(notes.map((note) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield User_1.default.findById(note.user).lean().exec();
        return Object.assign(Object.assign({}, note), { username: user.username });
    })));
    res.json(notesWithUser);
});
exports.getAllNotes = getAllNotes;
// @desc Create new note
// @route POST /notes
// @access Private
const createNewNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, title, text } = req.body;
    // Confirm data
    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    // Check for duplicate title
    const duplicate = yield Note_1.default.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate note title' });
    }
    // Create and store the new user 
    const note = yield Note_1.default.create({ user, title, text });
    if (note) { // Created 
        return res.status(201).json({ message: 'New note created' });
    }
    else {
        return res.status(400).json({ message: 'Invalid note data received' });
    }
});
exports.createNewNote = createNewNote;
// @desc Update a note
// @route PATCH /notes
// @access Private
const updateNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, user, title, text, completed } = req.body;
    // Confirm data
    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' });
    }
    // Confirm note exists to update
    const note = yield Note_1.default.findById(id).exec();
    if (!note) {
        return res.status(400).json({ message: 'Note not found' });
    }
    // Check for duplicate title
    const duplicate = yield Note_1.default.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec();
    // Allow renaming of the original note 
    if (duplicate && (duplicate === null || duplicate === void 0 ? void 0 : duplicate._id.toString()) !== id) {
        return res.status(409).json({ message: 'Duplicate note title' });
    }
    note.user = user;
    note.title = title;
    note.text = text;
    note.completed = completed;
    const updatedNote = yield note.save();
    res.json(`'${updatedNote.title}' updated`);
});
exports.updateNote = updateNote;
// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Note ID required' });
    }
    // Confirm note exists to delete 
    const note = yield Note_1.default.findById(id).exec();
    if (!note) {
        return res.status(400).json({ message: 'Note not found' });
    }
    const result = yield note.deleteOne();
    const reply = `Note '${result.title}' with ID ${result._id} deleted`;
    res.json(reply);
});
exports.deleteNote = deleteNote;
