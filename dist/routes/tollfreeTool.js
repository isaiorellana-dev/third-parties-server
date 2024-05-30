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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const { getDatabase } = require("../handlers/notion");
dotenv_1.default.config();
const router = express_1.default.Router();
router.post("/tollfree-info", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const properties = [
        "title",
        "J%60EY",
        "gcGS",
        "cGjB",
        "~qCZ",
        "O%5EfE",
        "kG%3Du",
        "kI%5C%3E",
        "ic%7DS",
        "V~%7BJ",
    ];
    const DB_ID = process.env.STORES_DB_ID;
    const start_cursor = req.body.start_cursor;
    try {
        const response = yield getDatabase(DB_ID, properties, start_cursor);
        res.json(response);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error en la solicitud a Notion");
    }
}));
module.exports = router;
//# sourceMappingURL=tollfreeTool.js.map