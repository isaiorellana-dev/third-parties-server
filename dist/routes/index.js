"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tfRouter = require("./tollfreeTool");
const notionRouter = require("./notionWebhooks");
const rootRouter = (app) => {
    const router = express_1.default.Router();
    app.use(router);
    router.use("/th", tfRouter);
    router.use("/n", notionRouter);
};
module.exports = rootRouter;
//# sourceMappingURL=index.js.map