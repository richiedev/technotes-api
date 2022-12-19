"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
const loginLimiter = require('../middleware/loginLimiter');
router.route('/')
    .post(loginLimiter, authController_1.login);
router.route('/refresh')
    .get(authController_1.refresh);
router.route('/logout')
    .post(authController_1.logout);
exports.default = router;
