"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanEmails = exports.encodeFileToBase64 = void 0;
const fs_1 = __importDefault(require("fs"));
const encodeFileToBase64 = (filePath) => {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data.toString("base64"));
            }
        });
    });
};
exports.encodeFileToBase64 = encodeFileToBase64;
const cleanEmails = (emails) => {
    const cleanSlash = emails.replace(/\//g, ",");
    return cleanSlash.split(",");
};
exports.cleanEmails = cleanEmails;
//# sourceMappingURL=tools.js.map