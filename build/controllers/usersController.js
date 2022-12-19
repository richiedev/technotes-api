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
exports.deleteUser = exports.updateUser = exports.createNewUser = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const Note_1 = __importDefault(require("../models/Note"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get all users from MongoDB
    const users = yield User_1.default.find().select('-password').lean();
    // If no users 
    if (!(users === null || users === void 0 ? void 0 : users.length)) {
        return res.status(400).json({ message: 'No users found' });
    }
    res.json(users);
});
exports.getAllUsers = getAllUsers;
// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, roles } = req.body;
    // Confirm data
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    // Check for duplicate username
    const duplicate = yield User_1.default.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' });
    }
    // Hash password 
    const hashedPwd = yield bcrypt_1.default.hash(password, 10); // salt rounds
    const userObject = (!Array.isArray(roles) || !roles.length)
        ? { username, "password": hashedPwd }
        : { username, "password": hashedPwd, roles };
    // Create and store new user 
    const user = yield User_1.default.create(userObject);
    if (user) { //created 
        res.status(201).json({ message: `New user ${username} created` });
    }
    else {
        res.status(400).json({ message: 'Invalid user data received' });
    }
});
exports.createNewUser = createNewUser;
// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, username, roles, active, password } = req.body;
    // Confirm data 
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' });
    }
    // Does the user exist to update?
    const user = yield User_1.default.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    // Check for duplicate 
    const duplicate = yield User_1.default.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec();
    // Allow updates to the original user 
    if (duplicate && (duplicate === null || duplicate === void 0 ? void 0 : duplicate._id.toString()) !== id) {
        return res.status(409).json({ message: 'Duplicate username' });
    }
    user.username = username;
    user.roles = roles;
    user.active = active;
    if (password) {
        // Hash password 
        user.password = yield bcrypt_1.default.hash(password, 10); // salt rounds 
    }
    const updatedUser = yield user.save();
    res.json({ message: `${updatedUser.username} updated` });
});
exports.updateUser = updateUser;
// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' });
    }
    // Does the user still have assigned notes?
    const note = yield Note_1.default.findOne({ user: id }).lean().exec();
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' });
    }
    // Does the user exist to delete?
    const user = yield User_1.default.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    const result = yield user.deleteOne();
    const reply = `Username ${result.username} with ID ${result._id} deleted`;
    res.json(reply);
});
exports.deleteUser = deleteUser;
