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
const googleapis_1 = require("googleapis");
require("dotenv").config();
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const stringKey = process.env.DRIVE_KEY;
const DRIVE_ID = process.env.DRIVE_ID;
const key = JSON.parse(stringKey);
const auth = new googleapis_1.google.auth.GoogleAuth({
    credentials: key,
    scopes: ["https://www.googleapis.com/auth/drive"],
});
const driveService = googleapis_1.google.drive({ version: "v3", auth });
const getFile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield driveService.files.get({
            fields: "name, parents, webViewLink",
            fileId: id,
            supportsAllDrives: true,
        });
        return response.data;
    }
    catch (error) {
        console.error("Error getting folder:", error);
        throw error;
    }
});
const getFilesList = (parentId, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield driveService.files.list({
            corpora: "drive",
            driveId: DRIVE_ID,
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
            q: `'${parentId}' in parents and trashed = false and name = '${name}'`,
        });
        return response.data;
    }
    catch (error) {
        console.error("Error getting folder:", error);
        throw error;
    }
});
const getPNG = (parentId, fileId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield driveService.files.list({
            corpora: "drive",
            driveId: DRIVE_ID,
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
            q: `'${parentId}' in parents and trashed = false and name contains '${fileId}' and mimeType contains 'image/png'`,
        });
        return response.data;
    }
    catch (error) {
        console.error("Error getting folder:", error);
        throw error;
    }
});
const createFolder = (parentId, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield driveService.files.create({
            requestBody: {
                driveId: DRIVE_ID,
                name: name,
                parents: [parentId],
                mimeType: "application/vnd.google-apps.folder",
            },
            supportsAllDrives: true,
        });
        return response.data;
    }
    catch (error) {
        console.error("Error creating folder:", error);
        throw error;
    }
});
const downloadPNG = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        try {
            const filePath = path_1.default.join("src", "assets/img/media.png");
            const dest = fs_1.default.createWriteStream(filePath);
            driveService.files.get({
                fileId: id,
                alt: "media",
            }, {
                responseType: "stream",
            }, (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                res.data
                    .on("end", () => {
                    console.log("File downloaded");
                    resolve(filePath);
                })
                    .on("error", (error) => {
                    reject(error);
                })
                    .pipe(dest);
            });
        }
        catch (err) {
            reject(err);
        }
    });
});
const getDrive = (driveID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield driveService.drives.get({
            driveId: driveID,
            fields: "name",
        });
        return response.data;
    }
    catch (error) {
        console.error("Error getting drive:", error);
        throw error;
    }
});
const getAboutUser = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield driveService.about.get({
            fields: "user",
        });
        return response.data;
    }
    catch (error) {
        console.error("Error getting user:", error);
        throw error;
    }
});
module.exports = {
    getFile,
    getFilesList,
    getPNG,
    downloadPNG,
    getDrive,
    createFolder,
    getAboutUser,
};
//# sourceMappingURL=drive.js.map