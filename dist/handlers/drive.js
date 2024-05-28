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
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const path = require("path");
require("dotenv").config();
const stringKey = process.env.DRIVE_KEY;
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
            driveId: "0ANYvByTFWGiMUk9PVA",
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
            q: `'${parentId}' in parents and trashed = false and name = '${name}'`,
        });
        return response.data;
    }
    catch (error) {
        // console.error("Error getting folder:", error.response.config.params)
        throw error;
    }
});
const createFolder = (parentId, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield driveService.files.create({
            requestBody: {
                driveId: "0ANYvByTFWGiMUk9PVA",
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
const getDrive = (driveID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield driveService.drives.get({
            driveId: "0ANYvByTFWGiMUk9PVA",
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
    getDrive,
    createFolder,
    getAboutUser,
};
//# sourceMappingURL=drive.js.map