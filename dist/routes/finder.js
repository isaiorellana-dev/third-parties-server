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
const { getFilesByName } = require("../handlers/drive");
const router = express_1.default.Router();
router.get("/img", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.query.name;
    try {
        const files = yield getFilesByName(name);
        res.status(200).json(files);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}));
module.exports = router;
//# sourceMappingURL=finder.js.map