"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notesController_1 = require("../controllers/notesController");
const router = (0, express_1.Router)();
const verifyJWT = require('../middleware/verifyJWT');
router.use(verifyJWT);
router.route('/')
    .get(notesController_1.getAllNotes)
    .post(notesController_1.createNewNote)
    .patch(notesController_1.updateNote)
    .delete(notesController_1.deleteNote);
exports.default = router;
