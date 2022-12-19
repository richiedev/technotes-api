"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersController_1 = require("../controllers/usersController");
const router = (0, express_1.Router)();
const verifyJWT = require('../middleware/verifyJWT');
router.use(verifyJWT);
router.route('/')
    .get(usersController_1.getAllUsers)
    .post(usersController_1.createNewUser)
    .patch(usersController_1.updateUser)
    .delete(usersController_1.deleteUser);
exports.default = router;
