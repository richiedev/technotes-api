"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require('express-async-errors');
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const logger_1 = require("./middleware/logger");
const corsOption_1 = __importDefault(require("./config/corsOption"));
const dbConn_1 = __importDefault(require("./config/dbConn"));
const root_1 = __importDefault(require("./routes/root"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const noteRoutes_1 = __importDefault(require("./routes/noteRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3500;
console.log(process.env.NODE_ENV);
(0, dbConn_1.default)();
app.use(logger_1.logger);
app.use((0, cors_1.default)(corsOption_1.default));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/', express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/', root_1.default);
app.use('/auth', authRoutes_1.default);
app.use('/users', userRoutes_1.default);
app.use('/notes', noteRoutes_1.default);
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path_1.default.join(__dirname, 'views', '404.html'));
    }
    else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' });
    }
    else {
        res.type('txt').send('404 Not Found');
    }
});
app.use(errorHandler_1.default);
mongoose_1.default.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
mongoose_1.default.connection.on('error', (err) => {
    console.log(err);
    (0, logger_1.logEvents)(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
});
